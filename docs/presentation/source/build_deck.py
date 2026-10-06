#!/usr/bin/env python3
"""Build the 10-slide FIE 2026 deck plus backup slides.

Diagram and screenshot files are 1920×1080. They are placed at their own
aspect ratio. Diagram slides are full-bleed so the type stays at the size
it was drawn for.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN
from pptx.util import Emu, Inches, Pt

ROOT = Path(__file__).resolve().parents[1]
DIAG = ROOT / "diagrams"
SHOT = ROOT / "screenshots"
OUT = ROOT / "fie26-tripathi.pptx"

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


def add_link(slide, label, url, left, top, width, height, size=22):
    box = add_text(slide, label, left, top, width, height, size, bold=True, color=BLUE, align=PP_ALIGN.CENTER)
    run = box.text_frame.paragraphs[0].runs[0]
    run.hyperlink.address = url
    run.font.underline = True
    return box


def place_image(slide, path: Path, left, top, max_w, max_h):
    with Image.open(path) as image:
        aspect = image.width / image.height
    box_aspect = max_w / max_h
    if aspect > box_aspect:
        width = max_w
        height = int(max_w / aspect)
    else:
        height = max_h
        width = int(max_h * aspect)
    x = left + (max_w - width) // 2
    y = top + (max_h - height) // 2
    shape = slide.shapes.add_picture(str(path), x, y, width=width, height=height)
    return shape


def full_bleed(slide, path: Path):
    return place_image(slide, path, 0, 0, SLIDE_W, SLIDE_H)


def slide_title(deck: Presentation):
    slide = blank(deck)
    fill_slide(slide, "FFFFFF")
    bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(0.22), SLIDE_H)
    bar.fill.solid()
    bar.fill.fore_color.rgb = BLUE
    bar.line.fill.background()
    add_text(
        slide,
        "LLM Odyssey",
        Inches(0.7),
        Inches(1.35),
        Inches(12),
        Inches(0.7),
        28,
        bold=True,
        color=BLUE,
    )
    add_text(
        slide,
        "A game-based platform for teaching\nLLM engineering concepts",
        Inches(0.7),
        Inches(2.15),
        Inches(12),
        Inches(1.8),
        40,
        bold=True,
    )
    add_text(
        slide,
        "Priyamvada Tripathi\nTufts Institute for Artificial Intelligence\nTufts University",
        Inches(0.7),
        Inches(4.35),
        Inches(11),
        Inches(1.5),
        22,
    )
    add_text(
        slide,
        "Work in Progress, Innovative Practice\nFIE 2026, Paphos, Cyprus",
        Inches(0.7),
        Inches(6.15),
        Inches(11),
        Inches(0.9),
        20,
        color=MUTED,
    )
    notes(
        slide,
        "12 minutes. One idea per slide. Token Forge is the reference implementation. "
        "Games 2–13 are playable prototypes. Do not claim a measured learning gain. "
        "Live site: " + LIVE + " Code: " + GITHUB,
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
        "The gap is practice, not the absence of ML theory. These four competencies are the ones "
        "the work-in-progress paper uses to frame the curriculum. Do not claim Odyssey has already closed the gap.",
    )


def slide_gap(deck: Presentation):
    slide = blank(deck)
    fill_slide(slide, "FFFFFF")
    add_text(
        slide,
        "Tools are fragmented.\nOdyssey is one scaffolded pathway.",
        Inches(0.55),
        Inches(0.35),
        Inches(12.2),
        Inches(1.55),
        36,
        bold=True,
    )
    columns = [
        (Inches(0.55), "What exists", "E8E8E8", MUTED, ["OpenAI Playground", "Hugging Face Spaces", "Lectures and textbook examples"]),
        (Inches(6.9), "What Odyssey adds", "E7F1FB", BLUE, ["Progressive difficulty", "Pedagogical scaffolding", "A path from tokenization to a design brief"]),
    ]
    for left, heading, fill, color, items in columns:
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(2.2), Inches(5.85), Inches(4.6))
        card.fill.solid()
        card.fill.fore_color.rgb = RGBColor.from_string(fill)
        card.line.fill.background()
        add_text(slide, heading, left + Inches(0.35), Inches(2.4), Inches(5.2), Inches(0.6), 28, bold=True, color=color)
        for index, item in enumerate(items):
            add_text(slide, item, left + Inches(0.35), Inches(3.3) + Inches(1.0) * index, Inches(5.2), Inches(0.8), 24, bold=True)
    notes(
        slide,
        "Name the fragmentation, then the pathway. Odyssey does not replace Playground or Spaces. "
        "It sequences decisions from a single mechanism to a constrained design.",
    )


def slide_curriculum(deck: Presentation):
    slide = blank(deck)
    fill_slide(slide, PAPER)
    place_image(slide, DIAG / "01_curriculum_tiers.png", Inches(0.35), Inches(0.15), Inches(12.63), Inches(6.55))
    add_text(
        slide,
        "Later tiers open at a 70% instructional mastery benchmark.",
        Inches(0.4),
        Inches(6.85),
        Inches(12.5),
        Inches(0.45),
        20,
        bold=True,
        align=PP_ALIGN.CENTER,
    )
    notes(
        slide,
        "Token Forge is the reference implementation. Games 2–13 are playable prototypes. "
        "Later tiers open after enough games meet the 70% instructional mastery benchmark. "
        "That benchmark is not a completion percentage and not professional expertise. "
        "Systems Forge opens after 4 Cognitive Core games. Foundry Arena opens after 3 Systems Forge games. "
        "Say: Foundations, then systems, then synthesis.",
    )


def slide_pedagogy(deck: Presentation):
    slide = blank(deck)
    fill_slide(slide, PAPER)
    full_bleed(slide, DIAG / "04_pedagogy_mapping.png")
    notes(
        slide,
        "Five strategies: immediate feedback, scaffolded hints, progressive difficulty, worked examples, authentic context. "
        "Sources on the diagram: Black and Wiliam, Vygotsky, Sweller, Bloom. "
        "A hint costs one point. The design supports practice. It is not a measured learning gain.",
    )


def slide_one_game(deck: Presentation):
    slide = blank(deck)
    fill_slide(slide, NAVY)
    # Full-bleed keeps the callout labels as large as the 16:9 capture allows.
    full_bleed(slide, SHOT / "05_token_forge_feedback_annotated.png")
    notes(
        slide,
        "Say: Token Forge, one decision, then the reason. Reference implementation. The round uses the shipped signature def refund_total(items: list[str]) -> int:. "
        "Do not say import numpy. SentencePiece is selected. The pieces are authored examples. "
        "Token count, efficiency, and the exercise cost are arithmetic on those pieces, not a live commercial tokenizer. "
        "Callouts, top to bottom: scenario pieces, count and cost, learner choice, immediate feedback. "
        "Round score is 10 of 10 with no hint penalty.",
    )


def slide_loop(deck: Presentation):
    slide = blank(deck)
    fill_slide(slide, PAPER)
    full_bleed(slide, DIAG / "03_game_learning_loop.png")
    notes(
        slide,
        "Orientation, decision, feedback, hint or continue, next round. "
        "The concept guide reopens without resetting the round or the score. "
        "Mastery check is the 70% instructional mastery benchmark, not expertise. "
        "Self-evaluation does not change the score. Transfer is explaining a new case.",
    )


def slide_educator(deck: Presentation):
    slide = blank(deck)
    fill_slide(slide, NAVY)
    full_bleed(slide, SHOT / "07_educator.png")
    notes(
        slide,
        "Say: Educators can assign from the guide. The table shows the game, tier, what students learn, status, minutes, Bloom level, and the 70% mastery column. "
        "Token Forge is Reference. The other twelve are Prototype. "
        "There is no button named Preview as Student. A game title opens the student view. "
        "No account and no paid model API are required.",
    )


def slide_evaluation(deck: Presentation):
    slide = blank(deck)
    fill_slide(slide, PAPER)
    full_bleed(slide, DIAG / "11_evaluation_flow.png")
    notes(
        slide,
        "This is a documented protocol for a future study. Learning effectiveness is not established. "
        "Pre and post are optional local 10-item checks. Logs stay in the browser unless research mode is turned on. "
        "The study survey from the original prototype is not in this app. Interviews are planned and not shipped. "
        "If asked about faculty review: two reviewers gave feasibility and face-validity feedback during Winter 2026, "
        "while the author was at Durham College. That review is not proof of learning. Durham College is not the current affiliation.",
    )


def slide_open_source(deck: Presentation):
    slide = blank(deck)
    fill_slide(slide, PAPER)
    full_bleed(slide, DIAG / "12_platform_evolution.png")
    bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(6.72), SLIDE_W, Inches(0.78))
    bar.fill.solid()
    bar.fill.fore_color.rgb = WHITE
    bar.line.fill.background()
    add_link(slide, LIVE, LIVE, Inches(0.3), Inches(6.82), Inches(6.3), Inches(0.55), 20)
    add_link(slide, GITHUB, GITHUB, Inches(6.7), Inches(6.82), Inches(6.3), Inches(0.55), 20)
    notes(
        slide,
        "Stop the talk on this slide. Product evolution: the prototype supplied the curriculum. "
        "This release is React and TypeScript, local-first, on GitHub Pages, with no paid API. "
        "No archived Base44 screenshots are in the repository. "
        "Contact: pia.tripathi@tufts.edu. Remaining slides are backup.",
    )


def backup_label(slide, title: str):
    fill_slide(slide, "FFFFFF")
    add_text(slide, title, Inches(0.5), Inches(0.28), Inches(12.3), Inches(0.7), 32, bold=True)


def slide_backup_performance(deck: Presentation):
    slide = blank(deck)
    backup_label(slide, "Backup · Reported deployment targets")
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
        Inches(4.3),
        Inches(12.1),
        Inches(0.7),
        22,
    )
    add_text(
        slide,
        "From the work-in-progress deployment report. Not a new benchmark of this public release, and not a learning result.",
        Inches(0.6),
        Inches(5.3),
        Inches(12.1),
        Inches(1.2),
        22,
    )
    notes(
        slide,
        "Only if asked about speed. Do not present these numbers as evidence that students learned.",
    )


def slide_backup_shots(deck: Presentation, title: str, left_name: str, left_label: str, right_name: str, right_label: str, note: str):
    slide = blank(deck)
    fill_slide(slide, NAVY)
    add_text(slide, title, Inches(0.4), Inches(0.15), Inches(12.5), Inches(0.5), 28, bold=True, color=WHITE)
    place_image(slide, SHOT / left_name, Inches(0.3), Inches(1.15), Inches(6.25), Inches(5.2))
    place_image(slide, SHOT / right_name, Inches(6.75), Inches(1.15), Inches(6.25), Inches(5.2))
    add_text(slide, left_label, Inches(0.3), Inches(6.5), Inches(6.25), Inches(0.7), 20, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    add_text(slide, right_label, Inches(6.75), Inches(6.5), Inches(6.25), Inches(0.7), 20, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    notes(slide, note)


def slide_backup_evolution(deck: Presentation):
    slide = blank(deck)
    fill_slide(slide, PAPER)
    full_bleed(slide, DIAG / "12_platform_evolution.png")
    notes(
        slide,
        "Same diagram as the closing slide, without the URL bar, if you need the footer sentence: "
        "Product evolution. The prototype supplied the curriculum. This release stands alone. "
        "No original Base44 screenshots were archived, so none are shown.",
    )


def slide_backup_faculty(deck: Presentation):
    slide = blank(deck)
    backup_label(slide, "Backup · Feasibility feedback, not a learning result")
    lines = [
        "Two faculty reviewers, Winter 2026.",
        "The author was then at Durham College. That is not the current affiliation.",
        "They confirmed the platform runs.",
        "They named adaptive difficulty as the next priority.",
        "This is face-validity feedback. It is not evidence of learning effectiveness.",
    ]
    for index, line in enumerate(lines):
        add_text(slide, line, Inches(0.6), Inches(1.4) + Inches(0.95) * index, Inches(12.1), Inches(0.8), 26, bold=index == 4)
    notes(
        slide,
        "Use only if asked. N=2. Do not generalize to student learning gains. Current affiliation is Tufts.",
    )


def build() -> None:
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
    slide_backup_shots(
        deck,
        "Backup · Homepage and a Token Forge round",
        "01_home.png",
        "Homepage",
        "04_token_forge_gameplay.png",
        "Reference game, before feedback",
        "Homepage states 13 games, 3 tiers, and no paid API. Gameplay shows the shipped Python signature and four authored rows.",
    )
    slide_backup_shots(
        deck,
        "Backup · A prototype game and the capstone",
        "10_systems_forge.png",
        "Retrieval Lab, playable prototype",
        "11_foundry.png",
        "Foundry Arena, playable prototype",
        "Retrieval Lab ranks authored chunks. Foundry is a design brief with more than one defensible answer.",
    )
    slide_backup_evolution(deck)
    slide_backup_faculty(deck)
    deck.save(OUT)
    print(OUT)


def audit(path: Path) -> None:
    deck = Presentation(str(path))
    problems = []
    pictures = 0
    for index, slide in enumerate(deck.slides, 1):
        for shape in slide.shapes:
            if shape.shape_type is not None and shape.has_text_frame:
                for paragraph in shape.text_frame.paragraphs:
                    for run in paragraph.runs:
                        size = run.font.size.pt if run.font.size else None
                        if run.text.strip() and (size is None or size < 18):
                            problems.append(f"slide {index} text {size}pt: {run.text[:80]!r}")
            if shape.shape_type is not None and "PICTURE" in str(shape.shape_type):
                pictures += 1
                # aspect is checked against the source when we know the path via the blip name is hard;
                # compare rendered shape aspect to 16:9 for full-bleed and known assets.
                aspect = shape.width / shape.height
                if abs(aspect - (16 / 9)) > 0.02 and abs(aspect - (1920 / 1080)) > 0.02:
                    # half-slide screenshots are still 16:9; flag anything else
                    problems.append(f"slide {index} picture aspect {aspect:.3f} size {shape.width}x{shape.height}")
    print(f"slides {len(deck.slides)} pictures {pictures}")
    if problems:
        print("AUDIT PROBLEMS")
        for problem in problems:
            print(problem)
        raise SystemExit(1)
    print("audit ok")


if __name__ == "__main__":
    build()
    audit(OUT)
