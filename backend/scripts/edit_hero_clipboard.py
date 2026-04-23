"""
One-shot script: edit the hero image using Gemini Nano Banana to replace the
generic 'LOTO Compliance Review' clipboard content with the real GigLine
walkthrough checklist title and sections.

Run once:  python3 /app/backend/scripts/edit_hero_clipboard.py
"""

import asyncio
import os
import base64
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent

load_dotenv()

SRC_IMAGE = "/tmp/vince-orig.png"  # the 2MB original hero PNG from earlier
OUT_DIR = "/app/frontend/public"
OUT_RAW = "/tmp/vince-edited-raw.png"

EDIT_PROMPT = """Edit this photograph. The person is holding a clipboard with a paper checklist on it. The clipboard paper currently shows a generic "LOTO Compliance Review" header.

Replace ONLY the content on the clipboard paper with a real GigLine safety walkthrough checklist. The new clipboard content should show:

- Top header: "ON-SITE SAFETY WALKTHROUGH CHECKLIST" (bold, all caps, centered)
- Subtitle line: "GigLine Safety & Compliance"
- A line for "Client: _____________  Date: __________"
- Section heading: "PRE-VISIT" with 3 checkbox items below it (small ☐ marks with short text lines)
- Section heading: "GENERAL FACILITY" with 3-4 checkbox items (e.g., "Walking surfaces clear", "Electrical panels unblocked", "Emergency exits marked")
- Section heading: "MANUFACTURING / SHOP FLOOR" with 2-3 checkbox items visible

Use crisp black printed text on white paper. Keep the layout clean and realistic, like a professional printed safety inspection form.

CRITICAL — preserve everything else exactly as it is:
- The person's hand grip on the clipboard
- The angle, perspective, and folds of the paper
- All background elements (high voltage signs, electrical equipment, facility setting)
- The lighting, shadows, and mood of the photo
- The person's clothing and pose
- The slight motion blur quality

Only the text content on the clipboard paper should change. Every other pixel of the photograph should look identical to the original.
"""


async def main():
    if not os.path.isfile(SRC_IMAGE):
        raise SystemExit(f"Source image not found: {SRC_IMAGE}")

    with open(SRC_IMAGE, "rb") as f:
        image_b64 = base64.b64encode(f.read()).decode("utf-8")

    api_key = os.getenv("EMERGENT_LLM_KEY")
    if not api_key:
        raise SystemExit("EMERGENT_LLM_KEY missing from /app/backend/.env")

    chat = (
        LlmChat(api_key=api_key, session_id="gigline-hero-clipboard-edit",
                system_message="You are an expert photo editor. Make precise edits while preserving photo realism.")
        .with_model("gemini", "gemini-3.1-flash-image-preview")
        .with_params(modalities=["image", "text"])
    )

    msg = UserMessage(text=EDIT_PROMPT, file_contents=[ImageContent(image_b64)])

    print("Calling Gemini Nano Banana… this takes 10-30 seconds.")
    text, images = await chat.send_message_multimodal_response(msg)
    print(f"Text response: {text[:200] if text else '(none)'}")

    if not images:
        raise SystemExit("No image returned from the model.")

    image_bytes = base64.b64decode(images[0]["data"])
    os.makedirs(os.path.dirname(OUT_RAW), exist_ok=True)
    with open(OUT_RAW, "wb") as f:
        f.write(image_bytes)
    print(f"Saved raw edit to {OUT_RAW} ({len(image_bytes)/1024:.1f} KB)")


if __name__ == "__main__":
    asyncio.run(main())
