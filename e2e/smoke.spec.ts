import { expect, test } from "@playwright/test";

test("homepage, one Token Forge round, and progress", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "LLM Odyssey" })).toBeVisible();
  await page.getByRole("link", { name: /1\. Token Forge/ }).click();
  await expect(page.getByTestId("game-title")).toHaveText("Token Forge");
  await page.getByTestId("start-game").click();
  await page.getByTestId("strategy-bpe").click();
  await page.getByTestId("submit-round").click();
  await expect(page.getByTestId("feedback")).toContainText("Met the round target");
  await page.getByRole("link", { name: "Progress" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Progress" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Token Forge" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Reset progress" })).toBeVisible();
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
