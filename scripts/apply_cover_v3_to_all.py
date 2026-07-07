"""GL-WEB-018e (Jul 2026) — Apply the approved GigLine Cover v3 to every
existing static PDF collateral. This is idempotent — safe to re-run.

For each PDF:
  * If it already has a cover we produced (e.g., gl-fm-2026, corrective-action-log),
    REPLACE page 1 with the new v3 cover.
  * If it doesn't have a cover, PREPEND the v3 cover as page 1.
"""

import sys
sys.path.insert(0, '/app/backend')

from pathlib import Path
from lib.pdf_cover import prepend_cover_to_pdf
from lib.pdf_cover_metadata import COVERS

ASSETS = Path('/app/frontend/public/assets')


def main():
    total = 0
    for filename, meta in COVERS.items():
        src = ASSETS / filename
        if not src.is_file():
            print(f'⚠ MISSING: {filename}')
            continue
        kwargs = {k: v for k, v in meta.items() if k != 'replace_page_1'}
        replace_p1 = meta.get('replace_page_1', False)
        tmp = ASSETS / f'.tmp_{filename}'
        prepend_cover_to_pdf(
            str(src), str(tmp),
            replace_page_1=replace_p1,
            **kwargs,
        )
        tmp.replace(src)
        kb = src.stat().st_size / 1024
        action = 'REPLACED p1' if replace_p1 else 'PREPENDED cover'
        print(f'✓ {filename:<48} [{action}] — {kb:.1f} KB')
        total += 1
    print(f'\n✓ {total}/{len(COVERS)} PDFs now use the GigLine Cover v3 standard.')


if __name__ == '__main__':
    main()
