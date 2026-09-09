"""
Filter a GigLine export bundle down to real external prospects only.
Strips: obvious test rows, GigLine internal emails, and no-email placeholders.
Keeps: rows classified as "REAL prospect" by the same rules used in the audit.

Usage:
    python scripts/filter_export_for_atlas.py <path_to_export_dir>
"""
import json
import shutil
import sys
import csv
from pathlib import Path


def classify(r: dict) -> str:
    e = (r.get('email') or '').lower()
    c = (r.get('company') or '').lower()
    if not e:
        return 'no-email'
    if any(t in e for t in ('vince', 'lawrence', 'giglinecompliance')) or \
       any(t in c for t in ('lawrence logistix', 'launchpath')):
        return 'internal'
    if '+' in e.split('@')[0]:
        return 'plus-alias-test'
    if any(t in e for t in ('test', 'example', 'fake', 'demo', 'foo')):
        return 'test'
    if e.endswith('@test.com') or e.endswith('@example.com'):
        return 'test'
    return 'real'


def filter_bundle(src: Path):
    dst = src.parent / (src.name + '_cleaned')
    if dst.exists():
        shutil.rmtree(dst)
    (dst / 'normalized').mkdir(parents=True)
    (dst / 'raw').mkdir(parents=True)

    # Filter normalized contacts.
    all_contacts = json.load(open(src / 'normalized' / 'contacts.json'))
    real = [r for r in all_contacts if classify(r) == 'real']
    kept_emails = {r['email'].lower() for r in real if r.get('email')}

    (dst / 'normalized' / 'contacts.json').write_text(
        json.dumps(real, ensure_ascii=False, indent=2)
    )

    # Rewrite CSV.
    fieldnames = [
        'email', 'name', 'company', 'phone', 'first_seen_at', 'last_seen_at',
        'sources', 'utm_source', 'utm_medium', 'utm_campaign',
        'paid_customer', 'lifetime_value_cents',
        'stripe_customer_ids', 'stripe_session_ids', 'tags',
    ]
    with (dst / 'normalized' / 'contacts.csv').open('w', newline='', encoding='utf-8') as fh:
        w = csv.DictWriter(fh, fieldnames=fieldnames)
        w.writeheader()
        for r in real:
            w.writerow({
                'email': r.get('email', ''),
                'name': r.get('name', ''),
                'company': r.get('company', ''),
                'phone': r.get('phone', ''),
                'first_seen_at': r.get('first_seen_at', ''),
                'last_seen_at': r.get('last_seen_at', ''),
                'sources': '; '.join(r.get('sources', [])),
                'utm_source': r.get('utm_source', ''),
                'utm_medium': r.get('utm_medium', ''),
                'utm_campaign': r.get('utm_campaign', ''),
                'paid_customer': 'yes' if r.get('paid_customer') else 'no',
                'lifetime_value_cents': r.get('lifetime_value_cents', 0),
                'stripe_customer_ids': '; '.join(r.get('stripe_customer_ids', [])),
                'stripe_session_ids': '; '.join(r.get('stripe_session_ids', [])),
                'tags': '; '.join(r.get('tags', [])),
            })

    # Filter each raw dump: keep only docs whose email is in kept_emails.
    raw_summary = {}
    for raw_file in (src / 'raw').iterdir():
        docs = json.load(open(raw_file))
        filtered = []
        for d in docs:
            # Grab whatever email-ish field this collection uses.
            candidates = [
                d.get('email'),
                d.get('customer_email'),
                d.get('contact'),
            ]
            emails = {(c or '').lower() for c in candidates if c}
            if emails & kept_emails:
                filtered.append(d)
        (dst / 'raw' / raw_file.name).write_text(
            json.dumps(filtered, default=str, ensure_ascii=False, indent=2)
        )
        raw_summary[raw_file.stem] = len(filtered)

    manifest = {
        'source_bundle': str(src),
        'filtered_contacts': len(real),
        'kept_emails': sorted(kept_emails),
        'raw_docs_by_collection': raw_summary,
        'raw_docs_total': sum(raw_summary.values()),
        'filter_rules': {
            'kept': 'real (external, non-test, non-internal)',
            'dropped': ['test', 'internal', 'plus-alias-test', 'no-email'],
        },
    }
    (dst / 'manifest.json').write_text(json.dumps(manifest, indent=2))

    print(f"→ Cleaned bundle: {dst}")
    print(f"  Contacts kept:   {len(real)}")
    print(f"  Raw docs kept:   {sum(raw_summary.values())}")
    print(f"  Emails:          {', '.join(sorted(kept_emails))}")
    return dst


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)
    filter_bundle(Path(sys.argv[1]))
