#!/usr/bin/env python3
"""Editable source for the FIE 2026 diagrams. Writes 1920×1080 SVG files."""

from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "diagrams"
W, H = 1920, 1080
FONT = "Noto Sans, Liberation Sans, Arial, sans-serif"

INK = "#142033"
MUTED = "#3E4C5E"
LINE = "#142033"
WHITE = "#FFFFFF"
BG = "#F4F7FB"
BLUE = "#1B4F8A"
BLUE_BG = "#E7F1FB"
PURPLE = "#5C2D91"
PURPLE_BG = "#F4E9FB"
GOLD = "#8A5A12"
GOLD_BG = "#FFF4D8"
CYAN = "#0F6E78"
CYAN_BG = "#E5F6F6"
PINK = "#8E1E4A"
PINK_BG = "#FDE8F0"
NEUTRAL = "#FFFFFF"
DASH = "#5C6B7A"


def esc(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


class Svg:
    def __init__(self) -> None:
        self.parts: list[str] = []

    def add(self, fragment: str) -> None:
        self.parts.append(fragment)

    def rect(self, x, y, w, h, fill, stroke=LINE, sw=4, rx=18) -> None:
        self.add(
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
        )

    def line(self, x1, y1, x2, y2, stroke=LINE, sw=5, marker=True, dash=False) -> None:
        dashed = ' stroke-dasharray="10 8"' if dash else ""
        end = ' marker-end="url(#arrow)"' if marker else ""
        self.add(
            f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{stroke}" stroke-width="{sw}"{dashed}{end}/>'
        )

    def text(self, x, y, text, size=36, fill=INK, weight=700, anchor="start") -> None:
        self.add(
            f'<text x="{x}" y="{y}" font-family="{FONT}" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}">{esc(text)}</text>'
        )

    def lines(self, x, y, rows, size=32, fill=INK, weight=600, anchor="start", gap=40) -> None:
        for index, row in enumerate(rows):
            self.text(x, y + index * gap, row, size=size, fill=fill, weight=weight, anchor=anchor)

    def save(self, name: str) -> None:
        body = "\n".join(self.parts)
        document = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
  <defs>
    <marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
      <path d="M0,0 L12,6 L0,12 Z" fill="{LINE}"/>
    </marker>
  </defs>
  <rect width="{W}" height="{H}" fill="{BG}"/>
  {body}
</svg>
'''
        path = OUT / name
        path.write_text(document)
        print(path)


def title(svg: Svg, text: str, y=68) -> None:
    svg.text(72, y, text, size=48, weight=800)


def footer(svg: Svg, text: str) -> None:
    svg.rect(64, 980, 1792, 68, WHITE, LINE, 4, 16)
    svg.text(960, 1024, text, size=30, weight=700, anchor="middle")


def diagram_tiers() -> None:
    svg = Svg()
    title(svg, "Three learning tiers")
    bands = [
        (118, BLUE, BLUE_BG, "TIER 1", "COGNITIVE CORE", "Games 1–7", "Remember  →  Understand  →  Apply", [
            "1  Token Forge    REFERENCE",
            "2 Attention Architect     3 Context Compression     4 Promptsmith",
            "5 Gradient Playground     6 Reasoning Reactor     7 Alignment Arena",
            "Games 2–7 are playable prototypes",
        ]),
        (400, PURPLE, PURPLE_BG, "TIER 2", "SYSTEMS FORGE", "Games 8–12", "Apply  →  Analyze  →  Evaluate", [
            "8 Ship-It Simulator     9 Agent Architect     10 Retrieval Lab",
            "11 System Composer     12 ProdOps Gauntlet",
            "All five are playable prototypes",
        ]),
        (682, GOLD, GOLD_BG, "TIER 3", "FOUNDRY ARENA", "Game 13", "Analyze  →  Evaluate  →  Create", [
            "13  Foundry Arena    ·    cross-domain capstone",
            "Playable prototype    ·    more than one defensible design",
        ]),
    ]
    for y, stroke, fill, kicker, name, count, bloom, rows in bands:
        svg.rect(64, y, 1792, 250 if y < 600 else 250, fill, stroke, 5, 22)
        svg.text(96, y + 52, kicker, size=24, fill=stroke, weight=800)
        svg.text(96, y + 108, name, size=44, fill=stroke, weight=800)
        svg.text(1100, y + 108, count, size=32, fill=INK, weight=700)
        svg.text(96, y + 164, bloom, size=32, weight=700)
        svg.lines(96, y + 214, rows[:1], size=30, weight=700, gap=36)
        if len(rows) > 1:
            svg.lines(96, y + 252, rows[1:], size=28, fill=MUTED, weight=600, gap=34)
    # The third band is shorter in content; redraw heights more tightly by overlaying nothing.
    # Replace the uniform 250 cards with a cleaner manual layout below by covering and redrawing.
    svg.save("01_curriculum_tiers.svg")


def diagram_tiers_clean() -> None:
    svg = Svg()
    title(svg, "Three learning tiers")
    svg.line(960, 118, 960, 150, sw=5)

    svg.rect(64, 150, 1792, 250, BLUE_BG, BLUE, 5, 22)
    svg.text(96, 202, "TIER 1", size=24, fill=BLUE, weight=800)
    svg.text(96, 258, "COGNITIVE CORE", size=46, fill=BLUE, weight=800)
    svg.text(96, 312, "Remember   →   Understand   →   Apply", size=32, weight=700)
    svg.text(96, 366, "1  Token Forge", size=32, weight=800)
    svg.rect(430, 336, 250, 40, BLUE, BLUE, 0, 10)
    svg.text(555, 365, "REFERENCE", size=24, fill=WHITE, weight=800, anchor="middle")
    svg.text(720, 366, "2–7 are playable prototypes", size=28, fill=MUTED, weight=700)
    svg.text(96, 410, "Attention Architect   ·   Context Compression   ·   Promptsmith", size=28, weight=650)
    # second game line
    svg.text(96, 448, "Gradient Playground   ·   Reasoning Reactor   ·   Alignment Arena", size=28, weight=650)
    # The card is only 250 tall (150-400). 448 is past 400. Fix by expanding cards.
    svg.save("_tmp.svg")


def band(svg, y, h, fill, stroke, kicker, name, bloom, lines):
    svg.rect(72, y, 1776, h, fill, stroke, 5, 22)
    svg.text(104, y + 48, kicker, size=22, fill=stroke, weight=800)
    svg.text(104, y + 100, name, size=42, fill=stroke, weight=800)
    svg.text(104, y + 150, bloom, size=30, weight=700)
    yy = y + 198
    for line in lines:
        svg.text(104, yy, line, size=30, weight=700)
        yy += 40


def build_tiers() -> None:
    svg = Svg()
    title(svg, "Three learning tiers")
    svg.rect(64, 108, 1792, 268, BLUE_BG, BLUE, 5, 20)
    svg.text(96, 156, "TIER 1    ·    GAMES 1–7", size=24, fill=BLUE, weight=800)
    svg.text(96, 214, "COGNITIVE CORE", size=46, fill=BLUE, weight=800)
    svg.text(96, 264, "Remember    →    Understand    →    Apply", size=32, weight=700)
    svg.text(96, 318, "1  Token Forge", size=30, weight=800)
    svg.rect(390, 290, 230, 38, BLUE, BLUE, 0, 8)
    svg.text(505, 317, "REFERENCE", size=22, fill=WHITE, weight=800, anchor="middle")
    svg.text(980, 200, "2  Attention Architect", size=28, weight=700)
    svg.text(980, 244, "3  Context Compression", size=28, weight=700)
    svg.text(980, 288, "4  Promptsmith", size=28, weight=700)
    svg.text(1400, 200, "5  Gradient Playground", size=28, weight=700)
    svg.text(1400, 244, "6  Reasoning Reactor", size=28, weight=700)
    svg.text(1400, 288, "7  Alignment Arena", size=28, weight=700)
    svg.text(980, 348, "Games 2–7 are playable prototypes", size=26, fill=MUTED, weight=700)
    svg.line(960, 380, 960, 412)
    svg.rect(64, 416, 1792, 250, PURPLE_BG, PURPLE, 5, 20)
    svg.text(96, 464, "TIER 2    ·    GAMES 8–12", size=24, fill=PURPLE, weight=800)
    svg.text(96, 522, "SYSTEMS FORGE", size=46, fill=PURPLE, weight=800)
    svg.text(96, 572, "Apply    →    Analyze    →    Evaluate", size=32, weight=700)
    svg.text(96, 608, "8 Ship-It    9 Agent Architect    10 Retrieval Lab", size=30, weight=750)
    svg.text(96, 644, "11 System Composer    12 ProdOps Gauntlet    prototypes", size=28, weight=700)
    svg.line(960, 674, 960, 698)
    svg.rect(64, 706, 1792, 240, GOLD_BG, GOLD, 5, 20)
    svg.text(96, 754, "TIER 3    ·    GAME 13", size=24, fill=GOLD, weight=800)
    svg.text(96, 812, "FOUNDRY ARENA", size=46, fill=GOLD, weight=800)
    svg.text(96, 862, "Analyze    →    Evaluate    →    Create", size=32, weight=700)
    svg.text(96, 916, "Cross-domain capstone     ·     playable prototype", size=30, weight=750)
    footer(svg, "Foundations   →   Systems   →   Synthesis")
    svg.save("01_curriculum_tiers.svg")


def step_card(svg, x, y, w, h, stroke, fill, number, concept, game):
    svg.rect(x, y, w, h, fill, stroke, 4, 16)
    svg.rect(x, y, 72, h, stroke, stroke, 0, 16)
    svg.rect(x + 56, y, 20, h, stroke, stroke, 0, 0)
    svg.text(x + 36, y + h / 2 + 12, number, size=28, fill=WHITE, weight=800, anchor="middle")
    svg.text(x + 100, y + 42, concept, size=28, fill=stroke, weight=800)
    svg.text(x + 100, y + 80, game, size=26, fill=INK, weight=650)


def build_journey() -> None:
    svg = Svg()
    title(svg, "Curriculum journey")
    rows = [
        [
            ("1", "TOKENIZATION", "Token Forge", BLUE, BLUE_BG),
            ("2", "ATTENTION", "Attention Architect", BLUE, BLUE_BG),
            ("3", "CONTEXT", "Context Compression", BLUE, BLUE_BG),
            ("4", "TASK SPEC", "Promptsmith", BLUE, BLUE_BG),
        ],
        [
            ("5", "ADAPTATION", "Gradient Playground", BLUE, BLUE_BG),
            ("6", "GENERATION", "Reasoning Reactor", BLUE, BLUE_BG),
            ("7", "ALIGNMENT", "Alignment Arena", BLUE, BLUE_BG),
            ("8", "DEPLOYMENT", "Ship-It Simulator", PURPLE, PURPLE_BG),
        ],
        [
            ("9", "AGENTS", "Agent Architect", PURPLE, PURPLE_BG),
            ("10", "RETRIEVAL", "Retrieval Lab", PURPLE, PURPLE_BG),
            ("11", "INTEGRATION", "System Composer", PURPLE, PURPLE_BG),
            ("12", "OPERATIONS", "ProdOps Gauntlet", PURPLE, PURPLE_BG),
            ("13", "SYNTHESIS", "Foundry Arena", GOLD, GOLD_BG),
        ],
    ]
    y = 130
    for row in rows:
        count = len(row)
        gap = 20
        width = (1792 - gap * (count - 1)) / count
        x = 64
        for number, concept, game, stroke, fill in row:
            step_card(svg, x, y, width, 200, stroke, fill, number, concept, game)
            x += width + gap
        y += 250
    svg.text(960, 955, "Read left to right, then the next row.", size=28, weight=700, anchor="middle")
    footer(svg, "Pedagogical progression  —  not a universal production pipeline.")
    svg.save("02_curriculum_journey.svg")


def box(svg, x, y, w, h, fill, stroke, title_text, body, title_size=32):
    svg.rect(x, y, w, h, fill, stroke, 4, 16)
    svg.text(x + 24, y + 46, title_text, size=title_size, fill=stroke, weight=800)
    svg.lines(x + 24, y + 92, body, size=26, fill=INK, weight=600, gap=34)


def build_loop() -> None:
    svg = Svg()
    title(svg, "How one game teaches")
    play = [
        (120, BLUE_BG, BLUE, "1  ORIENTATION", "What, why, and how to play."),
        (270, WHITE, LINE, "2  CHALLENGE", "An engineering decision."),
        (420, CYAN_BG, CYAN, "3  FEEDBACK", "Result, why, and the trade-off."),
        (570, PINK_BG, PINK, "HINT OR CONTINUE", "Hint: minus 1. Retry keeps the best."),
        (720, WHITE, LINE, "4  NEXT ROUND", "Same pattern until the last round."),
    ]
    for y, fill, stroke, name, detail in play:
        svg.rect(64, y, 1000, 120, fill, stroke, 5, 16)
        svg.text(96, y + 50, name, size=32, fill=stroke, weight=800)
        svg.text(96, y + 92, detail, size=26, weight=650)
        if y < 720:
            svg.line(564, y + 120, 564, y + 148)
    svg.rect(1140, 120, 716, 250, GOLD_BG, GOLD, 5, 16)
    svg.text(1172, 180, "CONCEPT GUIDE", size=34, fill=GOLD, weight=800)
    svg.text(1172, 240, "Reopen any time.", size=30, weight=700)
    svg.text(1172, 290, "Round and score stay.", size=30, weight=700)
    svg.line(1064, 330, 1136, 245, dash=True)
    after = [
        (640, BLUE_BG, BLUE, "5  MASTERY CHECK", "70% benchmark. Not expertise."),
        (800, PURPLE_BG, PURPLE, "6  REFLECT, THEN NEXT", "Self-eval does not change the score."),
    ]
    for index, (y, fill, stroke, name, detail) in enumerate(after):
        svg.rect(1140, y, 716, 130, fill, stroke, 5, 16)
        svg.text(1172, y + 54, name, size=32, fill=stroke, weight=800)
        svg.text(1172, y + 98, detail, size=26, weight=650)
        if index < len(after) - 1:
            svg.line(1498, y + 130, 1498, y + 158)
    svg.line(1064, 780, 1136, 705)
    footer(svg, "Completion is finishing.  Mastery is the benchmark.  Transfer is a new case.")
    svg.save("03_game_learning_loop.svg")


def build_pedagogy() -> None:
    svg = Svg()
    title(svg, "Learning science  →  game mechanic")
    pairs = [
        ("Immediate feedback", "Feedback after every decision", "Black & Wiliam"),
        ("Scaffolded hints", "Three hints, minus 1 point each", "Vygotsky"),
        ("Progressive difficulty", "Fixed rounds, increasing focus", "Sweller"),
        ("Worked examples", "Illustrated guide before and during play", "Sweller"),
        ("Authentic context", "LLM engineering scenarios", "Situated practice"),
    ]
    y = 120
    for left, right, cite in pairs:
        svg.rect(64, y, 760, 130, BLUE_BG, BLUE, 4, 16)
        svg.text(96, y + 78, left, size=34, fill=BLUE, weight=800)
        svg.line(840, y + 65, 980, y + 65)
        svg.rect(996, y, 860, 130, WHITE, LINE, 4, 16)
        svg.text(1028, y + 78, right, size=32, weight=750)
        y += 150
    footer(svg, "Black & Wiliam  ·  Vygotsky  ·  Sweller  ·  Bloom.   Practice support, not a measured gain.")
    svg.save("04_pedagogy_mapping.svg")


def build_forge_flow() -> None:
    svg = Svg()
    title(svg, "Token Forge  ·  one round")
    svg.rect(1280, 28, 560, 48, BLUE, BLUE, 0, 12)
    svg.text(1560, 62, "REFERENCE IMPLEMENTATION", size=24, fill=WHITE, weight=800, anchor="middle")
    stages = [
        (120, "1  TEXT", ["def refund_total(", "items: list[str]) -> int:"]),
        (470, "2  FOUR ROWS", ["BPE", "WordPiece", "SentencePiece", "Unigram"]),
        (820, "3  COMPARE", ["Pieces", "Token count", "The round’s goal"]),
        (1170, "4  COMPUTE", ["Count", "Efficiency", "Exercise cost"]),
        (1520, "5  FEEDBACK", ["Why this choice", "The trade-off", "Weaker options"]),
    ]
    for x, name, rows in stages:
        svg.rect(x, 160, 320, 520, WHITE, BLUE, 5, 18)
        svg.text(x + 24, 220, name, size=30, fill=BLUE, weight=800)
        svg.lines(x + 24, 290, rows, size=30, weight=700, gap=64)
    for x in (440, 790, 1140, 1490):
        svg.line(x, 420, x + 30, 420)
    svg.rect(120, 720, 1720, 210, GOLD_BG, GOLD, 5, 18)
    svg.text(152, 790, "ROUND COMPLETE", size=36, fill=GOLD, weight=800)
    svg.text(152, 850, "The pieces are authored examples.", size=32, weight=700)
    svg.text(152, 898, "Counts and the exercise cost are arithmetic on those pieces.", size=32, weight=700)
    footer(svg, "Not a live production tokenizer.  Measure the deployed model’s tokenizer in practice.")
    svg.save("05_token_forge_flow.svg")


def build_pipeline() -> None:
    svg = Svg()
    title(svg, "From text to a transformer")
    stages = [
        ("RAW TEXT", ["The tokenizer", "matters."]),
        ("TOKENS", ["The", "token · izer", "matters · ."]),
        ("TOKEN IDs", ["1012", "4837 · 9281", "771 · 13"]),
        ("EMBEDDINGS", ["vector", "vector", "vector"]),
        ("TRANSFORMER", ["Attention over", "those vectors"]),
    ]
    x = 64
    for name, rows in stages:
        svg.rect(x, 180, 330, 520, WHITE, BLUE, 5, 18)
        svg.text(x + 24, 250, name, size=30, fill=BLUE, weight=800)
        svg.lines(x + 24, 360, rows, size=34, weight=700, gap=70)
        x += 380
    for start in (394, 774, 1154, 1534):
        svg.line(start, 440, start + 46, 440)
    footer(svg, "Illustrative example.  These IDs are not from a production tokenizer.")
    svg.save("06_tokenization_pipeline.svg")


def build_architecture() -> None:
    svg = Svg()
    title(svg, "Standalone architecture")
    steps = [
        "LEARNER",
        "REACT + TYPESCRIPT UI",
        "SHARED GAME COMPONENTS",
        "13 GAME DEFINITIONS",
        "GAME ENGINE",
        "LOCAL PROGRESS STORE",
    ]
    y = 120
    for step in steps:
        svg.rect(80, y, 980, 100, WHITE, BLUE, 5, 16)
        svg.text(120, y + 64, step, size=34, weight=800)
        if step != steps[-1]:
            svg.line(570, y + 100, 570, y + 124)
        y += 128
    svg.text(120, 912, "IndexedDB, with localStorage if IndexedDB is unavailable.", size=28, weight=650)
    svg.rect(1140, 140, 720, 760, WHITE, DASH, 4, 20)
    svg.text(1172, 200, "OPTIONAL", size=28, fill=DASH, weight=800)
    svg.text(1172, 260, "Off unless configured", size=30, weight=700)
    svg.rect(1180, 300, 640, 150, PURPLE_BG, PURPLE, 4, 14)
    svg.text(1208, 360, "Analytics adapter", size=32, fill=PURPLE, weight=800)
    svg.text(1208, 410, "Supabase only with research", size=26, weight=650)
    svg.text(1208, 448, "mode and a project URL", size=26, weight=650)
    svg.rect(1180, 480, 640, 180, GOLD_BG, GOLD, 4, 14)
    svg.text(1208, 540, "LLM provider adapter", size=32, fill=GOLD, weight=800)
    svg.text(1208, 590, "Default is a mock.", size=26, weight=650)
    svg.text(1208, 628, "The 13 games do not call it.", size=26, weight=650)
    svg.text(1172, 740, "A missing backend does not", size=28, weight=700)
    svg.text(1172, 784, "stop the games.", size=28, weight=700)
    footer(svg, "Core gameplay needs no backend and no paid model API.")
    svg.save("07_platform_architecture.svg")


def build_data() -> None:
    svg = Svg()
    title(svg, "Local-first data flow")
    left = [
        (120, "LEARNER ACTION", ""),
        (250, "BROWSER", ""),
        (380, "GAME STATE", ""),
        (510, "LOCAL PROGRESS", "Score, rounds, hints, mastery"),
        (680, "PROGRESS PAGE", ""),
        (810, "EXPORT   CSV / JSON", ""),
    ]
    for y, label, detail in left:
        svg.rect(72, y, 1000, 110, WHITE, BLUE, 5, 16)
        svg.text(104, y + (68 if not detail else 52), label, size=32, weight=800)
        if detail:
            svg.text(104, y + 90, detail, size=24, weight=650)
        if y < 810:
            svg.line(572, y + 110, 572, y + 130)
    svg.rect(1120, 150, 736, 760, WHITE, DASH, 4, 18)
    svg.text(1152, 220, "RESEARCH MODE?", size=32, fill=DASH, weight=800)
    svg.rect(1160, 260, 656, 140, CYAN_BG, CYAN, 4, 14)
    svg.text(1192, 320, "DEFAULT:  NO", size=36, fill=CYAN, weight=800)
    svg.text(1192, 368, "Data remains in this browser.", size=26, weight=650)
    svg.rect(1160, 430, 656, 250, PINK_BG, PINK, 4, 14)
    svg.text(1192, 490, "ONLY IF TURNED ON", size=30, fill=PINK, weight=800)
    svg.text(1192, 545, "Consent", size=28, weight=700)
    svg.text(1192, 590, "then analytics adapter", size=28, weight=700)
    svg.text(1192, 635, "then an approved backend", size=28, weight=700)
    footer(svg, "Public visitors are not research participants.  Self-evaluation is stored separately.")
    svg.save("08_local_first_data_flow.svg")


def build_educator() -> None:
    svg = Svg()
    title(svg, "Educator workflow")
    steps = [
        ("1", "CHOOSE", "One game or a path"),
        ("2", "INSPECT", "Objectives, time, Bloom"),
        ("3", "INSPECT", "Scoring and simulation"),
        ("4", "PREVIEW", "Open the student view"),
        ("5", "ASSIGN", "Game, lab, module, or all"),
        ("6", "STUDENTS PLAY", "Local progress only"),
        ("7", "LOOK FOR", "Score is not enough"),
        ("8", "DISCUSS", "Transfer and extension"),
    ]
    positions = []
    for index, (num, name, detail) in enumerate(steps):
        col = index % 4
        row = index // 4
        x = 64 + col * 464
        y = 150 + row * 340
        svg.rect(x, y, 440, 280, WHITE if row == 0 else GOLD_BG, BLUE if row == 0 else GOLD, 5, 18)
        svg.text(x + 28, y + 70, num, size=42, fill=BLUE if row == 0 else GOLD, weight=800)
        svg.text(x + 28, y + 140, name, size=32, weight=800)
        svg.text(x + 28, y + 200, detail, size=28, weight=650)
        positions.append((x, y))
    footer(svg, "An educator can read the lesson without reading the source code.")
    svg.save("09_educator_workflow.svg")


def build_assessment() -> None:
    svg = Svg()
    title(svg, "Four different claims")
    rows = [
        (150, 1500, BLUE_BG, BLUE, "COMPLETION", "I finished the activity."),
        (330, 1600, WHITE, LINE, "PERFORMANCE", "How did I score on these scenarios?"),
        (510, 1700, CYAN_BG, CYAN, "MASTERY THRESHOLD", "Did I meet the 70% benchmark?"),
        (700, 1792, GOLD_BG, GOLD, "TRANSFER", "Can I explain a new case?"),
    ]
    for y, w, fill, stroke, name, detail in rows:
        x = (1920 - w) / 2
        h = 150 if name != "TRANSFER" else 200
        svg.rect(x, y, w, h, fill, stroke, 6 if name == "TRANSFER" else 4, 18)
        svg.text(x + 40, y + 70, name, size=40, fill=stroke, weight=800)
        svg.text(x + 40, y + 120, detail, size=32, weight=650)
    footer(svg, "70% is an instructional benchmark  —  not professional expertise.")
    svg.save("10_assessment_model.svg")


def build_evaluation() -> None:
    svg = Svg()
    title(svg, "Evaluation flow  ·  documented, not proven")
    current = [
        (140, "PRE-ASSESSMENT", "Optional. Local. 10 items."),
        (300, "ODYSSEY USE", "The 13 games."),
        (460, "LOCAL LOGS", "Time, completion, hints, retries."),
        (620, "POST-ASSESSMENT", "Optional. Local. Same instrument."),
    ]
    for y, name, detail in current:
        svg.rect(64, y, 1100, 130, WHITE, BLUE, 5, 16)
        svg.text(96, y + 55, name, size=32, fill=BLUE, weight=800)
        svg.text(96, y + 100, detail, size=28, weight=650)
        if y < 620:
            svg.line(614, y + 130, 614, y + 160)
    svg.rect(1240, 140, 616, 610, WHITE, DASH, 4, 18)
    svg.text(1272, 200, "NOT IN THIS APP", size=28, fill=DASH, weight=800)
    svg.rect(1280, 240, 536, 200, PINK_BG, PINK, 4, 14)
    svg.text(1312, 310, "STUDY SURVEY", size=32, fill=PINK, weight=800)
    svg.text(1312, 360, "Removed with Base44.", size=26, weight=650)
    svg.text(1312, 400, "Feedback page is local only.", size=26, weight=650)
    svg.rect(1280, 470, 536, 200, PINK_BG, PINK, 4, 14)
    svg.text(1312, 545, "INTERVIEWS", size=32, fill=PINK, weight=800)
    svg.text(1312, 600, "PLANNED", size=30, weight=800)
    svg.text(1312, 645, "Not shipped.", size=26, weight=650)
    footer(svg, "Questions for a future study: knowledge, engagement, feature use, prior expertise.")
    svg.save("11_evaluation_flow.svg")


def build_evolution() -> None:
    svg = Svg()
    title(svg, "From prototype to public platform")
    svg.rect(64, 140, 540, 780, WHITE, DASH, 5, 20)
    svg.text(96, 210, "ORIGINAL PROTOTYPE", size=30, fill=MUTED, weight=800)
    svg.lines(96, 290, [
        "Base44-hosted proof",
        "of concept",
        "",
        "Games, guides,",
        "and feedback",
        "",
        "Platform account",
        "and entity store",
    ], size=32, weight=650, gap=52)
    svg.line(620, 520, 700, 520)
    svg.rect(710, 140, 500, 780, BLUE_BG, BLUE, 5, 20)
    svg.text(742, 210, "MIGRATION", size=30, fill=BLUE, weight=800)
    svg.lines(742, 300, [
        "Preserve",
        "content",
        "concepts",
        "pedagogy",
        "",
        "Replace",
        "required backend",
        "and platform lock-in",
    ], size=32, weight=700, gap=52)
    svg.line(1226, 520, 1306, 520)
    svg.rect(1316, 140, 540, 780, GOLD_BG, GOLD, 5, 20)
    svg.text(1348, 210, "PUBLIC PLATFORM", size=30, fill=GOLD, weight=800)
    svg.lines(1348, 290, [
        "React + TypeScript",
        "Local-first",
        "GitHub Pages",
        "Educator reusable",
        "No paid API",
        "",
        "Token Forge is the",
        "reference game",
    ], size=32, weight=700, gap=52)
    footer(svg, "Product evolution.  The prototype supplied the curriculum.  This release stands alone.")
    svg.save("12_platform_evolution.svg")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    build_tiers()
    build_journey()
    build_loop()
    build_pedagogy()
    build_forge_flow()
    build_pipeline()
    build_architecture()
    build_data()
    build_educator()
    build_assessment()
    build_evaluation()
    build_evolution()
    tmp = OUT / "_tmp.svg"
    if tmp.exists():
        tmp.unlink()


if __name__ == "__main__":
    main()
