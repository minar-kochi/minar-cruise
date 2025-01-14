import page from "@/app/(user)/page";
import test, { expect } from "@playwright/test";

test.describe("home page", () => {
  test("title", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(
      /Minar Cruise Cochin | Luxury Arabian Sea Cruises & dining experiences/i,
    );
  });

//   test("read more button", async ({ page }) => {
//     await page.goto("/");

//     await expect(page.getAttribute)
//   });
  test("heading", async ({ page }) => {
    await page.goto("/");

    expect(page.getByText(/best cruise in the/i)).toBeVisible();

    // expect(page.getByText(/best cruse in the/i)).toBeVisible();
  });
});
