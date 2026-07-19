import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

const ROUTES = ["/", "/chat", "/stadium", "/accessibility", "/volunteer", "/dashboard"];

test.describe("Accessibility", () => {
  for (const route of ROUTES) {
    test(`${route} should not have critical accessibility violations`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const seriousOrWorse = accessibilityScanResults.violations.filter(
        (violation) => violation.impact === "critical" || violation.impact === "serious",
      );

      expect(
        seriousOrWorse,
        seriousOrWorse.map((v) => `${v.id}: ${v.nodes.length} nodes`).join("\n"),
      ).toEqual([]);
    });
  }

  test("home page has a main landmark", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("navigation is accessible via landmark", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("navigation").first()).toBeVisible();
  });

  test("chat controls are labeled", async ({ page }) => {
    await page.goto("/chat");
    await expect(page.getByLabel("Message the stadium assistant")).toBeVisible();
    await expect(page.getByRole("button", { name: "Send message" })).toBeVisible();
  });
});
