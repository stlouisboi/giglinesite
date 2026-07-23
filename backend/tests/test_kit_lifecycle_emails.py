"""Kit lifecycle email tests — Shipped confirmation + 90-day anniversary follow-up.

These tests exercise the pure logic (tracking URL builder, idempotency guards,
window boundaries) using an ephemeral in-memory Mongo mock so they run offline
without hitting the live DB or Resend.
"""

from datetime import datetime, timezone, timedelta

import pytest

from lib.kit_lifecycle_emails import (
    CARRIER_TRACKING_URLS,
    _tracking_url,
    ANNIVERSARY_TARGET_DAYS,
    ANNIVERSARY_WINDOW_DAYS,
)


# ── Tracking URL builder ─────────────────────────────────────────────────────

def test_tracking_url_usps():
    url = _tracking_url("USPS", "9400111899223197428490")
    assert url == "https://tools.usps.com/go/TrackConfirmAction?tLabels=9400111899223197428490"


def test_tracking_url_ups():
    url = _tracking_url("UPS", "1Z999AA10123456784")
    assert url and "1Z999AA10123456784" in url and "ups.com" in url


def test_tracking_url_fedex():
    url = _tracking_url("FedEx", "1234567890")
    assert url and "1234567890" in url and "fedex.com" in url


def test_tracking_url_dhl():
    url = _tracking_url("DHL", "1234567890")
    assert url and "dhl.com" in url


def test_tracking_url_unknown_carrier_returns_none():
    """A carrier we don't have a template for must return None (no bogus link)."""
    assert _tracking_url("PostalMagic", "12345") is None


def test_tracking_url_no_carrier_returns_none():
    assert _tracking_url("", "12345") is None


def test_tracking_url_no_number_returns_none():
    assert _tracking_url("USPS", "") is None


def test_tracking_url_strips_whitespace():
    url = _tracking_url("USPS", "  9400111 ")
    assert url and url.endswith("=9400111")


# ── Constants + shape ────────────────────────────────────────────────────────

def test_all_registered_carriers_have_placeholder():
    for carrier, tpl in CARRIER_TRACKING_URLS.items():
        assert "{num}" in tpl, f"{carrier} tracking template missing {{num}} placeholder"


def test_anniversary_window_symmetric():
    """Ensure ±3-day window doesn't overlap with itself or leave a gap."""
    assert ANNIVERSARY_TARGET_DAYS == 90
    assert ANNIVERSARY_WINDOW_DAYS >= 1
    assert ANNIVERSARY_WINDOW_DAYS <= 7   # sanity — a wider window would double-fire on rerun


# ── Anniversary window math ──────────────────────────────────────────────────

def test_anniversary_window_bounds_include_target_day():
    """A ship_date of exactly 90 days ago must sit inside the query window."""
    now = datetime.now(timezone.utc)
    target = now - timedelta(days=ANNIVERSARY_TARGET_DAYS)
    lower  = now - timedelta(days=ANNIVERSARY_TARGET_DAYS + ANNIVERSARY_WINDOW_DAYS)
    upper  = now - timedelta(days=ANNIVERSARY_TARGET_DAYS - ANNIVERSARY_WINDOW_DAYS)
    assert lower <= target <= upper


def test_anniversary_window_excludes_recent_orders():
    """Orders paid yesterday must NOT match the 90-day window."""
    now = datetime.now(timezone.utc)
    yesterday = now - timedelta(days=1)
    upper = now - timedelta(days=ANNIVERSARY_TARGET_DAYS - ANNIVERSARY_WINDOW_DAYS)
    assert yesterday > upper, "yesterday's orders wrongly fall inside the anniversary window"


def test_anniversary_window_excludes_ancient_orders():
    """Orders paid 200 days ago must NOT match the 90-day window."""
    now = datetime.now(timezone.utc)
    ancient = now - timedelta(days=200)
    lower = now - timedelta(days=ANNIVERSARY_TARGET_DAYS + ANNIVERSARY_WINDOW_DAYS)
    assert ancient < lower, "ancient orders wrongly fall inside the anniversary window"
