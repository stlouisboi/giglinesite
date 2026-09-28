"""First-Pull checklist content mirror (server-side).

Mirrors `/app/frontend/src/data/firstPullChecklists.js` so the backend can
render the checklist inline in the transactional email without the client
supplying the body (guards against the open-relay risk called out in the
Emergent email guardrails — the caller only supplies a slug, the recipient's
own email, and consent). Regenerate manually if the frontend data changes.

`kit_url` is the absolute URL the visitor's email will link to as the natural
paid upsell for each First-Pull checklist. Release status mirrors the
frontend `KitLink` component.
"""

FIRST_PULL_CONTENT = {
    "loto": {
        "slug": "loto",
        "program": "Lockout / Tagout",
        "title": "LOTO First-Pull Checklist",
        "intro": "Lockout/Tagout is defined at 29 CFR 1910.147. The written program, machine-specific procedures, employee training, and periodic inspection certification are the paper elements the standard actually requires.",
        "items": [
            {"text": "Written Energy Control Program with procedures, techniques, and enforcement.", "cite": "29 CFR 1910.147(c)(4)(i)", "kind": "required"},
            {"text": "Machine-specific written energy control procedures for each machine or piece of equipment where servicing or maintenance occurs.", "cite": "29 CFR 1910.147(c)(4)(i) and (c)(4)(ii)", "kind": "required"},
            {"text": "Employee training records for authorized, affected, and other employees, plus retraining when duties, machines, or procedures change.", "cite": "29 CFR 1910.147(c)(7)(i) and (c)(7)(iv)", "kind": "required"},
            {"text": "Certification of periodic inspection of each energy control procedure at least annually.", "cite": "29 CFR 1910.147(c)(6)(ii)", "kind": "required"},
            {"text": "Locks and tags identifiable to a specific employee and not used for any other purpose.", "cite": "29 CFR 1910.147(c)(5)(ii)", "kind": "required"},
            {"text": "Named LOTO program administrator or accountable owner with current contact information.", "cite": "GigLine readiness practice, not a specific CFR requirement", "kind": "gigline"},
            {"text": "Lock and tag issuance inventory tying each serial-numbered lock or personal tag to the assigned employee.", "cite": "GigLine readiness practice, not a specific CFR requirement", "kind": "gigline"},
            {"text": "Revision-number and dated-review controls on the written program document itself.", "cite": "GigLine readiness practice, not a specific CFR requirement", "kind": "gigline"},
        ],
        "kit_url": "https://www.giglinecompliance.com/citation-proof-kits/loto-readiness-kit",
        "kit_label": "See the LOTO Readiness Kit",
        "kit_live": True,
    },
    "forklift-pit": {
        "slug": "forklift-pit",
        "program": "Forklift & Powered Industrial Trucks",
        "title": "Forklift & PIT First-Pull Checklist",
        "intro": "Powered Industrial Trucks are covered at 29 CFR 1910.178. Operator training, evaluation, and refresher triggers are specific to the standard.",
        "items": [
            {"text": "Operator training and evaluation records certifying each operator has been trained and evaluated to operate the specific type of truck they use.", "cite": "29 CFR 1910.178(l)(6)", "kind": "required"},
            {"text": "Truck-type-specific training documentation for each truck class an operator is authorized to use.", "cite": "29 CFR 1910.178(l)(3)", "kind": "required"},
            {"text": "Refresher training when the operator has been observed operating unsafely, been in an accident, or is assigned a different type of truck.", "cite": "29 CFR 1910.178(l)(4)(ii)", "kind": "required"},
            {"text": "Operator performance evaluation at least once every three years.", "cite": "29 CFR 1910.178(l)(4)(iii)", "kind": "required"},
            {"text": "Trucks examined at least daily before being placed in service, and after each shift on round-the-clock ops.", "cite": "29 CFR 1910.178(q)(7)", "kind": "applicability"},
            {"text": "LP-fuel handling training when the operation uses propane-powered trucks and operators change cylinders.", "cite": "29 CFR 1910.110 and 1910.178(f); applicability-dependent", "kind": "applicability"},
            {"text": "Battery charging area controls, ventilation, eyewash, and PPE when using electric trucks with lead-acid batteries.", "cite": "29 CFR 1910.178(g) and 1910.151(c); applicability-dependent", "kind": "applicability"},
            {"text": "Truck maintenance records or documented preventive-maintenance cadence; remove any truck found unsafe until restored.", "cite": "29 CFR 1910.178(p)", "kind": "gigline"},
            {"text": "Named PIT program administrator, authorized-user roster posted or available on request.", "cite": "GigLine readiness practice", "kind": "gigline"},
        ],
        "kit_url": "https://www.giglinecompliance.com/citation-proof-kits/forklift-pit-readiness-kit",
        "kit_label": "See the Forklift & PIT Readiness Kit",
        "kit_live": True,
    },
    "hazcom": {
        "slug": "hazcom",
        "program": "Hazard Communication",
        "title": "HazCom First-Pull Checklist",
        "intro": "Hazard Communication is defined at 29 CFR 1910.1200. Written program, chemical list, SDS access, container labeling, and employee training are specific standard requirements.",
        "items": [
            {"text": "Written HazCom program describing how the employer will meet labels, SDSs, and employee training, and listing the hazardous chemicals present.", "cite": "29 CFR 1910.1200(e)(1)", "kind": "required"},
            {"text": "Employer-maintained list of hazardous chemicals present, referenced to the appropriate SDS.", "cite": "29 CFR 1910.1200(e)(1)(i)", "kind": "required"},
            {"text": "SDS for each hazardous chemical, readily accessible during each work shift.", "cite": "29 CFR 1910.1200(g)(8)", "kind": "required"},
            {"text": "Employee information and training on the hazards of chemicals at initial assignment and when new chemicals are introduced.", "cite": "29 CFR 1910.1200(h)(1) and (h)(3)", "kind": "required"},
            {"text": "Labels on shipped containers with product identifier, signal word, hazard statement, pictogram, precautionary statement, supplier identification.", "cite": "29 CFR 1910.1200(f)(1) and (f)(6)", "kind": "required"},
            {"text": "Portable-container exception for immediate use by the transferring employee.", "cite": "29 CFR 1910.1200(f)(8); applicability-dependent", "kind": "applicability"},
            {"text": "Non-routine task hazard communication procedure when employees perform non-routine tasks with hazardous chemicals.", "cite": "29 CFR 1910.1200(e)(1)(ii)", "kind": "required"},
            {"text": "Multi-employer worksite information exchange when contractor employees may be exposed to the operation's hazardous chemicals.", "cite": "29 CFR 1910.1200(e)(2)", "kind": "applicability"},
            {"text": "GigLine readiness test: SDS retrievable within three minutes at every work location, plus a current chemical inventory reviewed on a defined schedule.", "cite": "GigLine practice built on 29 CFR 1910.1200(g)(8)", "kind": "gigline"},
            {"text": "Named HazCom program administrator, revision-number and dated-review controls on the written program document.", "cite": "GigLine readiness practice", "kind": "gigline"},
        ],
        "kit_url": "https://www.giglinecompliance.com/citation-proof-kits/hazcom-pro-kit",
        "kit_label": "See the HazCom Pro Kit",
        "kit_live": True,
    },
    "incident": {
        "slug": "incident",
        "program": "Incident to Correction",
        "title": "Incident-to-Correction First-Pull Checklist",
        "intro": "Incident recording and reporting are governed by 29 CFR Part 1904. Not every employer or incident triggers every record. Partial-exemption categories alter the 300/301/300A requirements.",
        "items": [
            {"text": "OSHA Form 301 Injury and Illness Incident Report completed within 7 calendar days of recordable-injury information (non-exempt employers).", "cite": "29 CFR 1904.29(b)(3); exemption at 1904.1 and 1904.2", "kind": "applicability"},
            {"text": "OSHA Form 300 Log entry within 7 calendar days of recordable-injury information (non-exempt employers).", "cite": "29 CFR 1904.29(b)(3)", "kind": "applicability"},
            {"text": "OSHA Form 300A Summary posted Feb 1 through Apr 30 each year for the previous year (non-exempt employers).", "cite": "29 CFR 1904.32(b)(6)", "kind": "applicability"},
            {"text": "Report a fatality to OSHA within 8 hours. Report an in-patient hospitalization, amputation, or loss of an eye within 24 hours.", "cite": "29 CFR 1904.39(a) and (b)", "kind": "required"},
            {"text": "Retain OSHA 300, 301, and 300A for 5 years following the end of the calendar year the records cover.", "cite": "29 CFR 1904.33", "kind": "applicability"},
            {"text": "Internal employee incident or near-miss report with witness statements.", "cite": "GigLine readiness practice", "kind": "gigline"},
            {"text": "Root-cause investigation identifying mechanical, procedural, human, and management factors.", "cite": "GigLine readiness practice", "kind": "gigline"},
            {"text": "Corrective actions assigned to a named owner with target date and evidence of closure.", "cite": "GigLine readiness practice", "kind": "gigline"},
            {"text": "Follow-up verification that the corrective action holds after implementation.", "cite": "GigLine readiness practice", "kind": "gigline"},
            {"text": "Handle medical information as confidential; restrict access, redact PII, comply with HIPAA / ADA / state rules.", "cite": "29 CFR 1904.29(b)(6-10); broader confidentiality is a GigLine practice on privacy law", "kind": "gigline"},
            {"text": "Named incident-response coordinator with a defined reporting channel available to every employee.", "cite": "GigLine readiness practice", "kind": "gigline"},
        ],
        "kit_url": "https://www.giglinecompliance.com/citation-proof-kits/incident-to-correction-kit",
        "kit_label": "Join the Incident-to-Correction waitlist",
        "kit_live": False,
    },
    "new-hire": {
        "slug": "new-hire",
        "program": "New Hire Orientation",
        "title": "New Hire Orientation First-Pull Checklist",
        "intro": "Federal OSHA does not universally require a single written New Hire Orientation program. Obligations depend on the hazards the employee will be exposed to and the equipment they will operate.",
        "items": [
            {"text": "HazCom information and training at the time of initial assignment.", "cite": "29 CFR 1910.1200(h)(1)", "kind": "required"},
            {"text": "PIT operator training and evaluation before the employee operates a truck independently, when applicable.", "cite": "29 CFR 1910.178(l)(1) and (l)(6); applicability-dependent", "kind": "applicability"},
            {"text": "LOTO training before performing or being affected by servicing or maintenance under a LOTO scope, when applicable.", "cite": "29 CFR 1910.147(c)(7)(i); applicability-dependent", "kind": "applicability"},
            {"text": "Respiratory protection medical evaluation, fit testing, and training when a respirator is required.", "cite": "29 CFR 1910.134(e), (f), and (k); applicability-dependent", "kind": "applicability"},
            {"text": "Bloodborne Pathogens training at initial assignment to tasks where occupational exposure may take place, when applicable.", "cite": "29 CFR 1910.1030(g)(2); applicability-dependent", "kind": "applicability"},
            {"text": "PPE hazard assessment, training, and issuance records specific to each hazard and PPE type.", "cite": "29 CFR 1910.132(d), (f), and 1910.133-1910.140", "kind": "required"},
            {"text": "Emergency Action Plan training when the standard requires a written EAP or an EAP is otherwise established.", "cite": "29 CFR 1910.38 and 1910.157(e); applicability-dependent", "kind": "applicability"},
            {"text": "Written New Hire Safety Orientation packet with signed acknowledgment retained per each standard's retention rule.", "cite": "GigLine readiness practice", "kind": "gigline"},
            {"text": "Named orientation trainer or supervisor, dated signature on each new-hire packet.", "cite": "GigLine readiness practice", "kind": "gigline"},
        ],
        "kit_url": "https://www.giglinecompliance.com/citation-proof-kits/new-hire-orientation-kit",
        "kit_label": "Join the New Hire Orientation waitlist",
        "kit_live": False,
    },
}
