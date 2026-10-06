#!/usr/bin/env python3
"""Build the FIE 2026 deck with pictures embedded in the PPTX package.

python-pptx add_picture stores each PNG inside ppt/media and points the
slide relationship at that part. Nothing is linked to a file path.
"""

from __future__ import annotations

import zipfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE, MSO_SHAPE_TYPE
from pptx.enum.text import PP_ALIGN
from pptx.util import Emu, Inches, Pt

ROOT = Path(__file__).resolve().parents[1]
DIAG = ROOT / "diagrams"
SHOT = ROOT / "screenshots"
OUT = ROOT / "fie26-tripathi-embedded.pptx"

SLIDE_W = Inches(13.333333)
SLIDE_H = Inches(7.5)
FONT = "Calibri"
INK = RGBColor(0x14, 0x20, 0x33)
MUTED = RGBColor(0x3E, 0x4C, 0x5E)
BLUE = RGBColor(0x1B, 0x4F, 0x8A)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
PAPER = "F4F7FB"
NAVY = "142033"

LIVE = "https://piaattufts.github.io/llmodyssey/"
GITHUB = "https://github.com/piaattufts/llmodyssey"

EDUCATOR_CROP = SHOT / "07_educator_presentation_crop.png"
TOKEN_CROP = SHOT / "05_token_forge_presentation_crop.png"


def new_deck() -> Presentation:
    deck = Presentation()
    deck.slide_width = SLIDE_W
    deck.slide_height = SLIDE_H
    deck.core_properties.title = "LLM Odyssey — FIE 2026"
    deck.core_properties.author = "Priyamvada Tripathi"
    deck.core_properties.subject = "Work in Progress, Innovative Practice. FIE 2026."
    return deck


def blank(deck: Presentation):
    return deck.slides.add_slide(deck.slide_layouts[6])


def fill_slide(slide, hex_color: str) -> None:
    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = RGBColor.from_string(hex_color)


def notes(slide, text: str) -> None:
    slide.notes_slide.notes_text_frame.text = text


def add_text(slide, text, left, top, width, height, size, *, bold=False, color=INK, align=PP_ALIGN.LEFT, font=FONT):
    box = slide.shapes.add_textbox(left, top, width, height)
    frame = box.text_frame
    frame.word_wrap = True
    frame.auto_size = None
    frame.margin_left = Emu(0)
    frame.margin_right = Emu(0)
    frame.margin_top = Emu(0)
    frame.margin_bottom = Emu(0)
    anchor = frame._txBody.bodyPr
    anchor.set("anchor", "ctr" if align == PP_ALIGN.CENTER else "t")
    lines = text.split("\n")
    for index, line in enumerate(lines):
        paragraph = frame.paragraphs[0] if index == 0 else frame.add_paragraph()
        paragraph.alignment = align
        paragraph.space_before = Pt(0)
        paragraph.space_after = Pt(0)
        run = paragraph.add_run()
        run.text = line
        run.font.size = Pt(size)
        run.font.bold = bold
        run.font.color.rgb = color
        run.font.name = font
    return box


def add_link(slide, label, url, left, top, width, height, size=20):
    box = add_text(slide, label, left, top, width, height, size, bold=True, color=BLUE, align=PP_ALIGN.CENTER)
    run = box.text_frame.paragraphs[0].runs[0]
    run.hyperlink.address = url
    run.font.underline = True
    return box


def place_image(slide, path: Path, left, top, max_w, max_h):
    """Embed a picture. Width and height keep the file's aspect ratio."""
    with Image.open(path) as image:
        aspect = image.width / image.height
    box_aspect = max_w / max_h
    if aspect > box_aspect:
        width = int(max_w)
        height = int(max_w / aspect)
    else:
        height = int(max_h)
        width = int(max_h * aspect)
    x = int(left + (max_w - width) // 2)
    y = int(top + (max_h - height) // 2)
    return slide.shapes.add_picture(str(path), x, y, width=width, height=height)


def _font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    path = (
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
        if bold
        else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
    )
    return ImageFont.truetype(path, size)


def _rounded(draw: ImageDraw.ImageDraw, box, radius, fill) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill)


def make_presentation_crops() -> None:
    """Crops used on the projected slides. Source pixels are not restretched."""
    forge = Image.open(SHOT / "05_token_forge_feedback_annotated.png").convert("RGB")
    # Drop the left navigation and the smaller engineering-takeaway footer so
    # the scenario, choice, result, and feedback fill the slide.
    forge.crop((430, 0, 1920, 790)).save(TOKEN_CROP, optimize=True)
    forge.close()

    educator = Image.open(SHOT / "07_educator.png").convert("RGB")
    # Header plus the first games. Later rows repeat the same columns.
    crop_box = (548, 64, 1616, 560)
    table = educator.crop(crop_box)
    educator.close()
    scale = 2
    table = table.resize((table.width * scale, table.height * scale), Image.Resampling.LANCZOS)
    # Column centers in the original screenshot, mapped into the scaled crop.
    origin_x = crop_box[0]
    def col(x: int) -> int:
        return int((x - origin_x) * scale)

    students_learn = col(1006)
    status = col(1268)
    bloom_time = col(1386)
    label_h = 150
    canvas = Image.new("RGB", (table.width, table.height + label_h), (14, 18, 32))
    canvas.paste(table, (0, label_h))
    draw = ImageDraw.Draw(canvas)
    font = _font(40, bold=True)
    # Status and Bloom sit in narrow columns, so those labels extend away from
    # each other. The arrow still lands on the column.
    labels = [
        (students_learn, "Learning objectives", 360, 1040),
        (status, "Current game status", 1060, 1540),
        (bloom_time, "Bloom + estimated time", 1560, canvas.width - 16),
    ]
    for center, text, left, right in labels:
        top = 26
        _rounded(draw, (left, top, right, top + 76), 18, (255, 255, 255))
        text_w = draw.textlength(text, font=font)
        text_x = left + ((right - left) - text_w) / 2
        draw.text((text_x, top + 14), text, font=font, fill=(27, 79, 138))
        tip_x = max(left + 28, min(center, right - 28))
        draw.polygon([(tip_x - 16, top + 76), (tip_x + 16, top + 76), (tip_x, label_h - 6)], fill=(255, 255, 255))
    canvas.save(EDUCATOR_CROP, optimize=True)


def slide_title(deck: Presentation):
    slide = blank(deck)
    fill_slide(slide, "FFFFFF")
    bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(0.22), SLIDE_H)
    bar.fill.solid()
    bar.fill.fore_color.rgb = BLUE
    bar.line.fill.background()
    add_text(
        slide,
        "LLM Odyssey: A Game-Based Platform for Teaching LLM Engineering Concepts",
        Inches(0.7),
        Inches(1.55),
        Inches(12.1),
        Inches(2.1),
        36,
        bold=True,
    )
    add_text(
        slide,
        "Priyamvada Tripathi\nTufts Institute for Artificial Intelligence\nTufts University",
        Inches(0.7),
        Inches(4.0),
        Inches(11.5),
        Inches(1.6),
        24,
    )
    add_text(
        slide,
        "Work in Progress, Innovative Practice  ·  FIE 2026, Paphos, Cyprus",
        Inches(0.7),
        Inches(6.15),
        Inches(11.5),
        Inches(0.6),
        20,
        color=MUTED,
    )
    notes(
        slide,
        "12 minutes. One idea per slide. Token Forge is the reference implementation. "
        "Games 2–13 are playable prototypes. Do not claim a measured learning gain. "
        "Live site and repository are on the closing slide.",
    )


def slide_problem(deck: Presentation):
    slide = blank(deck)
    fill_slide(slide, "FFFFFF")
    add_text(
        slide,
        "CS graduates get little hands-on\nLLM engineering practice.",
        Inches(0.6),
        Inches(0.4),
        Inches(12.1),
        Inches(1.7),
        36,
        bold=True,
    )
    add_text(
        slide,
        "Practitioners name four competencies that programs do not consistently develop.",
        Inches(0.6),
        Inches(2.25),
        Inches(12.1),
        Inches(0.7),
        24,
    )
    items = ["Prompt engineering", "Retrieval-augmented generation", "Fine-tuning", "Production deployment"]
    for index, item in enumerate(items):
        left = Inches(0.6) + (index % 2) * Inches(6.2)
        top = Inches(3.25) + (index // 2) * Inches(1.35)
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(5.9), Inches(1.15))
        card.fill.solid()
        card.fill.fore_color.rgb = RGBColor.from_string("E7F1FB")
        card.line.color.rgb = BLUE
        card.line.width = Pt(2)
        add_text(slide, item, left + Inches(0.3), top + Inches(0.25), Inches(5.3), Inches(0.7), 26, bold=True)
    add_text(
        slide,
        "Bommasani et al., 2022.  Huyen, Designing Machine Learning Systems, 2022.",
        Inches(0.6),
        Inches(6.7),
        Inches(12.1),
        Inches(0.45),
        18,
        color=MUTED,
    )
    notes(
        slide,
        "The gap is practice, not the absence of ML theory. These four competencies frame the curriculum. "
        "Do not claim Odyssey has already closed the gap.",
    )


def slide_gap(deck: Presentation):
    slide = blank(deck)
    fill_slide(slide, "FFFFFF")
    add_text(
        slide,
        "Many existing tools focus on individual concepts.",
        Inches(0.55),
        Inches(0.35),
        Inches(12.2),
        Inches(0.7),
        32,
        bold=True,
    )
    add_text(
        slide,
        "LLM Odyssey integrates them into a scaffolded learning pathway.",
        Inches(0.55),
        Inches(1.1),
        Inches(12.2),
        Inches(0.7),
        32,
        bold=True,
        color=BLUE,
    )
    columns = [
        (Inches(0.55), "What exists", "E8E8E8", MUTED, ["OpenAI Playground", "Hugging Face Spaces", "Lectures and textbook examples"]),
        (Inches(6.9), "What Odyssey adds", "E7F1FB", BLUE, ["Progressive difficulty", "Pedagogical scaffolding", "A path from tokenization to a design brief"]),
    ]
    for left, heading, fill, color, items in columns:
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(2.15), Inches(5.85), Inches(4.55))
        card.fill.solid()
        card.fill.fore_color.rgb = RGBColor.from_string(fill)
        card.line.fill.background()
        add_text(slide, heading, left + Inches(0.35), Inches(2.35), Inches(5.2), Inches(0.55), 26, bold=True, color=color)
        for index, item in enumerate(items):
            add_text(slide, item, left + Inches(0.35), Inches(3.15) + Inches(1.0) * index, Inches(5.2), Inches(0.8), 24, bold=True)
    notes(
        slide,
        "Odyssey does not replace Playground or Spaces. It sequences decisions from a single mechanism to a constrained design.",
    )


def titled_picture(deck: Presentation, title: str, image: Path, *, caption: str | None = None, bg: str = PAPER, title_color=INK, dark=False):
    slide = blank(deck)
    fill_slide(slide, bg)
    color = WHITE if dark else title_color
    add_text(slide, title, Inches(0.4), Inches(0.14), Inches(12.55), Inches(0.7), 26, bold=True, color=color)
    caption_h = Inches(0.48) if caption else Inches(0.12)
    top = Inches(0.9)
    place_image(slide, image, Inches(0.25), top, Inches(12.83), SLIDE_H - top - caption_h)
    if caption:
        add_text(
            slide,
            caption,
            Inches(0.4),
            Inches(6.95),
            Inches(12.55),
            Inches(0.42),
            20,
            bold=True,
            color=WHITE if dark else INK,
            align=PP_ALIGN.CENTER,
        )
    return slide


def slide_curriculum(deck: Presentation):
    slide = titled_picture(
        deck,
        "13 games move from foundations to systems to synthesis",
        DIAG / "01_curriculum_tiers.png",
        caption="Later tiers open at a 70% instructional mastery benchmark. That is not a completion threshold and not professional expertise.",
    )
    notes(
        slide,
        "Token Forge is the reference implementation. Games 2–13 are playable prototypes. "
        "Later tiers open after enough games meet the 70% instructional mastery benchmark. "
        "Systems Forge opens after 4 Cognitive Core games. Foundry Arena opens after 3 Systems Forge games. "
        "Say: Foundations, then systems, then synthesis.",
    )


def slide_pedagogy(deck: Presentation):
    slide = titled_picture(
        deck,
        "Learning-science principles become game mechanics",
        DIAG / "04_pedagogy_mapping.png",
    )
    notes(
        slide,
        "Five strategies: immediate feedback, scaffolded hints, progressive difficulty, worked examples, authentic context. "
        "Sources on the diagram: Black and Wiliam, Vygotsky, Sweller, Bloom. "
        "A hint costs one point. The design supports practice. It is not a measured learning gain.",
    )


def slide_one_game(deck: Presentation):
    slide = titled_picture(
        deck,
        "Students make an engineering decision — and immediately see why it mattered",
        TOKEN_CROP,
        dark=True,
        bg=NAVY,
    )
    notes(
        slide,
        "Token Forge, one decision, then the reason. Reference implementation. "
        "The round uses the shipped signature def refund_total(items: list[str]) -> int:. "
        "SentencePiece is selected. The pieces are authored examples. "
        "Token count, efficiency, and the exercise cost are arithmetic on those pieces, not a live commercial tokenizer. "
        "Callouts: scenario pieces, count and cost, learner choice, immediate feedback. "
        "Round score is 10 of 10 with no hint penalty. Research mode is off by default. No paid model API is required.",
    )


def slide_loop(deck: Presentation):
    slide = titled_picture(
        deck,
        "Each game follows the same scaffolded learning cycle",
        DIAG / "03_game_learning_loop.png",
    )
    notes(
        slide,
        "Orientation, decision, feedback, hint or continue, next round. "
        "The concept guide reopens without resetting the round or the score. "
        "Mastery check is the 70% instructional mastery benchmark, not expertise. "
        "Self-evaluation does not change the score. Transfer is explaining a new case.",
    )


def slide_educator(deck: Presentation):
    slide = titled_picture(
        deck,
        "Educators can inspect the instructional design before assigning a game",
        EDUCATOR_CROP,
        dark=True,
        bg=NAVY,
    )
    notes(
        slide,
        "The crop shows what students learn, status, minutes, and Bloom. "
        "Token Forge is Reference. The other games shown are playable prototypes. "
        "The 70% column is the instructional mastery benchmark, not a completion threshold and not professional expertise. "
        "A game title opens the student view. No account and no paid model API are required. "
        "Research mode is off unless an educator turns it on.",
    )


def slide_evaluation(deck: Presentation):
    slide = titled_picture(
        deck,
        "The next question is empirical: does Odyssey improve learning?",
        DIAG / "11_evaluation_flow.png",
        caption="Learning effectiveness has not yet been established.",
    )
    notes(
        slide,
        "This is a documented protocol for a future study. Learning effectiveness is not established. "
        "Pre and post are optional local 10-item checks. Logs stay in the browser unless research mode is turned on. "
        "Research mode is off by default. The study survey from the original prototype is not in this app. "
        "Interviews are planned and not shipped. "
        "If asked about faculty review: two reviewers gave feasibility and face-validity feedback during Winter 2026, "
        "while the author was at Durham College. That review is not proof of learning. Durham College is not the current affiliation.",
    )


def slide_open_source(deck: Presentation):
    slide = titled_picture(
        deck,
        "From working prototype to reusable open-source teaching platform",
        DIAG / "12_platform_evolution.png",
        caption=" ",
    )
    # Cover the blank caption line with the two URLs.
    bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(6.72), SLIDE_W, Inches(0.78))
    bar.fill.solid()
    bar.fill.fore_color.rgb = WHITE
    bar.line.fill.background()
    add_link(slide, LIVE, LIVE, Inches(0.25), Inches(6.84), Inches(6.4), Inches(0.5), 18)
    add_link(slide, GITHUB, GITHUB, Inches(6.7), Inches(6.84), Inches(6.35), Inches(0.5), 18)
    notes(
        slide,
        "Stop the talk on this slide. The prototype supplied the curriculum. "
        "This release is React and TypeScript, local-first, on GitHub Pages, with no paid API. "
        "Token Forge uses authored, precomputed educational segmentations. "
        "No archived Base44 screenshots are in the repository. "
        "Contact: pia.tripathi@tufts.edu. Remaining slides are backup.",
    )


def backup_label(slide, title: str):
    fill_slide(slide, "FFFFFF")
    add_text(slide, title, Inches(0.45), Inches(0.28), Inches(12.4), Inches(0.7), 30, bold=True)


def slide_backup_performance(deck: Presentation):
    slide = blank(deck)
    backup_label(slide, "Backup · Earlier deployment performance targets")
    metrics = [
        ("< 16 ms", "interaction response"),
        ("< 100 ms", "page load"),
        ("60 fps", "animations"),
        ("0", "availability incidents"),
    ]
    for index, (value, label) in enumerate(metrics):
        left = Inches(0.45) + index * Inches(3.2)
        add_text(slide, value, left, Inches(1.7), Inches(3.0), Inches(1.1), 40, bold=True, color=BLUE, align=PP_ALIGN.CENTER)
        add_text(slide, label, left, Inches(2.9), Inches(3.0), Inches(0.8), 22, align=PP_ALIGN.CENTER)
    add_text(
        slide,
        "Game logic runs in the browser, so play does not wait on a server round trip.",
        Inches(0.6),
        Inches(4.2),
        Inches(12.1),
        Inches(0.7),
        22,
    )
    add_text(
        slide,
        "From an earlier deployment report. Not a new benchmark of this public release, and not a learning result.",
        Inches(0.6),
        Inches(5.15),
        Inches(12.1),
        Inches(1.2),
        22,
    )
    notes(
        slide,
        "Only if asked about speed. Do not present these numbers as evidence that students learned.",
    )


def slide_backup_shots(deck: Presentation):
    slide = blank(deck)
    fill_slide(slide, NAVY)
    add_text(
        slide,
        "Backup · Current open-source app",
        Inches(0.4),
        Inches(0.18),
        Inches(12.5),
        Inches(0.5),
        26,
        bold=True,
        color=WHITE,
    )
    place_image(slide, SHOT / "01_home.png", Inches(0.3), Inches(0.85), Inches(6.25), Inches(5.15))
    place_image(slide, SHOT / "04_token_forge_gameplay.png", Inches(6.75), Inches(0.85), Inches(6.25), Inches(5.15))
    add_text(slide, "Homepage", Inches(0.3), Inches(6.15), Inches(6.25), Inches(0.45), 20, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    add_text(
        slide,
        "Token Forge, reference game",
        Inches(6.75),
        Inches(6.15),
        Inches(6.25),
        Inches(0.45),
        20,
        bold=True,
        color=WHITE,
        align=PP_ALIGN.CENTER,
    )
    add_text(
        slide,
        "13 games · 3 tiers · no paid API required for core gameplay",
        Inches(0.4),
        Inches(6.7),
        Inches(12.5),
        Inches(0.5),
        20,
        color=WHITE,
        align=PP_ALIGN.CENTER,
    )
    notes(
        slide,
        "Homepage states 13 games, 3 tiers, and no paid API. Gameplay shows the shipped Python signature and four authored rows. "
        "These are the current app, not the original prototype.",
    )


def slide_backup_architecture(deck: Presentation):
    slide = titled_picture(
        deck,
        "Backup · Core gameplay needs no backend and no paid model API",
        DIAG / "07_platform_architecture.png",
    )
    notes(
        slide,
        "Research mode is off by default. The analytics adapter is unused unless research mode and a project URL are set. "
        "The model adapter defaults to a mock. The 13 games do not call it. "
        "Token Forge uses authored, precomputed educational segmentations.",
    )


def slide_backup_faculty(deck: Presentation):
    slide = blank(deck)
    backup_label(slide, "Backup · Faculty feasibility feedback, not a learning result")
    lines = [
        "Two faculty reviewers, Winter 2026.",
        "The author was then at Durham College. That is not the current affiliation.",
        "They confirmed the platform runs.",
        "They named adaptive difficulty as the next priority.",
        "This is face-validity feedback. It is not evidence of learning effectiveness.",
    ]
    for index, line in enumerate(lines):
        add_text(slide, line, Inches(0.6), Inches(1.35) + Inches(0.95) * index, Inches(12.1), Inches(0.8), 26, bold=index == 4)
    notes(
        slide,
        "Use only if asked. N=2. Do not generalize to student learning gains. Current affiliation is Tufts.",
    )


def slide_backup_evolution(deck: Presentation):
    slide = titled_picture(
        deck,
        "Backup · Product history, without unlabeled prototype screenshots",
        DIAG / "12_platform_evolution.png",
        caption="Original Base44 screenshots are not in this package. The current app is the public platform.",
    )
    notes(
        slide,
        "Do not show an unlabeled historical screenshot. No original Base44 captures were archived. "
        "The prototype supplied the curriculum. This release stands alone.",
    )


def build() -> None:
    make_presentation_crops()
    deck = new_deck()
    slide_title(deck)
    slide_problem(deck)
    slide_gap(deck)
    slide_curriculum(deck)
    slide_pedagogy(deck)
    slide_one_game(deck)
    slide_loop(deck)
    slide_educator(deck)
    slide_evaluation(deck)
    slide_open_source(deck)
    slide_backup_performance(deck)
    slide_backup_shots(deck)
    slide_backup_architecture(deck)
    slide_backup_faculty(deck)
    slide_backup_evolution(deck)
    deck.save(OUT)
    print(OUT)


def audit(path: Path) -> None:
    deck = Presentation(str(path))
    problems = []
    print(f"slides {len(deck.slides)}")
    for index, slide in enumerate(deck.slides, 1):
        pictures = 0
        for shape in slide.shapes:
            if shape.shape_type == MSO_SHAPE_TYPE.PICTURE:
                pictures += 1
                aspect = shape.width / shape.height
                with_image_ok = aspect > 0.4
                if not with_image_ok:
                    problems.append(f"slide {index} odd picture aspect {aspect:.3f}")
            if shape.has_text_frame:
                for paragraph in shape.text_frame.paragraphs:
                    for run in paragraph.runs:
                        if not run.text.strip():
                            continue
                        size = run.font.size.pt if run.font.size else None
                        if size is None or size < 18:
                            problems.append(f"slide {index} text {size}pt: {run.text[:80]!r}")
        print(f"Slide {index}: images = {pictures}")

    package = zipfile.ZipFile(path)
    media = [name for name in package.namelist() if name.startswith("ppt/media/")]
    print(f"ppt/media file count: {len(media)}")
    for name in media:
        info = package.getinfo(name)
        print(f"  {name} {info.file_size}")
    external_images = 0
    for name in package.namelist():
        if not name.startswith("ppt/slides/_rels/"):
            continue
        text = package.read(name).decode()
        for chunk in text.split("<Relationship "):
            if "relationships/image" not in chunk:
                continue
            if 'TargetMode="External"' in chunk:
                external_images += 1
                problems.append(f"external image relationship in {name}")
            if 'Target="../media/' not in chunk:
                problems.append(f"image relationship is not inside the package: {name}")
    print(f"external image relationships: {external_images}")
    if problems:
        print("AUDIT PROBLEMS")
        for problem in problems:
            print(problem)
        raise SystemExit(1)
    print("audit ok")


if __name__ == "__main__":
    build()
    audit(OUT)
