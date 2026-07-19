import { test, expect } from "@playwright/test";

test.describe("Core demo flows", () => {
  test("best gate hero is visible on home", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Get Me In/i })).toBeVisible();
    await page.getByLabel("Accessible entrance required").click();
    await expect(page.getByText(/Accessible route|accessible/i).first()).toBeVisible();
  });

  test("volunteer can open incident form", async ({ page }) => {
    await page.goto("/volunteer");
    await page.getByRole("button", { name: "Report Incident" }).click();
    await expect(page.getByLabel("Incident Type")).toBeVisible();
    await expect(page.getByLabel("Description")).toBeVisible();
  });
});
