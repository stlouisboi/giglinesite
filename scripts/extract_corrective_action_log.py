"""GL-WEB-017 — Extract pages 7-17 from GL_Sample_Compliance_Report.pdf and
prepend a branded cover page. Output: GigLine_Sample_Corrective_Action_Log.pdf.

Ungated deliverable. Served directly from /app/frontend/public/assets/ so the
static /sample-corrective-action-log route (see vercel.json rewrite) can hand
it back without a form gate.
"""

from pathlib import Path

import fitz  # PyMuPDF
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import io

SRC = Path('/app/backend/sample_report_files/GL_Sample_Compliance_Report.pdf')
OUT = Path('/app/frontend/public/assets/GigLine_Sample_Corrective_Action_Log.pdf')
OUT.parent.mkdir(parents=True, exist_ok=True)

NAVY = HexColor('#102A43')
GOLD = HexColor('#C9A84C')
INK = HexColor('#1C2B2B')
INK_MUTED = HexColor('#5B6B7A')

PAGE_W, PAGE_H = LETTER


def _build_cover_pdf_bytes() -> bytes:
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=LETTER)

    # Top navy band
    band_h = 1.4 * inch
    c.setFillColor(NAVY)
    c.rect(0, PAGE_H - band_h, PAGE_W, band_h, stroke=0, fill=1)

    # Gold rule under band
    c.setFillColor(GOLD)
    c.rect(0, PAGE_H - band_h - 4, PAGE_W, 4, stroke=0, fill=1)

    # Header text in band
    c.setFillColor(HexColor('#FFFFFF'))
    c.setFont('Helvetica-Bold', 10)
    c.drawString(0.75 * inch, PAGE_H - 0.55 * inch,
                 'GIGLINE SAFETY & COMPLIANCE')
    c.setFillColor(GOLD)
    c.setFont('Helvetica', 9)
    c.drawString(0.75 * inch, PAGE_H - 0.78 * inch,
                 'Sample Corrective Action Log — Redacted Excerpt')
    c.setFillColor(HexColor('#FFFFFF'))
    c.setFont('Helvetica', 8.5)
    c.drawRightString(PAGE_W - 0.75 * inch, PAGE_H - 0.55 * inch,
                      'giglinecompliance.com')
    c.drawRightString(PAGE_W - 0.75 * inch, PAGE_H - 0.78 * inch,
                      '(336) 329-8899')

    # Title block
    y = PAGE_H - band_h - 1.2 * inch
    c.setFillColor(INK)
    c.setFont('Helvetica-Bold', 22)
    c.drawString(0.75 * inch, y, 'Sample Corrective Action Log')
    y -= 0.42 * inch
    c.setFillColor(INK_MUTED)
    c.setFont('Helvetica', 12)
    c.drawString(0.75 * inch, y,
                 'Metals fabrication facility, Statesville NC · June 2026')

    # Gold underline accent
    y -= 0.25 * inch
    c.setFillColor(GOLD)
    c.rect(0.75 * inch, y, 56, 3, stroke=0, fill=1)

    # Attestation body
    y -= 0.55 * inch
    c.setFillColor(INK)
    c.setFont('Helvetica-Bold', 11)
    c.drawString(0.75 * inch, y, 'About this excerpt')
    y -= 0.28 * inch
    c.setFont('Helvetica', 10.5)
    text_lines = [
        'This document reproduces pages 7–17 of a full engagement report delivered to a',
        'metals fabrication client in Statesville, NC. The client name and facility identifiers',
        'have been withheld. Findings, CFR citations, priority ratings, corrective actions,',
        'and timelines are accurate to the engagement — nothing else has been altered.',
        '',
        'Full report handoff includes cover, methodology, coverage summary, appendices, and',
        'a printable action tracker. This excerpt is the corrective-action portion only, and',
        'is provided as a preview of the deliverable — no form, no email required.',
    ]
    for line in text_lines:
        c.drawString(0.75 * inch, y, line)
        y -= 15

    # Metadata card
    y -= 0.35 * inch
    card_h = 1.15 * inch
    c.setStrokeColor(HexColor('#DDE3EA'))
    c.setFillColor(HexColor('#FBFCFD'))
    c.roundRect(0.75 * inch, y - card_h + 0.15 * inch,
                PAGE_W - 1.5 * inch, card_h, 6, stroke=1, fill=1)
    cy = y - 0.1 * inch
    c.setFillColor(INK_MUTED)
    c.setFont('Helvetica-Bold', 8)
    c.drawString(0.95 * inch, cy, 'REPORT METADATA')
    cy -= 0.22 * inch
    rows = [
        ('Report ID', '62FC03EB'),
        ('Sector', 'Metals fabrication'),
        ('Location', 'Statesville, NC'),
        ('Engagement date', 'June 2026'),
        ('Client name', 'Withheld — redacted per client agreement'),
    ]
    c.setFont('Helvetica', 9.5)
    for label, value in rows:
        c.setFillColor(INK_MUTED)
        c.drawString(0.95 * inch, cy, label)
        c.setFillColor(INK)
        c.drawString(2.35 * inch, cy, value)
        cy -= 13

    # Footer
    c.setFillColor(INK_MUTED)
    c.setFont('Helvetica', 8.5)
    c.drawString(0.75 * inch, 0.55 * inch,
                 'GigLine Safety & Compliance · Veteran-owned · Kernersville, NC')
    c.drawRightString(PAGE_W - 0.75 * inch, 0.55 * inch,
                      'giglinecompliance.com · (336) 329-8899')

    c.showPage()
    c.save()
    return buf.getvalue()


def main():
    assert SRC.exists(), f'Missing source: {SRC}'
    src_doc = fitz.open(SRC)

    # Extract pages 7-17 (1-indexed inclusive) — fitz is 0-indexed
    excerpt = fitz.open()
    excerpt.insert_pdf(src_doc, from_page=6, to_page=16)

    # Build cover page as its own PDF, then prepend
    cover_bytes = _build_cover_pdf_bytes()
    cover_doc = fitz.open(stream=cover_bytes, filetype='pdf')

    out_doc = fitz.open()
    out_doc.insert_pdf(cover_doc)
    out_doc.insert_pdf(excerpt)

    # Set metadata
    out_doc.set_metadata({
        'title': 'GigLine — Sample Corrective Action Log (Redacted)',
        'author': 'GigLine Safety & Compliance',
        'subject': 'Redacted corrective action log — pages 7-17 excerpt',
        'keywords': 'OSHA, corrective action, compliance, GigLine, sample report',
        'creator': 'GigLine Sample Extractor',
    })

    out_doc.save(str(OUT), garbage=4, deflate=True)
    out_doc.close()
    excerpt.close()
    cover_doc.close()
    src_doc.close()

    size_kb = OUT.stat().st_size / 1024
    print(f'✓ Wrote {OUT} — {size_kb:.1f} KB')

    # Verify page count
    v = fitz.open(str(OUT))
    print(f'✓ Total pages: {v.page_count} (expect 12 = 1 cover + 11 excerpt)')
    v.close()


if __name__ == '__main__':
    main()
