"""Annotate the Token Forge feedback shot and export slide crops.

Wide files keep the 1920×1080 viewport. Panel files crop the main column
(sidebar removed) without scaling.
"""

from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path("docs/presentation/screenshots")
FONT = ImageFont.truetype("/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf", 28)
INK = (20, 32, 51)
PAPER = (244, 247, 251)
BLUE = (27, 79, 138)

STRONG = [
    "01_home",
    "03_token_forge_orientation",
    "04_token_forge_gameplay",
    "05_token_forge_feedback",
    "07_educator",
    "09_demo",
    "10_systems_forge",
    "11_foundry",
]


def rounded(draw: ImageDraw.ImageDraw, box, radius, fill):
    draw.rounded_rectangle(box, radius=radius, fill=fill)


def annotate() -> None:
    source = ROOT / "05_token_forge_feedback.png"
    image = Image.open(source).convert("RGB")
    draw = ImageDraw.Draw(image)
    # Anchors measured on the 1920×1080 feedback viewport.
    # Muted body text is too low-contrast for reliable OCR, so these stay fixed.
    labels = [
        (1, "Scenario pieces", (1500, 40), 24),
        (2, "Count and cost", (1500, 178), 150),
        (3, "Learner choice", (1500, 448), 430),
        (4, "Immediate feedback", (1500, 640), 600),
    ]
    for number, label, target, y in labels:
        tw = int(draw.textlength(label, font=FONT))
        box_w = tw + 78
        box_h = 56
        x = 1920 - box_w - 24
        rounded(draw, (x, y, x + box_w, y + box_h), 14, PAPER)
        draw.ellipse((x + 8, y + 8, x + 48, y + 48), fill=BLUE)
        draw.text((x + 20, y + 10), str(number), font=FONT, fill=PAPER)
        draw.text((x + 60, y + 12), label, font=FONT, fill=INK)
        draw.line((target[0], target[1], x, y + box_h // 2), fill=PAPER, width=5)
    image.save(ROOT / "05_token_forge_feedback_annotated.png")


def crops() -> None:
    for name in STRONG:
        source = ROOT / f"{name}.png"
        shutil.copyfile(source, ROOT / f"{name}_wide.png")
        image = Image.open(source)
        # Main column only. 16rem sidebar at this viewport is 256px.
        # Content is max-w-5xl and centered in the remaining width.
        panel = image.crop((520, 0, 1680, image.height))
        panel.save(ROOT / f"{name}_panel.png")


def verify() -> None:
    for path in sorted(ROOT.glob("*.png")):
        image = Image.open(path)
        image.load()
        extrema = image.convert("L").getextrema()
        if extrema[0] == extrema[1]:
            raise SystemExit(f"blank {path}")
        print(f"{path.name} {image.size[0]}x{image.size[1]}")


if __name__ == "__main__":
    annotate()
    crops()
    verify()
