/**
 * Page Interaction Helpers
 * Reusable functions for common UI interactions in booking flow
 */

import { Page, expect } from '@playwright/test';

/**
 * Navigate to landing page and wait for it to load
 */
export async function navigateToLandingPage(page: Page): Promise<void> {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate to Sunset Cruise package
 */
export async function navigateToSunsetCruisePackage(page: Page): Promise<void> {
  const sunsetLink = page
    .getByRole('link', { name: /sunset/i })
    .first();

  await expect(sunsetLink).toBeVisible({ timeout: 10000 });
  await sunsetLink.click();

  await page.waitForURL(/\/package\/sunset/i);
  await page.waitForLoadState('networkidle');
}

/**
 * Select departure date from calendar
 */
export async function selectDepartureDate(
  page: Page,
  day: number,
  month: number
): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const allButtons = page.locator('button');
  const buttonCount = await allButtons.count();
  console.log(`Found ${buttonCount} buttons on the page`);

  const currentMonth = new Date().getMonth();

  // Check if we need to navigate to next month
  if (month !== currentMonth) {
    const nextButton = page.locator('[aria-label*="next" i], button:has-text("next")').first();

    if (await nextButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Clicking next month button');
      await nextButton.click();
      await page.waitForTimeout(500);
    }
  }

  // Click the date button
  const dateButtons = page
    .locator('button')
    .filter({ hasText: new RegExp(`^${day}$`) });

  const dateButtonCount = await dateButtons.count();
  console.log(`Found ${dateButtonCount} buttons matching day ${day}`);

  if (dateButtonCount > 0) {
    await dateButtons.first().click();
    console.log(`Clicked date ${day}`);
  } else {
    const anyDateButton = page.getByRole('button', {
      name: day.toString(),
      exact: true,
    });

    if (await anyDateButton.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      await anyDateButton.first().click();
      console.log(`Clicked date button (fallback) ${day}`);
    } else {
      throw new Error(`Could not find date button for day ${day}`);
    }
  }

  await page.waitForTimeout(500);
}

/**
 * Fill booking form with passenger details
 */
export async function fillBookingForm(
  page: Page,
  name: string,
  email: string,
  phone: string,
  adultCount: number = 5
): Promise<void> {
  // Fill name
  await page.getByPlaceholder('Your Name').fill(name);

  // Fill email
  await page.getByPlaceholder('john@gmail.com').fill(email);

  // Fill phone number
  const phoneInput = page.getByPlaceholder('9399779908');
  await expect(phoneInput).toBeVisible();
  await phoneInput.fill(phone);

  // Set adult count
  const adultCountInput = page.locator('#numOfAdults-count');
  await expect(adultCountInput).toBeVisible();

  const adultContainer = adultCountInput.locator('..');
  const adultPlusBtn = adultContainer
    .getByRole('button')
    .filter({ hasText: '+' })
    .first();

  // Click plus button to reach desired count
  for (let i = 0; i < adultCount; i++) {
    await adultPlusBtn.click();
    await page.waitForTimeout(200);
  }

  // Accept terms and conditions
  const termsCheckbox = page.getByRole('checkbox').first();
  if (!(await termsCheckbox.isChecked())) {
    await termsCheckbox.check();
  }

  console.log('Form filled successfully');
}

/**
 * Click Pay Now button
 */
export async function clickPayNow(page: Page): Promise<void> {
  const payButton = page.getByRole('button', { name: /pay now/i }).first();
  await expect(payButton).toBeVisible();
  await payButton.click();

  await page.waitForTimeout(2000);
}
