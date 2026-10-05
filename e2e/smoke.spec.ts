import { expect, test } from "@playwright/test";

test("homepage, one Token Forge round, and progress", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "LLM Odyssey" })).toBeVisible();
  await page.getByRole("link", { name: /1\. Token Forge/ }).click();
  await expect(page.getByTestId("game-title")).toHaveText("Token Forge");
  await page.getByTestId("start-game").click();
  await page.getByTestId("strategy-bpe").click();
  await page.getByTestId("submit-round").click();
  await expect(page.getByTestId("feedback")).toContainText("Correct");
  await page.getByRole("link", { name: "Progress" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Progress" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Token Forge" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Reset progress" })).toBeVisible();
});

test("Token Forge orientation, guide, and preserved score", async ({ page }) => {
  await page.goto("/play/token-forge");
  await expect(page.getByTestId("game-orientation")).toBeVisible();
  await expect(page.getByRole("heading", { name: "What will I learn?" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "How to play" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "How am I evaluated?" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "How should I evaluate myself?" })).toBeVisible();
  await expect(page.getByTestId("reference-status")).toContainText("Reference Implementation");
  await page.getByTestId("start-game").click();
  await expect(page.getByTestId("round-brief")).toContainText("Round 1 of 5");
  await page.getByTestId("strategy-bpe").click();
  await page.getByTestId("submit-round").click();
  await expect(page.getByTestId("feedback")).toContainText("Your decision");
  await expect(page.getByTestId("feedback")).toContainText("Trade-off");
  const score = page.getByText(/Score so far/);
  const before = await score.innerText();
  await page.getByTestId("open-game-guide").click();
  await expect(page.getByTestId("game-guide")).toBeVisible();
  await page.getByRole("tab", { name: "Scoring" }).click();
  await expect(page.getByTestId("game-guide")).toContainText("hint");
  await page.getByRole("button", { name: "Close" }).click();
  await expect(score).toHaveText(before);
  await expect(page.getByTestId("round-brief")).toContainText("Round 1 of 5");
});

test("every game orientation names the activity and the prototype status", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("checkbox", { name: /Practice ahead/ }).click();
  await expect(page.getByRole("checkbox", { name: /Practice ahead/ })).toBeChecked();
  const ids = [
    "token-forge",
    "attention-architect",
    "context-compression",
    "promptsmith",
    "gradient-playground",
    "reasoning-reactor",
    "alignment-arena",
    "ship-it-simulator",
    "agent-architect",
    "retrieval-lab",
    "system-composer",
    "prodops-gauntlet",
    "foundry-arena",
  ];
  for (const id of ids) {
    await page.goto(`/play/${id}`);
    await expect(page.getByTestId("game-orientation")).toBeVisible();
    await expect(page.getByRole("heading", { name: "What will I learn?" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "How to play" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "How am I evaluated?" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "What is simulated, and what is computed?" })).toBeVisible();
    if (id === "token-forge") {
      await expect(page.getByTestId("reference-status")).toBeVisible();
    } else {
      await expect(page.getByTestId("prototype-status")).toContainText("Playable Prototype");
    }
  }
  await page.goto("/educator");
  await expect(page.getByTestId("educator-orientation-token-forge")).toContainText("Simulation disclosure");
  await expect(page.getByTestId("educator-orientation-attention-architect")).toContainText("Playable Prototype");
});

test("completion screen includes a local self-evaluation", async ({ page }) => {
  await page.goto("/play/token-forge");
  await page.getByTestId("start-game").click();
  const strategies = ["bpe", "sentencepiece", "sentencepiece", "sentencepiece", "sentencepiece"];
  for (const [index, strategy] of strategies.entries()) {
    await page.getByTestId(`strategy-${strategy}`).click();
    await page.getByTestId("submit-round").click();
    if (index < strategies.length - 1) {
      await page.getByRole("button", { name: "Next round" }).click();
    } else {
      await page.getByRole("button", { name: "See your result" }).click();
    }
  }
  await expect(page.getByTestId("self-evaluation")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your result" })).toBeVisible();
  await expect(page.getByText("Mastery threshold reached.")).toBeVisible();
  await page.getByRole("button", { name: "I understand this" }).first().click();
  await expect(page.getByRole("button", { name: "I need more practice" }).first()).toBeVisible();
});

test("prototype label, demo tour, and unknown route", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Attention Architect/ }).first()).toContainText("Prototype");
  await page.getByRole("link", { name: /2\. Attention Architect/ }).click();
  await expect(page.getByText("Prototype. Scores on this page are calculated")).toBeVisible();
  await page.goto("/demo");
  await expect(page.getByText("Demo mode uses a separate local record")).toBeVisible();
  await page.goto("/this-route-is-not-real");
  await expect(page.getByRole("heading", { name: "That page is not in LLM Odyssey" })).toBeVisible();
  await page.goto("/games/token-forge");
  await expect(page.getByTestId("game-title")).toHaveText("Token Forge");
  await page.goto("/educator");
  await expect(page.getByRole("heading", { level: 1, name: "Educator guide" })).toBeVisible();
});
