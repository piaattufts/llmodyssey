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
});
