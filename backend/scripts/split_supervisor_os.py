"""Split the complete 20-page GigLine Supervisor Safety OS PDF into 17 individual
per-document PDFs. Idempotent — safe to re-run whenever the master v1 file changes.

Master source: /app/backend/kit_files/GigLine_Supervisor_Safety_OS_v1.pdf
Output dir:    /app/backend/kit_files/os_v1_individual/

Page map (1-indexed, matches the master file):
    p1  Cover                            (system-wide, only in master)
    p2  Important Notice                 (system-wide, only in master)
    p3  SS-01  Start Here                → SS-01_Start_Here.pdf
    p4  Table of Contents                (system-wide, only in master)
    p5  SS-02  30-Day Action Checklist   → SS-02_30_Day_Action_Checklist.pdf
    p6  SS-03A Chemical Inventory Log — Example  → SS-03A_Chemical_Inventory_Log_Example.pdf
    p7  SS-03B Chemical Inventory Log — Blank    → SS-03B_Chemical_Inventory_Log_Blank.pdf
    p8  SS-04A SDS Index — Example
    p9  SS-04B SDS Index — Blank
    p10 SS-05  Written HazCom Program
    p11 SS-06A Monthly Safety Inspection Checklist — Example
    p12 SS-06B Monthly Safety Inspection Checklist — Blank
    p13 SS-07A Corrective Action Log — Example
    p14 SS-07B Corrective Action Log — Blank
    p15 SS-08  OSHA Coverage Map
    p16 SS-09A Employee HazCom Toolbox Talk + Attendance
    p17 SS-09B Employee HazCom Knowledge Check
    p18 SS-10  Emergency Response / One Phone Call Card
    p19 SS-11  90-Day Implementation Roadmap
    p20 SS-12  Next Step / Book a GigLine Review
"""

from pathlib import Path
import fitz

SRC = Path("/app/backend/kit_files/GigLine_Supervisor_Safety_OS_v1.pdf")
OUT_DIR = Path("/app/backend/kit_files/os_v1_individual")

# (page_index_0based, output_filename) — page indices are ZERO-based.
SPLITS = [
    (2,  "SS-01_Start_Here.pdf"),
    (4,  "SS-02_30_Day_Action_Checklist.pdf"),
    (5,  "SS-03A_Chemical_Inventory_Log_Example.pdf"),
    (6,  "SS-03B_Chemical_Inventory_Log_Blank.pdf"),
    (7,  "SS-04A_SDS_Index_Example.pdf"),
    (8,  "SS-04B_SDS_Index_Blank.pdf"),
    (9,  "SS-05_Written_HazCom_Program.pdf"),
    (10, "SS-06A_Monthly_Safety_Inspection_Example.pdf"),
    (11, "SS-06B_Monthly_Safety_Inspection_Blank.pdf"),
    (12, "SS-07A_Corrective_Action_Log_Example.pdf"),
    (13, "SS-07B_Corrective_Action_Log_Blank.pdf"),
    (14, "SS-08_OSHA_Coverage_Map.pdf"),
    (15, "SS-09A_HazCom_Toolbox_Talk.pdf"),
    (16, "SS-09B_HazCom_Knowledge_Check.pdf"),
    (17, "SS-10_Emergency_Response_Card.pdf"),
    (18, "SS-11_90_Day_Implementation_Roadmap.pdf"),
    (19, "SS-12_Next_Step_Book_GigLine_Review.pdf"),
]


def main() -> None:
    if not SRC.is_file():
        raise SystemExit(f"Master PDF not found: {SRC}")
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    master = fitz.open(SRC)
    if master.page_count != 20:
        print(f"WARNING: expected 20 pages, master has {master.page_count}")

    for page_idx, filename in SPLITS:
        out_path = OUT_DIR / filename
        single = fitz.open()
        single.insert_pdf(master, from_page=page_idx, to_page=page_idx)
        single.save(str(out_path), deflate=True, garbage=3)
        single.close()
        first_line = master[page_idx].get_text().split("\n", 1)[0][:60]
        size_kb = out_path.stat().st_size / 1024
        print(f"  {filename:52s}  ({size_kb:5.1f} KB)  — {first_line}")

    master.close()
    print(f"\nDone. {len(SPLITS)} individual PDFs in {OUT_DIR}")


if __name__ == "__main__":
    main()
