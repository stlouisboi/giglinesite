"""GL-WEB-018d (Jul 2026) — GigLine Cover v3 template.

Reusable branded cover page for all GigLine PDF deliverables.
Extracted from `GigLine_Cover_v3.pdf` (approved by Vince, Jul 2026).

Design contract:
- 8.5×11 US Letter, dark charcoal background (#1C2B2B)
- Centered new flat GigLine logo at top
- Header slug (uppercase, thin) — e.g., "SUPERVISOR USE COPY | VERSION 1.0"
- Large white headline
- Muted white subtitle + body
- Thin gold accent bar
- Optional "What's Inside" 2-column checklist (gold checks, white text)
- Thick gold divider
- Optional horizontal process-flow line (Step → Step → Step)
- Footer strap with company / tool-family / version

Public API:
    build_cover(out_path, **kwargs)          → write a single-page cover PDF
    prepend_cover_to_pdf(src, dst, **kwargs) → merge a cover onto an existing PDF
"""

from __future__ import annotations

import io
from pathlib import Path
from typing import Iterable, List, Optional

from reportlab.lib.colors import HexColor, Color
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas as rl_canvas

# ── Brand palette (matches /app/frontend/src palette + Vince-approved cover) ──
BG_CHARCOAL = HexColor('#1C2B2B')
INK_WHITE = HexColor('#FFFFFF')
INK_MUTED = HexColor('#C7CFD3')
GOLD = HexColor('#C9A84C')
GOLD_SOFT = HexColor('#E7C878')

PAGE_W, PAGE_H = LETTER  # 612 × 792 pt
MARGIN = 0.75 * 72       # 54 pt = ~0.75 inch each side

# The canonical flat logo, dark-bg variant (white letters + gold belt bars).
DEFAULT_LOGO = '/app/frontend/public/gigline-logo-dark-bg.png'


def _draw_wrapped(c: rl_canvas.Canvas, text: str, x: float, y: float,
                  max_w: float, font: str, size: float,
                  leading: float, color: Color, align: str = 'center') -> float:
    """Word-wrap a string into `max_w`; return the y-coord after last line."""
    words = text.split()
    lines: List[str] = []
    cur = ''
    c.setFont(font, size)
    for w in words:
        candidate = f"{cur} {w}".strip()
        if c.stringWidth(candidate, font, size) <= max_w:
            cur = candidate
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)

    c.setFillColor(color)
    for line in lines:
        if align == 'center':
            c.drawCentredString(PAGE_W / 2, y, line)
        elif align == 'right':
            c.drawRightString(PAGE_W - MARGIN, y, line)
        else:
            c.drawString(x, y, line)
        y -= leading
    return y


def build_cover(
    out_path: str,
    *,
    title: str,
    subtitle: Optional[str] = None,
    body: Optional[str] = None,
    header_slug: str = 'PROSPECT COPY | VERSION 1.0',
    version_footer: str = 'Version 1.0',
    whats_inside_heading: str = "What's Inside",
    whats_inside_items: Optional[Iterable[str]] = None,
    process_flow: Optional[Iterable[str]] = None,
    footer_line: str = 'GigLine Safety & Compliance  |  OSHA-Aligned Field Tools',
    logo_path: str = DEFAULT_LOGO,
) -> str:
    """Write the reusable GigLine v3 branded cover to `out_path`.

    Returns the absolute path written.
    """
    out_p = Path(out_path)
    out_p.parent.mkdir(parents=True, exist_ok=True)

    c = rl_canvas.Canvas(str(out_p), pagesize=LETTER)

    # ── Background ──
    c.setFillColor(BG_CHARCOAL)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)

    # ── Logo (centered, top) ──
    y_cursor = PAGE_H - 0.9 * 72
    try:
        logo = ImageReader(logo_path)
        lw, lh = logo.getSize()
        target_h = 68  # pt
        scale = target_h / lh
        draw_w = lw * scale
        c.drawImage(
            logo,
            (PAGE_W - draw_w) / 2, y_cursor - target_h,
            width=draw_w, height=target_h,
            mask='auto',
        )
        y_cursor -= target_h + 0.28 * 72
    except Exception:
        # Silent fallback: no logo, just push down
        y_cursor -= 0.5 * 72

    # ── Header slug ──
    c.setFillColor(INK_WHITE)
    c.setFont('Helvetica', 8.5)
    c.drawCentredString(PAGE_W / 2, y_cursor, header_slug.upper())
    y_cursor -= 0.9 * 72

    # ── Headline ──
    y_cursor = _draw_wrapped(
        c, title, MARGIN, y_cursor, PAGE_W - 2 * MARGIN,
        'Helvetica-Bold', 34, 40, INK_WHITE, align='center',
    )

    # ── Subtitle ──
    if subtitle:
        y_cursor -= 0.10 * 72
        y_cursor = _draw_wrapped(
            c, subtitle, MARGIN, y_cursor, PAGE_W - 2 * MARGIN,
            'Helvetica', 15, 20, INK_WHITE, align='center',
        )

    # ── Body ──
    if body:
        y_cursor -= 0.15 * 72
        y_cursor = _draw_wrapped(
            c, body, MARGIN, y_cursor, PAGE_W - 2 * MARGIN - 0.5 * 72,
            'Helvetica', 11, 16, INK_MUTED, align='center',
        )

    # ── Thin gold accent bar ──
    if whats_inside_items:
        y_cursor -= 0.55 * 72
        bar_w = 130
        c.setFillColor(GOLD)
        c.rect((PAGE_W - bar_w) / 2, y_cursor, bar_w, 2, stroke=0, fill=1)
        y_cursor -= 0.42 * 72

        # ── "What's Inside" heading ──
        c.setFont('Helvetica-Bold', 15)
        c.setFillColor(GOLD)
        c.drawCentredString(PAGE_W / 2, y_cursor, whats_inside_heading)
        y_cursor -= 0.42 * 72

        # ── Two-column checklist ──
        items = list(whats_inside_items)
        mid = (len(items) + 1) // 2
        col_l = items[:mid]
        col_r = items[mid:]
        col_x_l = MARGIN + 0.3 * 72
        col_x_r = PAGE_W / 2 + 0.15 * 72
        row_h = 20
        start_y = y_cursor
        c.setFont('Helvetica', 10.5)
        for i in range(max(len(col_l), len(col_r))):
            row_y = start_y - i * row_h
            for col_items, col_x in ((col_l, col_x_l), (col_r, col_x_r)):
                if i >= len(col_items):
                    continue
                # Gold checkmark
                c.setFillColor(GOLD)
                c.setFont('Helvetica-Bold', 11)
                c.drawString(col_x, row_y, '✓')
                # Item text
                c.setFillColor(INK_WHITE)
                c.setFont('Helvetica', 10.5)
                c.drawString(col_x + 15, row_y, col_items[i])
        y_cursor = start_y - max(len(col_l), len(col_r)) * row_h - 0.35 * 72

    # ── Thick gold divider ──
    if process_flow:
        y_cursor -= 0.10 * 72
        c.setFillColor(GOLD)
        c.rect(MARGIN, y_cursor, PAGE_W - 2 * MARGIN, 4, stroke=0, fill=1)
        y_cursor -= 0.42 * 72

        # ── Horizontal process flow ──
        steps = list(process_flow)
        c.setFont('Helvetica-Bold', 12)
        c.setFillColor(INK_WHITE)
        connector = '  →  '
        line = connector.join(steps)
        # Truncate/scale down if the line is too wide
        while c.stringWidth(line, 'Helvetica-Bold', 12) > PAGE_W - 2 * MARGIN and len(steps) > 1:
            steps = steps[:-1]
            line = connector.join(steps)
        c.drawCentredString(PAGE_W / 2, y_cursor, line)
        y_cursor -= 0.32 * 72

    # ── Footer strap ──
    c.setFont('Helvetica', 8.5)
    c.setFillColor(INK_MUTED)
    c.drawCentredString(
        PAGE_W / 2, 0.55 * 72,
        f'{footer_line}  |  {version_footer}',
    )

    c.showPage()
    c.save()
    return str(out_p)


def prepend_cover_to_pdf(
    source_pdf_path: str,
    dest_pdf_path: str,
    **cover_kwargs,
) -> str:
    """Build a cover and prepend it to an existing PDF.

    If the source PDF has no cover, this adds one. If it already has an outdated
    cover, pass `replace_page_1=True` to swap page 1 for the new cover instead.
    """
    import fitz  # PyMuPDF

    replace_page_1 = cover_kwargs.pop('replace_page_1', False)

    # 1) render cover to a temp buffer
    buf = io.BytesIO()
    tmp_canvas = rl_canvas.Canvas(buf, pagesize=LETTER)
    _draw_full_cover_on_canvas(tmp_canvas, **cover_kwargs)
    tmp_canvas.showPage()
    tmp_canvas.save()

    cover_doc = fitz.open(stream=buf.getvalue(), filetype='pdf')
    src_doc = fitz.open(source_pdf_path)

    out_doc = fitz.open()
    out_doc.insert_pdf(cover_doc)
    if replace_page_1 and src_doc.page_count > 0:
        out_doc.insert_pdf(src_doc, from_page=1, to_page=src_doc.page_count - 1)
    else:
        out_doc.insert_pdf(src_doc)

    # Preserve source metadata but bump title
    md = src_doc.metadata or {}
    md['title'] = cover_kwargs.get('title', md.get('title', 'GigLine deliverable'))
    md['creator'] = 'GigLine Cover v3'
    out_doc.set_metadata(md)

    out_doc.save(dest_pdf_path, garbage=4, deflate=True)
    out_doc.close()
    src_doc.close()
    cover_doc.close()
    return dest_pdf_path


def _draw_full_cover_on_canvas(c: rl_canvas.Canvas, **cover_kwargs):
    """Internal — repaint the entire cover onto an already-opened ReportLab canvas.
    Kept in sync with `build_cover` above. Called by `prepend_cover_to_pdf`.
    """
    # Delegate by re-implementing (or extracting) — kept simple:
    tmp_path = io.BytesIO()
    tmp_c = rl_canvas.Canvas(tmp_path, pagesize=LETTER)
    _paint_cover(tmp_c, **cover_kwargs)
    tmp_c.showPage()
    tmp_c.save()
    # Now stamp the drawn buffer onto `c` using PyMuPDF: not straightforward
    # since we already have the raw bytes. Simpler: paint directly on `c`.
    _paint_cover(c, **cover_kwargs)


def _paint_cover(c: rl_canvas.Canvas, **cover_kwargs):
    """Paint the cover onto the supplied canvas.

    Everything inside `build_cover` except file I/O. Extracted so
    `prepend_cover_to_pdf` can reuse the same rendering.
    """
    title = cover_kwargs['title']
    subtitle = cover_kwargs.get('subtitle')
    body = cover_kwargs.get('body')
    header_slug = cover_kwargs.get('header_slug', 'PROSPECT COPY | VERSION 1.0')
    version_footer = cover_kwargs.get('version_footer', 'Version 1.0')
    whats_inside_heading = cover_kwargs.get('whats_inside_heading', "What's Inside")
    whats_inside_items = cover_kwargs.get('whats_inside_items')
    process_flow = cover_kwargs.get('process_flow')
    footer_line = cover_kwargs.get('footer_line',
                                   'GigLine Safety & Compliance  |  OSHA-Aligned Field Tools')
    logo_path = cover_kwargs.get('logo_path', DEFAULT_LOGO)

    c.setFillColor(BG_CHARCOAL)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)

    y = PAGE_H - 0.9 * 72
    try:
        logo = ImageReader(logo_path)
        lw, lh = logo.getSize()
        target_h = 68
        scale = target_h / lh
        draw_w = lw * scale
        c.drawImage(logo, (PAGE_W - draw_w) / 2, y - target_h,
                    width=draw_w, height=target_h, mask='auto')
        y -= target_h + 0.28 * 72
    except Exception:
        y -= 0.5 * 72

    c.setFillColor(INK_WHITE)
    c.setFont('Helvetica', 8.5)
    c.drawCentredString(PAGE_W / 2, y, header_slug.upper())
    y -= 0.9 * 72

    y = _draw_wrapped(c, title, MARGIN, y, PAGE_W - 2 * MARGIN,
                      'Helvetica-Bold', 34, 40, INK_WHITE)
    if subtitle:
        y -= 0.10 * 72
        y = _draw_wrapped(c, subtitle, MARGIN, y, PAGE_W - 2 * MARGIN,
                          'Helvetica', 15, 20, INK_WHITE)
    if body:
        y -= 0.15 * 72
        y = _draw_wrapped(c, body, MARGIN, y, PAGE_W - 2 * MARGIN - 0.5 * 72,
                          'Helvetica', 11, 16, INK_MUTED)

    if whats_inside_items:
        y -= 0.55 * 72
        bar_w = 130
        c.setFillColor(GOLD)
        c.rect((PAGE_W - bar_w) / 2, y, bar_w, 2, stroke=0, fill=1)
        y -= 0.42 * 72
        c.setFont('Helvetica-Bold', 15)
        c.setFillColor(GOLD)
        c.drawCentredString(PAGE_W / 2, y, whats_inside_heading)
        y -= 0.42 * 72
        items = list(whats_inside_items)
        mid = (len(items) + 1) // 2
        col_l, col_r = items[:mid], items[mid:]
        col_x_l = MARGIN + 0.3 * 72
        col_x_r = PAGE_W / 2 + 0.15 * 72
        row_h = 20
        start_y = y
        for i in range(max(len(col_l), len(col_r))):
            row_y = start_y - i * row_h
            for col_items, col_x in ((col_l, col_x_l), (col_r, col_x_r)):
                if i >= len(col_items):
                    continue
                c.setFillColor(GOLD)
                c.setFont('Helvetica-Bold', 11)
                c.drawString(col_x, row_y, '✓')
                c.setFillColor(INK_WHITE)
                c.setFont('Helvetica', 10.5)
                c.drawString(col_x + 15, row_y, col_items[i])
        y = start_y - max(len(col_l), len(col_r)) * row_h - 0.35 * 72

    if process_flow:
        y -= 0.10 * 72
        c.setFillColor(GOLD)
        c.rect(MARGIN, y, PAGE_W - 2 * MARGIN, 4, stroke=0, fill=1)
        y -= 0.42 * 72
        steps = list(process_flow)
        c.setFont('Helvetica-Bold', 12)
        c.setFillColor(INK_WHITE)
        connector = '  →  '
        line = connector.join(steps)
        while c.stringWidth(line, 'Helvetica-Bold', 12) > PAGE_W - 2 * MARGIN and len(steps) > 1:
            steps = steps[:-1]
            line = connector.join(steps)
        c.drawCentredString(PAGE_W / 2, y, line)

    c.setFont('Helvetica', 8.5)
    c.setFillColor(INK_MUTED)
    c.drawCentredString(PAGE_W / 2, 0.55 * 72,
                        f'{footer_line}  |  {version_footer}')
