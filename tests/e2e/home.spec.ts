import { test, expect } from "@playwright/test";

const APP_NAME = "FIFA Stadium Intelligence AI";
const NAV_LABELS = ["Home", "Features", "AI Chat", "Stadium Map"];

test.describe("Home page", () => {
  test("displays the application title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(new RegExp(APP_NAME, "i"));
    await expect(page.getByRole("heading", { level: 1 })).toContainText(APP_NAME);
  });

  test("renders main navigation links", async ({ page }) => {
    await page.goto("/");

    for (const label of NAV_LABELS) {
      await expect(page.getByRole("navigation").getByRole("link", { name: label })).toBeVisible();
    }
  });

  test("navigates to features page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation").getByRole("link", { name: "Features" }).click();
    await expect(page).toHaveURL("/features");
  });
});
