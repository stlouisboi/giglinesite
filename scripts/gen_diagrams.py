import asyncio, os, base64
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv("/app/backend/.env")
API_KEY = os.getenv("EMERGENT_LLM_KEY")
MODEL = "gemini-3.1-flash-image-preview"

BASE = ("Clean technical illustration diagram for an OSHA compliance training reference. "
        "Minimalist technical-manual style, not photorealistic. Navy line-art on a "
        "solid white background. Yellow safety accents where hazards or key items are called "
        "out. Bold black text labels with dimension arrows where measurements are given. "
        "Sharp, printable, high-contrast. 16:9 landscape composition with the subject centered "
        "and generous white space around it. All text spelled correctly. ")

PROMPTS = {
    "forklift-inspection-points": BASE + (
        "Side-profile diagram of a sit-down counterbalance forklift with 7 numbered callouts "
        "pointing to inspection items around it: 1 TIRES (pointing at front pneumatic tire), "
        "2 FORKS (pointing at fork tips), 3 MAST CHAINS (pointing at vertical lift chains), "
        "4 HYDRAULIC HOSES (pointing at cylinder assembly), 5 SEATBELT (pointing at operator "
        "seat), 6 HORN (pointing at steering column), 7 DATA PLATE (pointing at side of "
        "operator compartment). Numbered yellow circles for each callout. Title text at top "
        "reads 'DAILY PRE-SHIFT FORKLIFT INSPECTION - 29 CFR 1910.178(q)(7)'."
    ),
    "machine-guarding-safe-distance": BASE + (
        "Front-view diagram of a hand approaching a rotating machine hazard point through a "
        "safety guard opening. Show a horizontal dimension arrow between the hand and the "
        "hazard labeled 'SAFE DISTANCE'. Left side: a table of opening size versus safe "
        "distance based on OSHA Table O-10, showing rows: opening 1/4 inch = 1/2 inch min, "
        "3/8 inch = 5/8 inch min, 1/2 inch = 1-1/2 inch min. Title text at top reads "
        "'MACHINE GUARDING SAFE DISTANCE - 29 CFR 1910.212 & TABLE O-10'."
    ),
    "fall-protection-anchor": BASE + (
        "Side-profile diagram of a worker in a full-body harness with a shock-absorbing lanyard "
        "attached to an overhead anchor point on a steel beam. Show 3 labeled elements: "
        "ANCHOR POINT (5,000 lb rated) at top with yellow highlight on the D-ring hook, "
        "SHOCK-ABSORBING LANYARD (label pointing at the pack), D-RING (pointing at the "
        "back of the harness between shoulder blades). Below the worker show a vertical "
        "dimension arrow labeled 'FALL CLEARANCE = 18 ft 6 in' from the anchor to the "
        "ground. Title text at top reads 'FALL PROTECTION SYSTEM - 29 CFR 1926.502'."
    ),
    "confined-space-entry": BASE + (
        "Cross-section side view of a permit-required confined space, showing a vertical "
        "tank/vessel with a top manhole. Inside the tank shows an entrant worker with a "
        "safety harness and retrieval line rising up through the manhole. Above the tank "
        "opening shows an attendant (labeled ATTENDANT) holding the retrieval line and a "
        "clipboard, and a tripod (labeled RETRIEVAL TRIPOD) straddling the manhole. To the "
        "right of the tank, callouts label: ATMOSPHERIC TEST METER (arrow pointing down "
        "into the space), ENTRY PERMIT (yellow-highlighted document), and VENTILATION DUCT "
        "(labeled). Title text at top reads 'PERMIT-REQUIRED CONFINED SPACE ENTRY - 29 CFR 1910.146'."
    ),
    "loto-isolation-points": BASE + (
        "Side-view diagram of an industrial machine with three types of energy isolation "
        "points clearly labeled and shown locked out: 1) ELECTRICAL DISCONNECT SWITCH on the "
        "left, with a red padlock and yellow DANGER tag hanging from the hasp, arrow labeled "
        "'ELECTRICAL'. 2) PNEUMATIC AIR VALVE at the top with a red padlock, arrow labeled "
        "'PNEUMATIC'. 3) HYDRAULIC SHUT-OFF VALVE at the bottom right with a red padlock, "
        "arrow labeled 'HYDRAULIC'. Show all three padlocks in bright red with yellow tags. "
        "Title text at top reads 'MACHINE-SPECIFIC LOCKOUT/TAGOUT - 29 CFR 1910.147'."
    ),
}

OUT_DIR = "/app/frontend/public/assets/field-notes"
os.makedirs(OUT_DIR, exist_ok=True)

async def gen(key, prompt):
    chat = LlmChat(api_key=API_KEY, session_id=f"gl-diag-{key}",
                   system_message="You generate clean technical training diagrams for OSHA compliance.")
    chat.with_model("gemini", MODEL).with_params(modalities=["image", "text"])
    _, images = await chat.send_message_multimodal_response(UserMessage(text=prompt))
    if not images:
        print(f"[{key}] NO IMAGE"); return
    out = f"{OUT_DIR}/{key}-diagram.png"
    with open(out, "wb") as f:
        f.write(base64.b64decode(images[0]["data"]))
    print(f"[{key}] saved")

async def main():
    await asyncio.gather(*(gen(k, p) for k, p in PROMPTS.items()))

asyncio.run(main())
