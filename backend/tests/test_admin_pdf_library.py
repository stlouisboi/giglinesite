"""PDF Library — kit-files endpoints regression (auth, group param, dedupe)."""

import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
if not BASE_URL:
    with open('/app/frontend/.env') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                BASE_URL = line.split('=', 1)[1].strip().rstrip('/')

API = f"{BASE_URL}/api"
ADMIN_PASSWORD = "gigline2026"


@pytest.fixture
def s():
    return requests.Session()


# ── list-kit-files ────────────────────────────────────────────────────────────

def test_list_requires_auth(s):
    assert s.get(f"{API}/admin/kit-files").status_code == 401


def test_list_default_group_is_supervisor_kit(s):
    r = s.get(f"{API}/admin/kit-files?token={ADMIN_PASSWORD}")
    assert r.status_code == 200
    assert r.json()["group"] == "supervisor_kit"


@pytest.mark.parametrize("group,min_expected", [
    ("citation_proof_kit", 4),
    ("hazcom", 3),
    ("supervisor_kit", 11),
])
def test_list_returns_expected_pdf_counts(s, group, min_expected):
    r = s.get(f"{API}/admin/kit-files?token={ADMIN_PASSWORD}&group={group}")
    assert r.status_code == 200
    d = r.json()
    assert d["group"] == group
    assert d["expected"] >= min_expected
    # every listed file must have a filename and on_disk flag
    for f in d["files"]:
        assert "filename" in f and "on_disk" in f
        assert isinstance(f["on_disk"], bool)


def test_list_citation_proof_dedupes_binder_and_control_system(s):
    """Binder tier ($600) reuses the Control System PDF, so the endpoint must
    return 4 unique files, not 6."""
    r = s.get(f"{API}/admin/kit-files?token={ADMIN_PASSWORD}&group=citation_proof_kit")
    filenames = [f["filename"] for f in r.json()["files"]]
    assert len(filenames) == len(set(filenames)) == 4


def test_list_rejects_unknown_group(s):
    assert s.get(f"{API}/admin/kit-files?token={ADMIN_PASSWORD}&group=bogus").status_code == 400


def test_list_includes_group_label(s):
    r = s.get(f"{API}/admin/kit-files?token={ADMIN_PASSWORD}&group=citation_proof_kit")
    assert "Citation-Proof" in r.json()["group_label"]


# ── download-kit-file ─────────────────────────────────────────────────────────

def test_download_requires_auth(s):
    assert s.get(f"{API}/admin/kit-files/any.pdf").status_code == 401


def test_download_rejects_unknown_group(s):
    r = s.get(f"{API}/admin/kit-files/anything.pdf?token={ADMIN_PASSWORD}&group=bogus")
    assert r.status_code == 400


def test_download_rejects_filename_outside_group(s):
    """A supervisor-kit filename passed with group=citation_proof_kit must 404."""
    supervisor_r = s.get(f"{API}/admin/kit-files?token={ADMIN_PASSWORD}&group=supervisor_kit")
    sv_names = [f["filename"] for f in supervisor_r.json()["files"] if f["on_disk"]]
    if not sv_names:
        pytest.skip("No supervisor-kit PDFs on disk in this env")
    r = s.get(f"{API}/admin/kit-files/{sv_names[0]}?token={ADMIN_PASSWORD}&group=citation_proof_kit")
    assert r.status_code == 404


def test_download_citation_proof_pdf_streams(s):
    r = s.get(f"{API}/admin/kit-files?token={ADMIN_PASSWORD}&group=citation_proof_kit")
    on_disk = [f for f in r.json()["files"] if f["on_disk"]]
    if not on_disk:
        pytest.skip("No citation-proof PDFs on disk in this env")
    fn = on_disk[0]["filename"]
    r2 = s.get(f"{API}/admin/kit-files/{fn}?token={ADMIN_PASSWORD}&group=citation_proof_kit", stream=True)
    assert r2.status_code == 200
    assert r2.headers.get("content-type", "").startswith("application/pdf")
    # first 4 bytes should be the PDF magic number
    first_bytes = next(r2.iter_content(4))
    assert first_bytes.startswith(b"%PDF"), f"expected PDF magic, got {first_bytes!r}"
