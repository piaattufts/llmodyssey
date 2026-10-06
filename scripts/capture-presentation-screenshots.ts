/**
 * Capture 16:9 presentation screenshots from the local app.
 * Run: node --experimental-strip-types scripts/capture-presentation-screenshots.ts
 * Requires the dev server at http://127.0.0.1:43123
 */
import { chromium, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const base = process.env.ODYSSEY_URL ?? "http://127.0.0.1:43123";
const out = path.resolve("docs/presentation/screenshots");

async function shot(page: Page, name: string) {
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(out, `${name}.png`) });
  console.log(name);
}

/** Place the top of an element a fixed distance below the viewport top. */
async function pin(page: Page, selector: string, top = 16) {
  const handle = page.locator(selector).first();
  await handle.waitFor();
  await handle.evaluate((element, offset) => {
    const y = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo(0, Math.max(0, y));
  }, top);
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => resolve(undefined))));
}

async function main() {
  await mkdir(out, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });

  await page.goto(`${base}/`);
  await page.getByRole("heading", { level: 1, name: "LLM Odyssey" }).waitFor();
  await page.getByRole("link", { name: "Start Learning" }).waitFor();
  await shot(page, "01_home");

  await pin(page, "h2:text-is('Tier 2 · Systems Forge')", 300);
  await shot(page, "02_game_arcade");

  await page.goto(`${base}/play/token-forge`);
  await page.getByTestId("game-title").waitFor();
  await pin(page, "[data-testid='game-title']", 72);
  await shot(page, "03_token_forge_orientation");

  await page.getByTestId("start-game").click();
  await page.getByTestId("strategy-bpe").click();
  await page.getByTestId("submit-round").click();
  await page.getByRole("button", { name: "Next round" }).click();
  await page.getByTestId("strategy-sentencepiece").waitFor();
  await page.locator("blockquote").first().waitFor();
  await page.getByTestId("strategy-sentencepiece").click();
  await page.getByText("Vocabulary efficiency").waitFor();
  await pin(page, "blockquote", 120);
  await shot(page, "04_token_forge_gameplay");

  await page.getByTestId("submit-round").click();
  await page.getByTestId("feedback").waitFor();
  await pin(page, "ul[aria-label='Token pieces']", 180);
  await shot(page, "05_token_forge_feedback");

  await page.goto(`${base}/play/token-forge`);
  await page.getByTestId("concept-guide-body").waitFor();
  await pin(page, "[data-testid='concept-guide-body']", 24);
  await shot(page, "06_token_forge_guide");

  await page.goto(`${base}/educator`);
  await page.getByRole("heading", { name: "Games, status, and time" }).waitFor();
  await pin(page, "h2:text-is('Games, status, and time')", 24);
  await shot(page, "07_educator");

  await page.goto(`${base}/demo/progress`);
  await page.getByRole("cell", { name: "Token Forge" }).waitFor();
  await page.getByText("Mastered").first().waitFor();
  await pin(page, "h1:text-is('Progress')", 24);
  await shot(page, "08_progress");

  await page.goto(`${base}/demo?tour=1`);
  await page.getByRole("heading", { name: "About Demo Mode" }).waitFor();
  await page.getByRole("heading", { name: "What is LLM Odyssey?" }).waitFor();
  await shot(page, "09_demo");

  await page.goto(`${base}/`);
  const ahead = page.getByRole("checkbox", { name: /Practice ahead/ });
  await ahead.click();
  await page.waitForFunction(() => {
    const input = document.querySelector("input[type=checkbox]");
    return input instanceof HTMLInputElement && input.checked;
  });
  await page.goto(`${base}/play/retrieval-lab`);
  await page.getByTestId("start-game").click();
  await page.getByRole("button", { name: /^keyword/i }).waitFor();
  await page.getByText("In top-k").first().waitFor();
  await pin(page, "text=Query:", 120);
  await shot(page, "10_systems_forge");

  await page.goto(`${base}/play/foundry-arena`);
  await page.getByTestId("start-game").click();
  await page.getByText("Predictable model spend").waitFor();
  await pin(page, "text=Predictable model spend", 160);
  await shot(page, "11_foundry");

  await page.goto(`${base}/guide`);
  await page.getByRole("heading", { name: "Foundations" }).waitFor();
  await pin(page, "h2:text-is('Foundations')", 88);
  await shot(page, "12_concept_index");

  await browser.close();
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
