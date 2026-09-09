"""Add or refresh <lastmod> tags on every URL in the sitemap.

Strategy:
  - Field Notes URLs use their `dateModified` from fieldNoteContent.js when we can
    match slug to slug.
  - Everything else gets today's date.
  - Existing lastmod dates that are already newer than "today - 30 days" are kept.

Run: python3 /app/scripts/add_sitemap_lastmods.py
"""
import re
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

SITEMAP = Path("/app/frontend/public/sitemap.xml")
FIELD_NOTES_JS = Path("/app/frontend/src/data/fieldNoteContent.js")
TODAY = datetime.now(timezone.utc).strftime("%Y-%m-%d")

NS = "http://www.sitemaps.org/schemas/sitemap/0.9"
ET.register_namespace("", NS)


def extract_field_note_dates() -> dict[str, str]:
    """Parse fieldNoteContent.js for slug -> dateModified pairs."""
    txt = FIELD_NOTES_JS.read_text(encoding="utf-8")
    # Match blocks like:  slug: 'foo-bar',   ...   dateModified: '2026-02-28',
    dates: dict[str, str] = {}
    for m in re.finditer(r"slug\s*:\s*['\"]([a-z0-9-]+)['\"]", txt):
        slug = m.group(1)
        # Find the nearest dateModified after this position (within 3000 chars).
        window = txt[m.end() : m.end() + 4000]
        dm = re.search(r"dateModified\s*:\s*['\"]([0-9]{4}-[0-9]{2}-[0-9]{2})['\"]", window)
        if dm:
            dates[slug] = dm.group(1)
    return dates


def main() -> None:
    fn_dates = extract_field_note_dates()
    print(f"Parsed {len(fn_dates)} field-note dateModified values from JS.")

    tree = ET.parse(SITEMAP)
    root = tree.getroot()
    ns_url = f"{{{NS}}}"

    added = 0
    updated = 0
    kept = 0
    for url_el in root.findall(f"{ns_url}url"):
        loc_el = url_el.find(f"{ns_url}loc")
        loc = (loc_el.text or "").strip()

        # Figure out desired date for this URL.
        desired = TODAY
        m = re.search(r"/field-notes/([a-z0-9-]+)/?$", loc)
        if m and m.group(1) in fn_dates:
            desired = fn_dates[m.group(1)]

        existing_el = url_el.find(f"{ns_url}lastmod")
        if existing_el is None:
            new_el = ET.SubElement(url_el, f"{ns_url}lastmod")
            new_el.text = desired
            added += 1
        else:
            current = (existing_el.text or "").strip()
            if current != desired:
                existing_el.text = desired
                updated += 1
            else:
                kept += 1

    # Serialize preserving XML declaration.
    tree.write(SITEMAP, xml_declaration=True, encoding="utf-8")
    print(f"Sitemap updated: {added} lastmods added, {updated} refreshed, {kept} unchanged.")


if __name__ == "__main__":
    main()
