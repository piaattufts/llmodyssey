import { chromium } from "@playwright/test";
import { readdir } from "node:fs/promises";
import path from "node:path";

const dir = path.resolve("docs/presentation/diagrams");
const files = (await readdir(dir)).filter((name) => name.endsWith(".svg")).sort();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
for (const file of files) {
  const svgPath = path.join(dir, file);
  await page.goto(`file://${svgPath}`);
  const png = svgPath.replace(/\.svg$/, ".png");
  await page.screenshot({ path: png, fullPage: false });
  console.log(png);
}
await browser.close();
