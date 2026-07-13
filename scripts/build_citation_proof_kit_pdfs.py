"""Build the two $150 Digital Compliance Kit deliverables:
  1. LOTO Digital Compliance Kit
  2. Forklift / PIT Digital Compliance Kit

For each: prepend the GigLine v3 branded cover to the LibreOffice-rendered PDF
and save the result under /app/backend/kit_files/.

Run this once after uploading (or updating) the source DOCX files:
    python /app/scripts/build_citation_proof_kit_pdfs.py

Idempotent — outputs are always overwritten.
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

# Ensure the backend package is importable
BACKEND = Path('/app/backend').resolve()
if str(BACKEND) not in sys.path:
    sys.path.insert(0, str(BACKEND))

from lib.pdf_cover import prepend_cover_to_pdf  # noqa: E402


ASSETS = {
    'loto-readiness-kit': {
        'source_docx_url': 'https://customer-assets.emergentagent.com/job_z-project-9/artifacts/jd4cc53v_GigLine_LOTO_Digital_Compliance_Kit_.docx',
        'output_pdf': '/app/backend/kit_files/GigLine_LOTO_Digital_Compliance_Kit_150.pdf',
        'cover': {
            'title': 'Machine-Specific LOTO Readiness Kit',
            'subtitle': 'Digital Compliance Kit — $150',
            'body': (
                'Documented, machine-specific lockout procedures your team '
                'can follow on the floor — with photo isolation maps, a 0–100 '
                'self-audit mapped to the CFR sub-paragraphs OSHA cites, and '
                'the exact sequence of records an inspector asks for first.'
            ),
            'header_slug': 'CITATION-PROOF KIT SERIES  |  VERSION 1.0',
            'version_footer': 'Version 1.0',
            'whats_inside_heading': "What's Inside",
            'whats_inside_items': [
                'Machine-Specific Procedure Builder™',
                'Photo Lockout Map™ template',
                'Citation-Proof Score™ Rubric',
                "Inspector's First 10 Questions Card",
                'Authorized Employee Certification',
                'Annual Periodic Inspection Form',
                'Regulatory Basis & Sources',
            ],
            'process_flow': ['Identify', 'Shut Down', 'Isolate', 'Verify', 'Certify'],
            'footer_line': 'GigLine Safety & Compliance  |  29 CFR 1910.147',
        },
    },
    'forklift-pit-readiness-kit': {
        'source_docx_url': 'https://customer-assets.emergentagent.com/job_z-project-9/artifacts/ryl7act9_GigLine_PIT_Digital_Compliance_Kit_150.docx',
        'output_pdf': '/app/backend/kit_files/GigLine_PIT_Digital_Compliance_Kit_150.pdf',
        'cover': {
            'title': 'Forklift / PIT Readiness Kit',
            'subtitle': 'Digital Compliance Kit — $150',
            'body': (
                'The three-part training program, four-element certification, '
                'three-year re-evaluation tracker, refresher-trigger log, and '
                'daily pre-shift inspection — mapped to 29 CFR 1910.178(l) '
                'with a fully worked example so the Builder is never blank.'
            ),
            'header_slug': 'CITATION-PROOF KIT SERIES  |  VERSION 1.0',
            'version_footer': 'Version 1.0',
            'whats_inside_heading': "What's Inside",
            'whats_inside_items': [
                'Operator Training & Evaluation Builder™',
                'Training & Evaluation Certification (Form A)',
                '3-Year Re-Evaluation Autopilot Tracker (Form B)',
                'Daily / Pre-Shift Inspection (Form C)',
                'Refresher-Training Trigger Log (Form D)',
                'Citation-Proof Score™ Rubric',
                "Inspector's First 10 Questions Card",
            ],
            'process_flow': ['Instruct', 'Train', 'Evaluate', 'Certify', 'Re-Evaluate'],
            'footer_line': 'GigLine Safety & Compliance  |  29 CFR 1910.178',
        },
    },
}


def _download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(['curl', '-fsSL', '-o', str(dest), url], check=True)


def _docx_to_pdf(docx_path: Path, out_dir: Path) -> Path:
    subprocess.run(
        ['libreoffice', '--headless', '--convert-to', 'pdf',
         str(docx_path), '--outdir', str(out_dir)],
        check=True,
        capture_output=True,
    )
    pdf_path = out_dir / (docx_path.stem + '.pdf')
    if not pdf_path.exists():
        raise RuntimeError(f'LibreOffice did not produce {pdf_path}')
    return pdf_path


def main() -> None:
    work = Path('/tmp/gl_kit_build')
    work.mkdir(parents=True, exist_ok=True)

    for slug, spec in ASSETS.items():
        print(f'\n── Building {slug} ──')

        docx = work / f'{slug}.docx'
        print(f'  1) Downloading DOCX → {docx.name}')
        _download(spec['source_docx_url'], docx)

        print('  2) LibreOffice DOCX → PDF')
        raw_pdf = _docx_to_pdf(docx, work)

        out_pdf = Path(spec['output_pdf'])
        out_pdf.parent.mkdir(parents=True, exist_ok=True)
        print(f'  3) Prepending GigLine v3 cover → {out_pdf}')
        prepend_cover_to_pdf(str(raw_pdf), str(out_pdf), **spec['cover'])

        size_kb = out_pdf.stat().st_size / 1024
        print(f'     wrote {size_kb:.1f} KB')

    print('\nDone. Files:')
    for spec in ASSETS.values():
        p = Path(spec['output_pdf'])
        if p.exists():
            print(f'  {p} ({p.stat().st_size / 1024:.1f} KB)')


if __name__ == '__main__':
    main()
