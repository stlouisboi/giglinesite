"""
GigLine → ATLAS one-shot lead/customer export.

Purpose
-------
Dump every lead, contact, safety-check submission, order, and paid Stripe
customer into two artifact bundles:

  1. `raw/`            — full, unmodified JSON dump of each MongoDB collection
                          (source of truth backup — never lossy)
  2. `normalized/`     — unified `contacts.csv` + `contacts.json` — one row per
                          unique lowercased email, merged across every source

The normalized bundle is what ATLAS (or any downstream CRM) should ingest.
The raw bundle is the safety net so we can always re-normalize with a
different schema without re-querying Mongo.

Usage
-----
    python scripts/export_leads_for_atlas.py [--out DIR] [--skip-stripe]

Requires the same env vars the backend uses:
    MONGO_URL, DB_NAME, STRIPE_API_KEY (optional — omit or --skip-stripe
    to skip the Stripe customer pull)

Safe to run against production — READ-ONLY. Writes only to the output dir.
"""

from __future__ import annotations

import argparse
import asyncio
import csv
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

# Make backend imports available.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

from motor.motor_asyncio import AsyncIOMotorClient  # noqa: E402


# ─────────────────────────────────────────────────────────────────────────────
# Collections to dump. Ordered by "richness" — richer sources supply the
# canonical name / company / phone when merging duplicates by email.
# ─────────────────────────────────────────────────────────────────────────────
LEAD_COLLECTIONS = [
    # (mongo collection,  source label,             extractor kind)
    ("gl_intake_submissions",        "intake",              "intake"),
    ("walkthrough_requests",         "walkthrough",         "walkthrough"),
    ("gl_bookings",                  "booking",             "booking"),
    ("contact_messages",             "contact-form",        "contact_message"),
    ("quick_contact_leads",          "quick-contact",       "quick_contact"),
    ("safety_check_submissions",     "safety-check",        "safety_check"),
    ("sample_report_leads",          "sample-report",       "gated_download"),
    ("osha_inspection_guide_leads",  "osha-inspection-gd",  "gated_download"),
    ("heat_guide_leads",             "heat-guide",          "gated_download"),
    ("newsletter_subscribers",       "newsletter",          "newsletter"),
    # Paid orders — richest tier of contact (paid customer).
    ("gl_citation_proof_kit_orders", "citation-proof-kit",  "kit_order"),
    ("gl_supervisor_kit_orders",     "supervisor-kit",      "kit_order"),
    ("payment_transactions",         "payment-transaction", "payment_transaction"),
]


def _norm_email(v) -> str:
    if not v or not isinstance(v, str):
        return ""
    return v.strip().lower()


def _iso(v) -> str:
    """Coerce any of (datetime, ISO string, epoch int) to an ISO string."""
    if not v:
        return ""
    if isinstance(v, datetime):
        return v.astimezone(timezone.utc).isoformat() if v.tzinfo else v.replace(tzinfo=timezone.utc).isoformat()
    if isinstance(v, (int, float)) and v > 0:
        try:
            return datetime.fromtimestamp(v, tz=timezone.utc).isoformat()
        except Exception:
            return str(v)
    return str(v)


def _attrib(doc: dict) -> dict:
    """Extract first-touch UTM from an intake-style `attribution` field OR
    flat `utm_source`/`utm_medium`/`utm_campaign` fields (walkthrough style)."""
    out = {"utm_source": "", "utm_medium": "", "utm_campaign": ""}
    a = doc.get("attribution")
    if isinstance(a, dict):
        first = a.get("firstTouch") or {}
        out["utm_source"] = first.get("utm_source", "") or ""
        out["utm_medium"] = first.get("utm_medium", "") or ""
        out["utm_campaign"] = first.get("utm_campaign", "") or ""
    for k in ("utm_source", "utm_medium", "utm_campaign"):
        if doc.get(k) and not out[k]:
            out[k] = doc[k]
    return out


def _extract(kind: str, doc: dict) -> dict | None:
    """Pull unified fields from a source doc. Returns None if no usable email."""
    email = ""
    name = ""
    company = ""
    phone = ""
    when = ""
    tags: list[str] = []
    paid = False
    amount_cents = 0
    stripe_session_id = ""

    if kind == "intake":
        email = doc.get("email", "")
        name = doc.get("contactName") or doc.get("name") or ""
        company = doc.get("companyName") or doc.get("company") or doc.get("dba") or ""
        phone = doc.get("phone", "")
        when = doc.get("submittedAt") or doc.get("created_at") or ""
        if doc.get("promptingReason") in ("upcoming_osha_inspection", "upcoming_osha_visit"):
            tags.append("urgent")
        if doc.get("hasDeadline") == "yes" and doc.get("deadlineDate"):
            tags.append("urgent")
        if doc.get("hadInjuryOrClaim") == "yes":
            tags.append("injury")
        if doc.get("serviceSelected") == "incident_review":
            tags.append("injury")

    elif kind == "walkthrough":
        email = doc.get("email", "")
        name = doc.get("name", "")
        company = doc.get("company", "")
        phone = doc.get("phone", "")
        when = doc.get("timestamp", "")
        svc = doc.get("service")
        if svc:
            tags.append(f"service:{svc}")

    elif kind == "booking":
        email = doc.get("email", "")
        name = doc.get("contact") or doc.get("name") or ""
        company = doc.get("company", "")
        phone = doc.get("phone", "")
        when = doc.get("bookedAt") or doc.get("created_at") or ""

    elif kind == "contact_message":
        email = doc.get("email", "")
        name = doc.get("name", "")
        phone = doc.get("phone", "")
        when = doc.get("created_at", "")

    elif kind == "quick_contact":
        # `contact` field may hold email OR phone.
        contact = doc.get("contact") or ""
        if "@" in contact:
            email = contact
        else:
            phone = contact
        name = doc.get("name", "")
        when = doc.get("created_at", "")

    elif kind == "safety_check":
        email = doc.get("email", "")
        name = doc.get("name", "")
        company = doc.get("company", "")
        phone = doc.get("phone", "")
        when = doc.get("timestamp", "")
        lvl = doc.get("score_level")
        if lvl:
            tags.append(f"safety-check:{lvl.lower()}")

    elif kind == "gated_download":
        email = doc.get("email", "")
        name = doc.get("first_name") or doc.get("name") or ""
        company = doc.get("company", "")
        when = doc.get("created_at", "")

    elif kind == "newsletter":
        email = doc.get("email", "")
        when = doc.get("created_at", "")

    elif kind == "kit_order":
        email = doc.get("customer_email") or doc.get("email") or ""
        name = doc.get("customer_name") or ""
        company = doc.get("company_name") or ""
        phone = doc.get("customer_phone") or ""
        when = doc.get("paid_at") or doc.get("created_at") or ""
        if doc.get("status") == "paid" or doc.get("payment_status") == "paid":
            paid = True
            amount_cents = int(
                doc.get("amount_total_cents") or doc.get("amount_cents") or 0
            )
        stripe_session_id = doc.get("session_id") or ""
        if doc.get("sku"):
            tags.append(f"sku:{doc['sku']}")
        if doc.get("kit_slug"):
            tags.append(f"kit:{doc['kit_slug']}")

    elif kind == "payment_transaction":
        # Used by HazCom Starter Pack + some supervisor kit flows.
        email = doc.get("customer_email") or doc.get("email") or ""
        name = doc.get("customer_name") or ""
        when = doc.get("paid_at") or doc.get("created_at") or ""
        if doc.get("payment_status") == "paid" or doc.get("status") == "paid":
            paid = True
            amount_cents = int(
                doc.get("amount_total") or doc.get("amount_cents") or 0
            )
        stripe_session_id = doc.get("session_id") or ""
        md = doc.get("metadata") or {}
        if md.get("product"):
            tags.append(f"product:{md['product']}")
        if md.get("sku"):
            tags.append(f"sku:{md['sku']}")

    email_norm = _norm_email(email)
    if not email_norm and not phone:
        # No usable identifier — skip. Anonymous safety-check answers land here
        # if the user never gave an email, which is a legit skip.
        return None

    attrib = _attrib(doc)
    return {
        "email": email_norm,
        "name": (name or "").strip(),
        "company": (company or "").strip(),
        "phone": (phone or "").strip(),
        "seen_at": _iso(when),
        "utm_source": attrib["utm_source"],
        "utm_medium": attrib["utm_medium"],
        "utm_campaign": attrib["utm_campaign"],
        "paid": paid,
        "amount_cents": amount_cents,
        "stripe_session_id": stripe_session_id,
        "tags": tags,
    }


# ─────────────────────────────────────────────────────────────────────────────
# Main pipeline
# ─────────────────────────────────────────────────────────────────────────────

async def dump_and_normalize(mongo_url: str, db_name: str, out_dir: Path):
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]

    raw_dir = out_dir / "raw"
    norm_dir = out_dir / "normalized"
    raw_dir.mkdir(parents=True, exist_ok=True)
    norm_dir.mkdir(parents=True, exist_ok=True)

    # contacts keyed by lowercased email (or phone: if no email).
    contacts: dict[str, dict] = {}
    counts: dict[str, int] = {}

    for coll_name, source_label, kind in LEAD_COLLECTIONS:
        cursor = db[coll_name].find({})
        raw_docs: list[dict] = []
        rows_extracted = 0
        async for doc in cursor:
            # ObjectId → str for JSON serialization
            if "_id" in doc:
                doc["_id"] = str(doc["_id"])
            raw_docs.append(doc)

            row = _extract(kind, doc)
            if not row:
                continue
            key = row["email"] or f"phone:{row['phone']}"
            existing = contacts.setdefault(key, {
                "email": row["email"],
                "phone": row["phone"],
                "name": "",
                "company": "",
                "first_seen_at": "",
                "last_seen_at": "",
                "sources": [],
                "utm_source": "",
                "utm_medium": "",
                "utm_campaign": "",
                "paid_customer": False,
                "lifetime_value_cents": 0,
                "stripe_session_ids": [],
                "tags": [],
            })
            # Preserve first non-empty name/company/phone we see.
            for f in ("name", "company", "phone"):
                if row[f] and not existing[f]:
                    existing[f] = row[f]
            if row["email"] and not existing["email"]:
                existing["email"] = row["email"]
            # First-touch attribution wins.
            for f in ("utm_source", "utm_medium", "utm_campaign"):
                if row[f] and not existing[f]:
                    existing[f] = row[f]
            # Timestamps.
            seen = row["seen_at"]
            if seen:
                if not existing["first_seen_at"] or seen < existing["first_seen_at"]:
                    existing["first_seen_at"] = seen
                if not existing["last_seen_at"] or seen > existing["last_seen_at"]:
                    existing["last_seen_at"] = seen
            if source_label not in existing["sources"]:
                existing["sources"].append(source_label)
            if row["paid"]:
                existing["paid_customer"] = True
                existing["lifetime_value_cents"] += row["amount_cents"]
            if row["stripe_session_id"] and row["stripe_session_id"] not in existing["stripe_session_ids"]:
                existing["stripe_session_ids"].append(row["stripe_session_id"])
            for t in row["tags"]:
                if t not in existing["tags"]:
                    existing["tags"].append(t)
            rows_extracted += 1

        # Write raw dump.
        raw_path = raw_dir / f"{coll_name}.json"
        raw_path.write_text(
            json.dumps(raw_docs, default=str, ensure_ascii=False, indent=2)
        )
        counts[coll_name] = len(raw_docs)
        print(f"  {coll_name:<34} {len(raw_docs):>5} docs → {rows_extracted} usable rows")

    client.close()
    return contacts, counts


def enrich_with_stripe(contacts: dict[str, dict]) -> int:
    """Optional Stripe customer pull. Adds any customer not already known,
    merges phone/name onto matching contacts. Returns count of Stripe rows seen."""
    api_key = os.environ.get("STRIPE_API_KEY") or os.environ.get("STRIPE_SECRET_KEY")
    if not api_key or not api_key.startswith("sk_"):
        print("  (no valid STRIPE_API_KEY / STRIPE_SECRET_KEY — skipping Stripe pull)")
        return 0
    try:
        import stripe  # type: ignore
    except ImportError:
        print("  (stripe SDK not installed — skipping)")
        return 0
    stripe.api_key = api_key

    seen = 0
    starting_after = None
    while True:
        page = stripe.Customer.list(limit=100, starting_after=starting_after)
        for cust in page.auto_paging_iter():
            seen += 1
            email = _norm_email(cust.email)
            if not email:
                continue
            existing = contacts.setdefault(email, {
                "email": email,
                "phone": "",
                "name": "",
                "company": "",
                "first_seen_at": "",
                "last_seen_at": "",
                "sources": [],
                "utm_source": "",
                "utm_medium": "",
                "utm_campaign": "",
                "paid_customer": False,
                "lifetime_value_cents": 0,
                "stripe_session_ids": [],
                "tags": [],
            })
            existing["paid_customer"] = True
            if cust.name and not existing["name"]:
                existing["name"] = cust.name
            if cust.phone and not existing["phone"]:
                existing["phone"] = cust.phone
            if "stripe-customer" not in existing["sources"]:
                existing["sources"].append("stripe-customer")
            existing.setdefault("stripe_customer_ids", [])
            if cust.id not in existing["stripe_customer_ids"]:
                existing["stripe_customer_ids"].append(cust.id)
            created = _iso(cust.created)
            if created:
                if not existing["first_seen_at"] or created < existing["first_seen_at"]:
                    existing["first_seen_at"] = created
                if not existing["last_seen_at"] or created > existing["last_seen_at"]:
                    existing["last_seen_at"] = created
        # Manual pagination guard (auto_paging_iter above walks all pages).
        break
    return seen


def write_normalized(contacts: dict[str, dict], norm_dir: Path):
    rows = sorted(
        contacts.values(),
        key=lambda r: (not r.get("paid_customer"), r.get("first_seen_at") or ""),
    )

    # JSON — nested-safe.
    (norm_dir / "contacts.json").write_text(
        json.dumps(rows, ensure_ascii=False, indent=2)
    )

    # CSV — flatten list fields with `; ` separator.
    csv_path = norm_dir / "contacts.csv"
    fieldnames = [
        "email", "name", "company", "phone",
        "first_seen_at", "last_seen_at",
        "sources", "utm_source", "utm_medium", "utm_campaign",
        "paid_customer", "lifetime_value_cents",
        "stripe_customer_ids", "stripe_session_ids",
        "tags",
    ]
    with csv_path.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        for r in rows:
            writer.writerow({
                "email": r.get("email", ""),
                "name": r.get("name", ""),
                "company": r.get("company", ""),
                "phone": r.get("phone", ""),
                "first_seen_at": r.get("first_seen_at", ""),
                "last_seen_at": r.get("last_seen_at", ""),
                "sources": "; ".join(r.get("sources", [])),
                "utm_source": r.get("utm_source", ""),
                "utm_medium": r.get("utm_medium", ""),
                "utm_campaign": r.get("utm_campaign", ""),
                "paid_customer": "yes" if r.get("paid_customer") else "no",
                "lifetime_value_cents": r.get("lifetime_value_cents", 0),
                "stripe_customer_ids": "; ".join(r.get("stripe_customer_ids", [])),
                "stripe_session_ids": "; ".join(r.get("stripe_session_ids", [])),
                "tags": "; ".join(r.get("tags", [])),
            })
    return len(rows), csv_path


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="/app/exports", help="Output directory")
    ap.add_argument("--skip-stripe", action="store_true")
    args = ap.parse_args()

    stamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    out_dir = Path(args.out) / f"gigline_export_{stamp}"

    mongo_url = os.environ.get("MONGO_URL")
    db_name = os.environ.get("DB_NAME")
    if not mongo_url or not db_name:
        print("ERROR: MONGO_URL and DB_NAME must be set in environment.")
        sys.exit(1)

    print(f"→ Output: {out_dir}")
    print(f"→ Mongo:  {mongo_url}  db={db_name}\n")
    print("Dumping collections + extracting contact rows…")
    contacts, counts = await dump_and_normalize(mongo_url, db_name, out_dir)

    stripe_seen = 0
    if not args.skip_stripe:
        print("\nMerging Stripe customers…")
        stripe_seen = enrich_with_stripe(contacts)
        print(f"  Stripe customers seen: {stripe_seen}")

    row_count, csv_path = write_normalized(contacts, out_dir / "normalized")

    # Manifest.
    manifest = {
        "exported_at": datetime.now(timezone.utc).isoformat(),
        "raw_collections": counts,
        "stripe_customers_seen": stripe_seen,
        "unique_contacts": row_count,
        "paid_contacts": sum(1 for c in contacts.values() if c.get("paid_customer")),
        "output_dir": str(out_dir),
    }
    (out_dir / "manifest.json").write_text(json.dumps(manifest, indent=2))

    print("\n" + "─" * 60)
    print(f"Unique contacts:  {row_count}")
    print(f"Paid customers:   {manifest['paid_contacts']}")
    print(f"Raw docs total:   {sum(counts.values())}")
    print(f"CSV:              {csv_path}")
    print(f"JSON:             {out_dir / 'normalized' / 'contacts.json'}")
    print(f"Manifest:         {out_dir / 'manifest.json'}")
    print("─" * 60)


if __name__ == "__main__":
    asyncio.run(main())
