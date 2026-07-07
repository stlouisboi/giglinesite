"""GL-WEB-018c — Build a before/after logo-comparison page for the 8 PDFs.

Extracts page 1 of the old (pre-regen) + new PDFs as PNG thumbnails and
composes them into a single HTML preview served at /logo-preview.html.
"""

from pathlib import Path
import fitz  # PyMuPDF

OLD_DIR = Path('/tmp/old_pdfs')
NEW_DIR = Path('/app/frontend/public/assets')
IMG_DIR = Path('/app/frontend/public/logo-preview')
IMG_DIR.mkdir(parents=True, exist_ok=True)
OUT_HTML = Path('/app/frontend/public/logo-preview.html')

PDFS = [
    ('gl-fm-2026.pdf', 'Field Manual (main lead magnet)'),
    ('gl-faq-2026.pdf', 'FAQ'),
    ('gl-pricing-2026.pdf', 'Pricing'),
    ('gl-osha-inspection-guide-2026.pdf', 'OSHA Inspection Guide'),
    ('gl-case-study-statesville-2026.pdf', 'Statesville Case Study'),
    ('gl-doc-review-prep-checklist.pdf', 'Doc Review Prep Checklist'),
    ('gl-lm-001-digital.pdf', 'Heat Guide (LM-001)'),
    ('GigLine_Sample_Corrective_Action_Log.pdf', 'Corrective Action Log excerpt'),
]


def render_page1(pdf_path: Path, out_png: Path):
    """Render page 1 of a PDF as a JPEG-ish PNG at 96 dpi."""
    doc = fitz.open(str(pdf_path))
    page = doc.load_page(0)
    zoom = 1.6  # ~150 dpi effective
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat, alpha=False)
    pix.save(str(out_png))
    doc.close()


def main():
    rows = []
    for fname, label in PDFS:
        old_pdf = OLD_DIR / fname
        new_pdf = NEW_DIR / fname
        old_png = IMG_DIR / f'{fname.replace(".pdf","")}_old.png'
        new_png = IMG_DIR / f'{fname.replace(".pdf","")}_new.png'
        if old_pdf.is_file():
            render_page1(old_pdf, old_png)
        if new_pdf.is_file():
            render_page1(new_pdf, new_png)
        rows.append({
            'label': label,
            'fname': fname,
            'old_src': f'/logo-preview/{old_png.name}' if old_png.is_file() else None,
            'new_src': f'/logo-preview/{new_png.name}' if new_png.is_file() else None,
        })

    # HTML output
    html_rows = []
    for r in rows:
        old = f'<img src="{r["old_src"]}" alt="before" loading="lazy" />' if r["old_src"] else '<div class="missing">no prior version</div>'
        new = f'<a href="/assets/{r["fname"]}" target="_blank" rel="noopener"><img src="{r["new_src"]}" alt="after" loading="lazy" /></a>' if r["new_src"] else '<div class="missing">missing</div>'
        html_rows.append(f'''
            <tr>
              <td class="label"><strong>{r["label"]}</strong><br><code>{r["fname"]}</code></td>
              <td class="old">{old}</td>
              <td class="new">{new}</td>
            </tr>
        ''')

    body = ''.join(html_rows)
    html = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>PDF Logo Refresh — Before / After — GigLine</title>
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="robots" content="noindex,nofollow" />
<style>
  :root {{ color-scheme: light; }}
  body {{ margin:0; padding:0; background:#f7f6f2; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; color:#1C2B2B; }}
  header {{ background:#102A43; color:#fff; padding:28px 32px 22px; }}
  header h1 {{ margin:0 0 6px; font-size:22px; letter-spacing:.5px; }}
  header p {{ margin:0; color:#c9a84c; font-size:13px; font-weight:600; letter-spacing:.4px; }}
  header .sub {{ color:rgba(255,255,255,.7); font-weight:400; letter-spacing:0; margin-top:8px; font-size:13px; }}
  .wrap {{ max-width: 1400px; margin: 0 auto; padding: 24px; }}
  table {{ width:100%; border-collapse: separate; border-spacing: 0 14px; }}
  th, td {{ vertical-align: top; }}
  th {{ text-align:left; padding: 0 12px 8px; text-transform: uppercase; font-size:11px; letter-spacing:.14em; color:#5B6B7A; }}
  td.label {{ width: 220px; padding: 18px 14px; background:#fff; border-radius:8px 0 0 8px; border-left:1px solid #eee; border-top:1px solid #eee; border-bottom:1px solid #eee; }}
  td.label code {{ font-size:11px; color:#8B96A3; word-break: break-all; }}
  td.old, td.new {{ padding:14px; background:#fff; border-top:1px solid #eee; border-bottom:1px solid #eee; text-align:center; }}
  td.old {{ border-right:1px solid #eee; }}
  td.new {{ border-right:1px solid #eee; border-radius:0 8px 8px 0; background:#fbfaf5; }}
  td.old img, td.new img {{ max-width: 320px; max-height: 420px; box-shadow: 0 2px 12px rgba(28,43,43,0.15); border-radius:2px; }}
  td.new img {{ cursor: zoom-in; }}
  .missing {{ color:#B0B7BF; font-style: italic; padding: 60px 0; }}
  .legend {{ margin: 12px 0 22px; color:#5B6B7A; font-size:13px; }}
  .legend .chip {{ display:inline-block; padding:3px 10px; border-radius:12px; font-weight:600; font-size:11px; letter-spacing:.05em; margin-right:8px; }}
  .chip.b {{ background:#EAEDF1; color:#5B6B7A; }}
  .chip.a {{ background:#C9A84C; color:#102A43; }}
  footer {{ text-align:center; padding:24px; color:#8B96A3; font-size:12px; }}
</style>
</head>
<body>
  <header>
    <h1>PDF Logo Refresh — Before / After</h1>
    <p>GL-WEB-018 · Jul 2026</p>
    <p class="sub">Page-1 thumbnails of every regenerated static PDF. Click any "After" thumbnail to open the full PDF.</p>
  </header>
  <div class="wrap">
    <p class="legend">
      <span class="chip b">Before</span> pulled from git commit HEAD~1
      <span class="chip a">After</span> current live file &nbsp;·&nbsp; click to open
    </p>
    <table>
      <thead>
        <tr>
          <th>Document</th>
          <th>Before — old 3D shield logo</th>
          <th>After — new flat logo</th>
        </tr>
      </thead>
      <tbody>
        {body}
      </tbody>
    </table>
  </div>
  <footer>Preview served from /logo-preview.html · not indexed</footer>
</body>
</html>'''
    OUT_HTML.write_text(html, encoding='utf-8')
    print(f'✓ Wrote {OUT_HTML}')
    print(f'✓ Thumbnails in {IMG_DIR}')


if __name__ == '__main__':
    main()
