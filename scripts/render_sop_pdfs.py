"""Render every /app/memory/sops/*.md file into a branded PDF.

Usage:
    python3 /app/scripts/render_sop_pdfs.py

Output:
    /app/memory/sops/pdf/<same-stem>.pdf
    /app/memory/sops/pdf/GigLine-Ongoing-Support-Documents.zip
    /app/backend/static/downloads/*  (copies for the token-gated download endpoint)

Style:
    * Navy #0A1628, gold #C9A84C, warm cream #F5F4F0 background on cover
    * Print-friendly Letter size, 0.75" margins
    * Header on every page after cover with document title and version
    * Auto page numbers footer with revision date and document code
    * Optional inline HTML flowcharts embedded via <div class="flowchart">…</div>
"""
from __future__ import annotations

import re
import shutil
import zipfile
from pathlib import Path
from datetime import datetime

import markdown
from weasyprint import HTML, CSS

SRC = Path("/app/memory/sops")
OUT = SRC / "pdf"
BACKEND_DOWNLOADS = Path("/app/backend/static/downloads/ongoing-support")
OUT.mkdir(parents=True, exist_ok=True)
BACKEND_DOWNLOADS.mkdir(parents=True, exist_ok=True)

NAVY = "#0A1628"
GOLD = "#C9A84C"
CREAM = "#F5F4F0"
INK = "#1C2B2B"
MUTED = "#5B6B7A"

TODAY = datetime.now().strftime("%B %Y")
REVISION_DATE = datetime.now().strftime("%Y-%m-%d")
GLOBAL_VERSION = "v1.0"
CONTACT_LINE = "Vince Lawrence · (336) 329-8899 · vince@giglinecompliance.com"

BASE_CSS = f"""
@page {{
    size: Letter;
    margin: 0.85in 0.85in 0.95in 0.85in;
    @top-left {{
        content: "GigLine · " string(doc-code) " · " string(doc-version);
        font-family: 'Georgia', serif;
        font-size: 8.5pt;
        color: {MUTED};
        letter-spacing: 0.05em;
    }}
    @top-right {{
        content: string(doc-title);
        font-family: 'Georgia', serif;
        font-size: 8.5pt;
        color: {MUTED};
        font-style: italic;
    }}
    @bottom-left {{
        content: "Revised " string(doc-revised);
        font-family: 'Georgia', serif;
        font-size: 7.5pt;
        color: {MUTED};
    }}
    @bottom-center {{
        content: "Page " counter(page) " of " counter(pages);
        font-family: 'Georgia', serif;
        font-size: 8.5pt;
        color: {MUTED};
    }}
    @bottom-right {{
        content: "GigLine, Confidential";
        font-family: 'Georgia', serif;
        font-size: 7.5pt;
        color: {MUTED};
    }}
}}
@page :first {{
    margin: 0;
    @top-left  {{ content: none; }}
    @top-right {{ content: none; }}
    @bottom-left {{ content: none; }}
    @bottom-center {{ content: none; }}
    @bottom-right {{ content: none; }}
}}
html {{ font-family: Georgia, 'Times New Roman', serif; color: {INK}; }}
body {{ font-size: 10.75pt; line-height: 1.55; }}

/* Cover */
.cover {{
    page: cover;
    height: 100vh;
    background: {NAVY};
    color: #ffffff;
    padding: 1.2in 1.0in 1.0in 1.0in;
    box-sizing: border-box;
    position: relative;
}}
.cover .brand-block {{
    border-left: 4px solid {GOLD};
    padding-left: 20px;
    margin-bottom: 60px;
}}
.cover .brand {{
    font-family: 'Georgia', serif;
    font-size: 15pt;
    letter-spacing: 0.05em;
    color: #ffffff;
    margin: 0 0 4pt 0;
}}
.cover .subbrand {{
    font-family: 'Georgia', serif;
    font-size: 9.5pt;
    color: {GOLD};
    letter-spacing: 0.20em;
    text-transform: uppercase;
    margin: 0;
}}
.cover .doc-eyebrow {{
    font-family: 'Georgia', serif;
    font-size: 9pt;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: {GOLD};
    margin: 0 0 22pt 0;
}}
.cover h1.doc-title {{
    font-family: Georgia, serif;
    font-size: 38pt;
    line-height: 1.05;
    font-weight: 800;
    color: #ffffff;
    margin: 0 0 26pt 0;
    max-width: 5.5in;
    letter-spacing: -0.01em;
}}
.cover .doc-sub {{
    font-family: Georgia, serif;
    font-style: italic;
    font-size: 13pt;
    color: rgba(255,255,255,0.78);
    max-width: 5.2in;
    line-height: 1.5;
    margin: 0 0 40pt 0;
}}
.cover .meta {{
    position: absolute;
    left: 1.0in;
    bottom: 1.0in;
    right: 1.0in;
    border-top: 1px solid rgba(201,168,76,0.35);
    padding-top: 20pt;
    display: flex;
    justify-content: space-between;
    color: rgba(255,255,255,0.7);
    font-size: 9pt;
}}
.cover .meta strong {{ color: {GOLD}; letter-spacing: 0.12em; text-transform: uppercase; font-size: 8pt; display: block; margin-bottom: 3pt; font-weight: 700; }}
.cover .doc-tags {{
    display: inline-block;
    font-size: 8pt;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: {GOLD};
    border-top: 1px solid rgba(201,168,76,0.35);
    padding-top: 8pt;
    margin-top: 30pt;
}}

/* Content pages */
.content {{ page: content; string-set: doc-title attr(data-title), doc-code attr(data-code), doc-version attr(data-version), doc-revised attr(data-revised); }}
h1 {{
    font-family: Georgia, serif;
    color: {NAVY};
    font-size: 22pt;
    margin-top: 0;
    margin-bottom: 14pt;
    line-height: 1.15;
    border-bottom: 2px solid {GOLD};
    padding-bottom: 10pt;
}}
h2 {{
    font-family: Georgia, serif;
    color: {NAVY};
    font-size: 15pt;
    margin-top: 22pt;
    margin-bottom: 8pt;
    line-height: 1.2;
    page-break-after: avoid;
}}
h3 {{
    font-family: Georgia, serif;
    color: {NAVY};
    font-size: 12pt;
    margin-top: 16pt;
    margin-bottom: 5pt;
    line-height: 1.25;
    font-weight: 700;
    page-break-after: avoid;
}}
h4 {{
    font-family: Georgia, serif;
    color: {INK};
    font-size: 10.5pt;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-top: 14pt;
    margin-bottom: 4pt;
}}
p, li {{ orphans: 3; widows: 3; }}
p {{ margin: 6pt 0 8pt 0; }}
ul, ol {{ margin: 6pt 0 10pt 0.25in; padding-left: 0.2in; }}
li {{ margin-bottom: 3pt; }}
strong {{ color: {NAVY}; }}
em {{ color: {INK}; }}
blockquote {{
    margin: 12pt 0;
    padding: 10pt 14pt;
    background: {CREAM};
    border-left: 3px solid {GOLD};
    font-style: italic;
    color: {INK};
    font-size: 10pt;
}}
code {{
    font-family: 'Courier New', Courier, monospace;
    font-size: 9.5pt;
    background: #f0eeea;
    padding: 1pt 4pt;
    border-radius: 3pt;
}}
pre {{
    font-family: 'Courier New', Courier, monospace;
    font-size: 9pt;
    background: #f6f4ef;
    padding: 10pt 12pt;
    border-left: 3px solid {GOLD};
    line-height: 1.5;
    margin: 10pt 0;
    white-space: pre-wrap;
}}
table {{
    width: 100%;
    border-collapse: collapse;
    margin: 10pt 0 14pt 0;
    font-size: 9.5pt;
}}
th {{
    background: {NAVY};
    color: #ffffff;
    text-align: left;
    padding: 6pt 8pt;
    font-family: Georgia, serif;
    font-size: 9pt;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    font-weight: 700;
}}
td {{
    border-bottom: 1px solid #dde3ea;
    padding: 6pt 8pt;
    vertical-align: top;
}}
hr {{
    border: none;
    height: 1px;
    background: {GOLD};
    margin: 22pt 0 18pt 0;
    opacity: 0.55;
}}
.doc-eyebrow-inline {{
    display: inline-block;
    font-size: 8pt;
    letter-spacing: 0.20em;
    text-transform: uppercase;
    color: {MUTED};
    font-family: Georgia, serif;
    margin-bottom: 4pt;
}}

/* Cover contact strip */
.cover .contact-strip {{
    position: absolute;
    left: 1.0in;
    right: 1.0in;
    bottom: 0.42in;
    font-size: 8.5pt;
    color: rgba(255,255,255,0.65);
    letter-spacing: 0.05em;
    font-family: Georgia, serif;
    text-align: left;
}}
.cover .contact-strip .version {{
    float: right;
    color: {GOLD};
    letter-spacing: 0.14em;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 8pt;
}}

/* Flowcharts */
.flowchart {{
    margin: 18pt 0 24pt 0;
    padding: 16pt;
    background: {CREAM};
    border: 1px solid #e8e5dd;
    border-radius: 6pt;
    page-break-inside: avoid;
}}
.flowchart-title {{
    font-family: Georgia, serif;
    font-size: 10pt;
    font-weight: 700;
    color: {NAVY};
    text-transform: uppercase;
    letter-spacing: 0.10em;
    margin: 0 0 12pt 0;
}}
.flow-row {{
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    gap: 8pt;
    margin-bottom: 10pt;
}}
.flow-node {{
    flex: 1;
    background: #ffffff;
    border: 1.5px solid {NAVY};
    border-radius: 5pt;
    padding: 8pt 10pt;
    font-family: Georgia, serif;
    font-size: 9pt;
    line-height: 1.3;
    color: {INK};
    min-height: 42pt;
}}
.flow-node .node-label {{
    display: block;
    font-size: 7.5pt;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: {GOLD};
    font-weight: 700;
    margin-bottom: 3pt;
}}
.flow-node.gold {{ border-color: {GOLD}; background: rgba(201,168,76,0.06); }}
.flow-node.red {{ border-color: #c1272d; background: rgba(193,39,45,0.05); }}
.flow-node .node-title {{ font-weight: 700; color: {NAVY}; }}
.flow-arrow {{
    align-self: center;
    font-size: 14pt;
    color: {GOLD};
    font-weight: 700;
    padding: 0 4pt;
}}
.flow-stack {{
    display: block;
    margin-bottom: 8pt;
}}
.flow-decision {{
    text-align: center;
    font-family: Georgia, serif;
    font-size: 9pt;
    font-weight: 700;
    color: {NAVY};
    background: #ffffff;
    border: 1.5px dashed {NAVY};
    border-radius: 20pt;
    padding: 6pt 12pt;
    margin: 6pt 0;
    display: inline-block;
}}
.flow-branch {{
    display: flex;
    gap: 10pt;
    margin: 4pt 0 10pt 14pt;
}}
.flow-branch .yes-tag, .flow-branch .no-tag {{
    font-family: Georgia, serif;
    font-weight: 700;
    font-size: 8pt;
    letter-spacing: 0.14em;
    padding: 3pt 6pt;
    border-radius: 3pt;
    align-self: flex-start;
    margin-top: 8pt;
}}
.flow-branch .yes-tag {{ background: rgba(193,39,45,0.10); color: #c1272d; }}
.flow-branch .no-tag {{ background: rgba(201,168,76,0.15); color: #8B6F1F; }}
"""

COVER_TEMPLATE = """
<section class="cover">
  <div class="brand-block">
    <p class="brand">GigLine Safety &amp; Compliance</p>
    <p class="subbrand">Ongoing Safety Support</p>
  </div>
  <p class="doc-eyebrow">{eyebrow}</p>
  <h1 class="doc-title">{title}</h1>
  <p class="doc-sub">{subtitle}</p>
  <p class="doc-tags">{tags}</p>
  <div class="meta">
    <div><strong>Owner</strong>Vince Lawrence</div>
    <div><strong>Document</strong>{doc_code}</div>
    <div><strong>Effective</strong>{today}</div>
  </div>
  <div class="contact-strip">
    {contact_line}
    <span class="version">{version} · Revised {revised}</span>
  </div>
</section>
"""


def parse_front_matter(md_text: str) -> tuple[dict, str]:
    """Optional YAML-like front matter, keys: title, eyebrow, subtitle, tags, code."""
    meta = {
        "title": "GigLine Document",
        "eyebrow": "Internal Reference",
        "subtitle": "GigLine Safety and Compliance",
        "tags": "CONFIDENTIAL · INTERNAL USE",
        "code": "GL-DOC",
    }
    m = re.match(r"^---\s*\n(.*?)\n---\s*\n", md_text, re.S)
    if m:
        for line in m.group(1).splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                meta[k.strip().lower()] = v.strip()
        md_text = md_text[m.end() :]
    return meta, md_text


def render_pdf(md_path: Path, out_path: Path) -> None:
    md_text = md_path.read_text(encoding="utf-8")
    meta, body_md = parse_front_matter(md_text)

    body_html = markdown.markdown(
        body_md,
        extensions=["extra", "sane_lists", "tables", "toc"],
    )

    cover_html = COVER_TEMPLATE.format(
        eyebrow=meta["eyebrow"],
        title=meta["title"],
        subtitle=meta["subtitle"],
        tags=meta["tags"],
        doc_code=meta["code"],
        today=TODAY,
        contact_line=CONTACT_LINE,
        version=GLOBAL_VERSION,
        revised=REVISION_DATE,
    )
    full_html = f"""<!doctype html>
<html>
<head><meta charset="utf-8"><title>{meta['title']}</title></head>
<body>
{cover_html}
<main class="content" data-title="{meta['title']}" data-code="{meta['code']}" data-version="{GLOBAL_VERSION}" data-revised="{REVISION_DATE}">
{body_html}
</main>
</body>
</html>"""

    HTML(string=full_html).write_pdf(out_path, stylesheets=[CSS(string=BASE_CSS)])
    # Mirror into backend static folder for the token-gated download endpoint.
    shutil.copyfile(out_path, BACKEND_DOWNLOADS / out_path.name)
    print(f"  ✓ {out_path.name} ({out_path.stat().st_size // 1024} KB)")


def build_zip(pdf_dir: Path, zip_path: Path) -> None:
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
        for p in sorted(pdf_dir.glob("*.pdf")):
            z.write(p, arcname=p.name)
    shutil.copyfile(zip_path, BACKEND_DOWNLOADS / zip_path.name)
    print(f"\nZip built: {zip_path} ({zip_path.stat().st_size // 1024} KB)")
    print(f"Mirrored to {BACKEND_DOWNLOADS}")


def main() -> None:
    md_files = sorted([p for p in SRC.glob("*.md")])
    print(f"Rendering {len(md_files)} document(s) to {OUT}\n")
    for md in md_files:
        render_pdf(md, OUT / (md.stem + ".pdf"))
    build_zip(OUT, OUT / "GigLine-Ongoing-Support-Documents.zip")


if __name__ == "__main__":
    main()
