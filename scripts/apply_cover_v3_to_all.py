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

ASSETS = Path('/app/frontend/public/assets')

# (filename, replace_page_1, cover_kwargs)
JOBS = [
    (
        'gl-fm-2026.pdf', True,
        dict(
            title='The GigLine Field Manual',
            subtitle='Walkthrough Companion for Small Manufacturing Teams',
            body='The 12-page reference GigLine uses on every walkthrough. Written for the supervisor responsible for safety on the floor — no jargon, no fluff, no third-party filler.',
            header_slug='FIELD MANUAL | VERSION 2026',
            version_footer='2026 Edition',
            whats_inside_items=[
                'OSHA Top-10 Cited Standards',
                'RED / AMBER / GREEN Fix Framework',
                'Machine-Guarding Quick Reference',
                'Written Program Requirements',
                'HazCom & SDS Snapshot Checklist',
                'Inspection Response Playbook',
                'Training Documentation Standards',
                '30 / 60 / 90-Day Corrective Timelines',
            ],
            process_flow=['Walk', 'Score', 'Report', 'Fix', 'Verify'],
        ),
    ),
    (
        'gl-faq-2026.pdf', False,
        dict(
            title='Frequently Asked Questions',
            subtitle='GigLine Safety & Compliance',
            body='The straight answers business owners actually ask — pricing, timeline, deliverables, and what happens after we walk your floor.',
            header_slug='PROSPECT REFERENCE | VERSION 2026',
            version_footer='2026 Edition',
            whats_inside_items=[
                'What GigLine actually does',
                'How pricing works',
                'Typical engagement timeline',
                'What we hand back',
                'Who owns the deliverables',
                'When to schedule a walkthrough',
                'Follow-up + verification',
                'How to reach Vince directly',
            ],
        ),
    ),
    (
        'gl-pricing-2026.pdf', False,
        dict(
            title='Pricing & Engagement Menu',
            subtitle='Transparent Fixed-Price Compliance Services',
            body='Every engagement priced up front. Quote given in writing after a free 15-minute scope call. No hourly billing, no surprise invoices, no retainer traps.',
            header_slug='PRICING SHEET | VERSION 2026',
            version_footer='2026 Edition',
            whats_inside_items=[
                'Safety Walkthrough — From $1,200',
                'Documentation Readiness Review — From $1,300',
                'Compliance Readiness Visit — From $2,000',
                'OSHA-Ready Control System — From $4,500',
                'Annual Compliance Control Partner',
                'Quarterly Support Retainer',
                'Incident-Response Emergency Visits',
                'Bundled program discounts',
            ],
            process_flow=['Scope', 'Quote', 'Schedule', 'Deliver'],
        ),
    ),
    (
        'gl-osha-inspection-guide-2026.pdf', False,
        dict(
            title='The OSHA Inspection Response Guide',
            subtitle='What To Do When OSHA Arrives',
            body='A field-tested playbook for HR managers and safety coordinators handling an unannounced OSHA visit. From the opening conference to the closing walkaround — what to say, what to hand over, and what not to.',
            header_slug='HR & SAFETY LEADERS | VERSION 2026',
            version_footer='2026 Edition',
            whats_inside_items=[
                'The moment OSHA knocks',
                'Opening conference protocol',
                'Documents to produce (and hold)',
                'Employee interview rights',
                'Photo & sampling procedures',
                'Managing the walkaround',
                'Closing conference checklist',
                'Contest & abatement timelines',
            ],
            process_flow=['Greet', 'Opening', 'Walkaround', 'Closing', 'Respond'],
        ),
    ),
    (
        'gl-case-study-statesville-2026.pdf', False,
        dict(
            title='Metals Fabrication Case Study',
            subtitle='Statesville, NC — June 2026',
            body='A redacted engagement summary from a real Compliance Readiness Visit. Findings, corrective actions, timelines, and outcomes — with client identifiers withheld.',
            header_slug='CASE STUDY | REDACTED',
            version_footer='Report ID 62FC03EB',
            whats_inside_items=[
                'Client operation profile',
                'Site walkthrough scope',
                'Documentation review findings',
                'CFR-cited hazard inventory',
                'RED / AMBER / GREEN triage',
                '90-day corrective action log',
                'Verified fix outcomes',
                'What changed on the floor',
            ],
        ),
    ),
    (
        'gl-doc-review-prep-checklist.pdf', False,
        dict(
            title='Documentation Readiness Review',
            subtitle='Pre-Engagement Prep Checklist',
            body='What to pull together before your GigLine Documentation Readiness Review so we can score your files against the same standard OSHA uses — and give you a compliance % on day one.',
            header_slug='PROSPECT PREP | VERSION 2026',
            version_footer='2026 Edition',
            whats_inside_items=[
                'Written safety program binder',
                'OSHA 300 / 300A / 301 logs',
                'Training rosters + certifications',
                'SDS + chemical inventory',
                'Inspection records (12 mo.)',
                'Incident reports + investigations',
                'Contractor & vendor safety',
                'Emergency action plan',
            ],
            process_flow=['Gather', 'Deliver', 'Review', 'Score', 'Report'],
        ),
    ),
    (
        'gl-lm-001-digital.pdf', False,
        dict(
            title='Top 5 Heat-Related OSHA Violations',
            subtitle='And How to Fix Them Before They Cost You',
            body='The five heat-illness citations OSHA writes most frequently to manufacturing, warehousing, and outdoor-industrial employers — with the specific CFR reference and the corrective action for each.',
            header_slug='FREE GUIDE | LM-001',
            version_footer='2026 Edition',
            whats_inside_items=[
                'The heat-hazard General Duty Clause',
                'Written acclimatization protocols',
                'Water / rest / shade requirements',
                'Symptom recognition training',
                'Emergency response readiness',
                'Documented supervisor drills',
                'What a citation costs',
                'Same-week corrective actions',
            ],
            process_flow=['Identify', 'Document', 'Train', 'Verify'],
        ),
    ),
    (
        'GigLine_Sample_Corrective_Action_Log.pdf', True,
        dict(
            title='Sample Corrective Action Log',
            subtitle='Metals Fabrication · Statesville, NC · June 2026',
            body='Pages 7–17 of a real engagement report. Findings, CFR citations, priority ratings, corrective actions, and timelines are accurate to the engagement. Client identifiers withheld.',
            header_slug='REDACTED EXCERPT | REPORT ID 62FC03EB',
            version_footer='2026 Edition',
            whats_inside_items=[
                'Finding classification method',
                'CRITICAL / SERIOUS / DOCUMENTATION labels',
                'CFR-cited hazard entries',
                'Per-finding corrective action steps',
                'Action owner assignments',
                'Timeline commitments (30/60/90-day)',
                'Consolidated action-log summary',
                'Document coverage gap table',
            ],
            process_flow=['Find', 'Document', 'Assign', 'Verify', 'Close'],
        ),
    ),
]


def main():
    total = 0
    for filename, replace_p1, kwargs in JOBS:
        src = ASSETS / filename
        if not src.is_file():
            print(f'⚠ MISSING: {filename}')
            continue
        # write to a temp path then swap into place
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
    print(f'\n✓ {total}/{len(JOBS)} PDFs now use the GigLine Cover v3 standard.')


if __name__ == '__main__':
    main()
