"""Recommendation content mirror (server-side).

Mirrors the released-service branches of
`/app/frontend/src/data/recommendationEngine.js`. The endpoint at
`/api/recommendation/email` looks up the visitor's recommendation by
slug from this allow-list so no HTML or free text from the client is
ever placed into an outbound email — only structured fields.

Slugs outside this allow-list are rejected with 400.
"""

SW_INCLUDED = [
    "Half-day on-site walkthrough covering machine guarding, LOTO evidence, HazCom labels, PPE zones, PIT & rack condition, means of egress.",
    "Photo evidence of every citation-risk item found.",
    "Written report within 48 hours with hazard severity, CFR citation, and recommended corrective action.",
    "One follow-up call to talk the report through with a named supervisor.",
]
SW_NOT_INCLUDED = [
    "Written program review or documentation audit (see Documentation Readiness Review).",
    "Corrective-action implementation labor (see Corrective Action Implementation).",
    "Ongoing monthly retainer (see Ongoing Safety Support).",
]

DRR_INCLUDED = [
    "Review of written safety programs (HazCom, LOTO, PIT, PPE, Bloodborne, Respiratory, and more, as applicable).",
    "Training-record structure audit against retention rules.",
    "Recordkeeping (OSHA 300/301/300A where applicable) sanity check.",
    "Gap report tied to specific CFR paragraphs.",
    "Prioritized documentation remediation list.",
]
DRR_NOT_INCLUDED = [
    "Floor walkthrough (see Safety Walkthrough).",
    "Ghostwriting missing programs (see Safety Control System).",
    "Monthly retainer (see Ongoing Safety Support).",
]

CRV_INCLUDED = [
    "Everything in the Safety Walkthrough (half-day floor visit + 48-hour report).",
    "Everything in the Documentation Readiness Review (written-program and records audit).",
    "Combined report ranking findings by citation risk and remediation effort.",
    "One follow-up call and a written 30/60/90 corrective-action ladder.",
    "$500 combined-scope saving vs purchasing the two engagements separately.",
]
CRV_NOT_INCLUDED = [
    "Implementation labor on the corrective actions (see Corrective Action Implementation).",
    "Buildout of missing programs from scratch (see Safety Control System).",
    "Monthly retainer (see Ongoing Safety Support).",
]

CA_INCLUDED = [
    "Assignment of an owner to every open finding.",
    "Target-date scheduling and closure tracking.",
    "Documented corrective-action evidence per finding.",
    "Written or photographic closure verification.",
    "A closed-loop corrective-action log.",
]
CA_NOT_INCLUDED = [
    "Initial floor walkthrough (see Safety Walkthrough).",
    "Documentation review (see Documentation Readiness Review).",
    "Ongoing monthly retainer (see Ongoing Safety Support).",
]

SCS_INCLUDED = [
    "Site-specific written safety-program buildout.",
    "Digital-first documentation structure.",
    "Training-record and evidence organization.",
    "Corrective-action log baseline.",
    "Supervisor handoff at delivery.",
]
SCS_NOT_INCLUDED = [
    "Software license or SaaS subscription.",
    "Generic template binder without site tailoring.",
    "Ongoing monthly retainer (see Ongoing Safety Support).",
]

OSS_INCLUDED = [
    "One scheduled on-site visit per month.",
    "Corrective-action tracker updates.",
    "Records review.",
    "Monthly management report.",
]
OSS_NOT_INCLUDED = [
    "Buildout of missing written programs (see Safety Control System).",
    "Initial diagnostic (see Compliance Readiness Visit).",
    "Implementation labor on legacy open findings (see Corrective Action Implementation).",
]

BASE_DISCLAIMER = (
    "This recommendation is educational and reflects the answers provided. It is not a compliance "
    "evaluation, a legal opinion, or a substitute for a written program review or on-site walkthrough. "
    "Federal OSHA standards apply broadly; state OSH plans, including North Carolina OSH, may impose "
    "additional requirements. Every item must be evaluated against the specific operation."
)

# ── Curated field-note reading list per recommendation slug ──
# Each entry: {slug, title, why}. `why` is 2–3 sentences framing why THIS
# field note matters for THIS specific recommendation. Titles and site
# URLs come from the frontend at /field-notes/<slug>.
FIELD_NOTES_BASE_URL = "https://www.giglinecompliance.com/field-notes"

FIELD_NOTES_BY_SLUG = {
    "safety-walkthrough": [
        {"slug": "machine-guarding", "title": "Machine Guarding", "why": "Machine guarding is the single most-cited standard for small manufacturers. Read this before Vince arrives so you can pre-walk the shop with the same eye and know which items are already close."},
        {"slug": "abrasive-wheels-bench-grinders", "title": "Abrasive Wheels & Bench Grinders", "why": "Bench grinders trip almost every walkthrough — the 1/8\" tongue-guard and 1/4\" work-rest tolerances are easy to fix once you see them. This note is the fastest pre-walk win."},
        {"slug": "walking-working-surfaces", "title": "Walking Surfaces", "why": "Slip, trip, and fall hazards get called out on more walkthroughs than any category besides guarding. Fixing these before the visit turns a citation risk into a 'no findings' bullet."},
        {"slug": "ppe-assessment-use", "title": "PPE Assessment & Use", "why": "OSHA does not just want PPE on the floor — it wants a written hazard assessment justifying each PPE zone. This note shows what that assessment looks like."},
    ],
    "documentation-review": [
        {"slug": "hazcom-sds", "title": "HazCom & SDS", "why": "HazCom is the #2 most-cited standard in general industry. Every documentation review starts here — read this to know what a compliant SDS binder and label system actually look like."},
        {"slug": "recordkeeping-300-log", "title": "OSHA Recordkeeping & the 300 Log", "why": "Most 300 Logs Vince sees are either missing entries, miscoded, or posted for the wrong dates. This note shows the specific mistakes that get flagged."},
        {"slug": "ai-safety-program-not-working", "title": "An AI-Generated Program Is Not a Working Program", "why": "If your written programs came from ChatGPT or a template site, this note explains what OSHA looks for that generic content cannot pass. It sets expectations before Vince returns your gap report."},
        {"slug": "nc-osha-vs-federal", "title": "NC OSH vs Federal OSHA", "why": "North Carolina operates a State Plan with rules that go beyond federal OSHA in specific areas. This note tells you which NC-specific requirements your written programs must address."},
    ],
    "compliance-readiness-visit": [
        {"slug": "nc-osha-vs-federal", "title": "NC OSH vs Federal OSHA", "why": "Since the CRV covers both floor and paper, and NC OSH has state-specific requirements, this note frames what NC compliance actually demands beyond the federal baseline."},
        {"slug": "machine-guarding", "title": "Machine Guarding", "why": "The floor half of the CRV opens with guarding. This is the primer for what Vince will photograph and cite in the report."},
        {"slug": "hazcom-sds", "title": "HazCom & SDS", "why": "The paper half of the CRV opens with HazCom. Read this to understand which parts of your written program and label system Vince will audit."},
        {"slug": "recordkeeping-300-log", "title": "OSHA Recordkeeping & the 300 Log", "why": "The CRV combined report checks whether your 300 Log matches your training records and incident history. This note shows the specific mismatches that get called out."},
    ],
    "corrective-action-implementation": [
        {"slug": "recordkeeping-300-log", "title": "OSHA Recordkeeping & the 300 Log", "why": "Corrective-action work depends on a clean incident and audit trail. This note shows what the record trail needs to look like so each closed finding has evidence behind it."},
        {"slug": "machine-guarding", "title": "Machine Guarding", "why": "If your open findings include guarding items, this note tells you which fixes are inexpensive and immediate versus which require a purchase order."},
        {"slug": "loto-lockout-tagout", "title": "Lockout/Tagout (LOTO)", "why": "LOTO findings usually cluster together: missing energy-control procedures, gaps in authorized-employee training, or a device inventory that is stale. This note names the pattern so you can group corrective actions efficiently."},
        {"slug": "hazcom-sds", "title": "HazCom & SDS", "why": "HazCom corrective actions look small on paper but require label audits, SDS refresh, and training documentation to actually close. This note lays out the full closure evidence."},
    ],
    "safety-control-system-buildout": [
        {"slug": "emergency-action-plans", "title": "Emergency Action Plans", "why": "Every Safety Control System delivery includes an EAP. This note shows what a site-specific EAP looks like versus the template PDFs most software delivers."},
        {"slug": "recordkeeping-300-log", "title": "OSHA Recordkeeping & the 300 Log", "why": "The buildout hands the supervisor a records structure. Read this first to understand what the receiving team must maintain once the system is delivered."},
        {"slug": "hazcom-sds", "title": "HazCom & SDS", "why": "HazCom is a foundational element of every control system. This note is the blueprint for the section Vince will write for your operation."},
        {"slug": "ppe-assessment-use", "title": "PPE Assessment & Use", "why": "Most control systems fail their PPE section because the underlying hazard assessment is missing. This note is the assessment format Vince will use."},
    ],
    "ongoing-safety-support": [
        {"slug": "recordkeeping-300-log", "title": "OSHA Recordkeeping & the 300 Log", "why": "Ongoing Support is anchored on monthly records review. Read this note to see what Vince checks each month and how quarterly / annual events are staged."},
        {"slug": "nc-osha-vs-federal", "title": "NC OSH vs Federal OSHA", "why": "NC OSH inspection cadence and outreach programs are different from federal OSHA. This note names what to watch for in your specific NC industry code."},
        {"slug": "hazcom-sds", "title": "HazCom & SDS", "why": "HazCom is the standard that changes most often (new chemicals, new SDS revisions, new labels). Monthly review always includes this."},
        {"slug": "ai-safety-program-not-working", "title": "An AI-Generated Program Is Not a Working Program", "why": "Ongoing support only works if the underlying program is real. This note is the honest gut-check to run before you renew."},
    ],
}


RECOMMENDATION_CONTENT = {
    "safety-walkthrough": {
        "slug": "safety-walkthrough",
        "name": "Safety Walkthrough",
        "price": "$1,300",
        "route": "https://www.giglinecompliance.com/services/safety-walkthrough",
        "why": (
            "Fresh eyes on the floor is the fastest way to catch the specific hazards OSHA cites. A "
            "Safety Walkthrough gives you a photo-evidence report tied to CFR paragraphs so a supervisor "
            "can act on it inside a week."
        ),
        "included": SW_INCLUDED,
        "not_included": SW_NOT_INCLUDED,
        "next_step": (
            "Book the walkthrough. Vince arrives on your day, walks the shop for a half-day, and delivers "
            "the report within 48 hours."
        ),
        "disclaimer": BASE_DISCLAIMER,
    },
    "documentation-review": {
        "slug": "documentation-review",
        "name": "Documentation Readiness Review",
        "price": "$1,700",
        "route": "https://www.giglinecompliance.com/services/documentation-readiness-review",
        "why": (
            "Paper records are the second most common citation source after floor hazards. A Documentation "
            "Readiness Review audits your written programs, training records, and recordkeeping against the "
            "CFR paragraphs OSHA opens with, and returns a prioritized remediation list."
        ),
        "included": DRR_INCLUDED,
        "not_included": DRR_NOT_INCLUDED,
        "next_step": (
            "Send us your program binder (or shared drive). Vince returns a gap report with a supervisor "
            "walkthrough call within 5 business days."
        ),
        "disclaimer": BASE_DISCLAIMER,
    },
    "compliance-readiness-visit": {
        "slug": "compliance-readiness-visit",
        "name": "Compliance Readiness Visit",
        "price": "$2,500",
        "route": "https://www.giglinecompliance.com/services/compliance-readiness-visit",
        "why": (
            "When both the floor AND the paper need attention, the Compliance Readiness Visit combines the "
            "Safety Walkthrough and Documentation Readiness Review into a single engagement with one merged "
            "report and a 30/60/90 action ladder. $500 saving vs the two scopes separately."
        ),
        "included": CRV_INCLUDED,
        "not_included": CRV_NOT_INCLUDED,
        "next_step": (
            "Book the CRV. Vince arrives on your day for the walkthrough, collects the program binder, and "
            "delivers the combined report within 5 business days."
        ),
        "disclaimer": BASE_DISCLAIMER,
    },
    "corrective-action-implementation": {
        "slug": "corrective-action-implementation",
        "name": "Corrective Action Implementation",
        "price": "Custom quote, starting at $2,500",
        "route": "https://www.giglinecompliance.com/services/corrective-action-implementation",
        "why": (
            "When findings already exist and closure is stalled, Corrective Action Implementation puts an "
            "owner, target date, and evidence trail on every open item and closes the loop in writing."
        ),
        "included": CA_INCLUDED,
        "not_included": CA_NOT_INCLUDED,
        "next_step": (
            "Share the current findings list. Vince scopes and returns a fixed quote before any "
            "implementation work begins."
        ),
        "disclaimer": BASE_DISCLAIMER,
    },
    "safety-control-system-buildout": {
        "slug": "safety-control-system-buildout",
        "name": "Safety Control System",
        "price": "$4,500",
        "route": "https://www.giglinecompliance.com/services/safety-control-system-buildout",
        "why": (
            "When the written programs are missing or non-site-specific, the Safety Control System buildout "
            "delivers a site-tailored program set, records structure, and corrective-action log baseline so "
            "the supervisor inherits a working system, not a template."
        ),
        "included": SCS_INCLUDED,
        "not_included": SCS_NOT_INCLUDED,
        "next_step": (
            "Request the buildout, share your operation profile, and receive a fixed quote and delivery "
            "timeline."
        ),
        "disclaimer": BASE_DISCLAIMER,
    },
    "ongoing-safety-support": {
        "slug": "ongoing-safety-support",
        "name": "Ongoing Safety Support",
        "price": "$1,850 / month",
        "route": "https://www.giglinecompliance.com/ongoing-safety-support",
        "why": (
            "After the foundation is in place, Ongoing Safety Support keeps the shop honest with one monthly "
            "on-site visit, records review, and a management report so nothing slips between quarters."
        ),
        "included": OSS_INCLUDED,
        "not_included": OSS_NOT_INCLUDED,
        "next_step": (
            "Confirm foundation qualification (walkthrough, documentation, and corrective actions handled), "
            "agree on the monthly cadence, and receive a fixed monthly quote before scheduling."
        ),
        "disclaimer": BASE_DISCLAIMER,
    },
}
