"""Generate three editorial 16:9 hero photos in parallel via Nano Banana.

Outputs:
    /app/frontend/public/ongoing-support-hero.jpg   (plant manager + tablet)
    /app/frontend/public/assets/kits/incident/incident-editorial-hero.jpg
    /app/frontend/public/assets/kits/new-hire/new-hire-editorial-hero.jpg

Run: python3 /app/scripts/gen_hero_batch.py
"""
import asyncio
import base64
import os

from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv("/app/backend/.env")
API_KEY = os.getenv("EMERGENT_LLM_KEY")
MODEL = "gemini-3.1-flash-image-preview"

BASE_STYLE = (
    "Photorealistic 16:9 editorial photograph for an OSHA compliance consulting website. "
    "Warm, natural documentary light (not staged, not stock-photo lit). Realistic small "
    "American manufacturing shop environment. Muted industrial palette (steel gray, warm "
    "concrete, safety yellow accents, navy blues). Shallow depth of field with the subject "
    "sharp and the background softly out of focus. Subjects wear real, worn work clothes "
    "(not fresh clothing, not clean hardhats posed forward). No sales-brochure staging. "
    "No stock-photo smiles. Composition should feel candid, mid-action, honest. Full 16:9 "
    "landscape frame. No text, no logos, no watermarks. "
)

PROMPTS = {
    "ongoing_support": {
        "out": "/app/frontend/public/ongoing-support-hero.jpg",
        "prompt": BASE_STYLE + (
            "SUBJECT: A plant manager in mid-40s standing on a small manufacturing shop floor "
            "reviewing a black rugged tablet held in both hands. The tablet screen shows a "
            "corrective-action tracker: a table of rows with status pills, but the pixels are "
            "soft, no readable text needed. The manager wears a navy work polo and jeans, sleeves "
            "slightly rolled, safety glasses pushed up on their head, a worn ID lanyard around "
            "the neck. Their expression is focused and slightly serious, not smiling, actively "
            "problem-solving. BACKGROUND: A press brake and orderly steel racking softly visible "
            "12 feet behind them, out of focus but recognizably shop-floor. Overhead fluorescent "
            "shop lighting mixed with warm daylight from a bay door camera-left. Yellow-and-black "
            "aisle markings visible on the concrete floor. FRAMING: Waist-up composition, subject "
            "positioned camera-right at rule-of-thirds, negative space to the left for text overlay. "
            "Slightly elevated eye level looking gently down at the tablet in their hands."
        ),
    },
    "incident_to_correction": {
        "out": "/app/frontend/public/assets/kits/incident/incident-editorial-hero.jpg",
        "prompt": BASE_STYLE + (
            "SUBJECT: An overhead 3/4 view of two hands, one older with a plaid rolled sleeve, one "
            "younger in a black work sleeve, both writing on and pointing at a laminated Corrective "
            "Action Tracker document on a scarred wooden workbench. Beside the tracker: a black "
            "ballpoint pen, a coffee mug leaving a faint ring, a small yellow safety flashlight, and "
            "a partially open black three-ring binder with printed dividers labeled visibly but out "
            "of focus (do not render legible text, just the shape of divider tabs). One hand holds "
            "the pen mid-mark, capturing action mid-correction. BACKGROUND: A racking system and "
            "grinding-station silhouette softly out of focus in the upper corner. Warm overhead "
            "task light coming from camera-left casting soft shadows. FRAMING: Top-down at a 20-degree "
            "tilt so the tracker is the hero. Empty space on the right side for headline overlay. "
            "16:9 landscape. Feels investigative, methodical, honest."
        ),
    },
    "new_hire": {
        "out": "/app/frontend/public/assets/kits/new-hire/new-hire-editorial-hero.jpg",
        "prompt": BASE_STYLE + (
            "SUBJECT: A supervisor in their 50s (short salt-and-pepper hair, no smile, focused) "
            "handing a clipboard with a signed New Hire Orientation Checklist to a nervous new "
            "employee in their 20s. Both wear safety glasses. The new employee wears a brand-new "
            "high-vis vest and holds a small stack of paperwork under their arm. The supervisor is "
            "pointing to a line on the clipboard with a work-worn hand. Neither person smiles for "
            "the camera, this is real, first-day, procedural. BACKGROUND: A yellow-and-black-striped "
            "safety border painted on the concrete floor separates a work zone from a walking zone, "
            "softly visible under their feet. A pegboard of PPE (goggles, gloves, ear plugs) blurred "
            "12 feet behind them. Small US flag or American manufacturing-shop feel in the far "
            "background, understated. FRAMING: Waist-up two-shot, subjects in center-left, negative "
            "space on the right for text overlay. Warm daylight from a shop bay door slightly behind "
            "camera-right creating soft rim light on both figures. 16:9 landscape composition."
        ),
    },
}

for spec in PROMPTS.values():
    os.makedirs(os.path.dirname(spec["out"]), exist_ok=True)


async def gen(key: str, spec: dict) -> None:
    chat = LlmChat(
        api_key=API_KEY,
        session_id=f"gl-hero-{key}",
        system_message=(
            "You generate editorial photographic images for a small US manufacturing safety "
            "consultancy website. Photorealistic. Documentary. No staged marketing feel."
        ),
    )
    chat.with_model("gemini", MODEL).with_params(modalities=["image", "text"])
    try:
        _, images = await chat.send_message_multimodal_response(UserMessage(text=spec["prompt"]))
    except Exception as e:
        print(f"[{key}] ERROR: {e}")
        return
    if not images:
        print(f"[{key}] NO IMAGE returned")
        return
    with open(spec["out"], "wb") as f:
        f.write(base64.b64decode(images[0]["data"]))
    size_kb = os.path.getsize(spec["out"]) // 1024
    print(f"[{key}] saved -> {spec['out']} ({size_kb} KB)")


async def main() -> None:
    await asyncio.gather(*(gen(k, s) for k, s in PROMPTS.items()))


if __name__ == "__main__":
    asyncio.run(main())
