/**
 * Success Page Verification Helpers
 * Reusable functions for verifying booking details on the success page
 */

import { Page, expect } from '@playwright/test';
import { DateInfo } from './date-utils';

/**
 * Verify all booking details on success page
 */
export async function verifyBookingDetails(
  page: Page,
  departureDateInfo: DateInfo,
  todayDateInfo: DateInfo
): Promise<void> {
  // Wait for ticket to load
  await expect(page.getByText(/Booking Date/i)).toBeVisible({
    timeout: 15000,
  });

  console.log('Ticket loaded successfully');

  // Verify Booking Date (today)
  await verifyBookingDate(page, todayDateInfo.formatted);

  // Verify Booking Package contains "Sunset"
  await verifyBookingPackage(page);

  // Verify Departure Date
  await verifyDepartureDate(page, departureDateInfo.formatted);

  // Verify Booking ID is present
  await verifyBookingId(page);

  // Verify adult passenger count
  await verifyAdultCount(page);

  console.log('All verifications passed!');
}

/**
 * Verify booking date on success page
 */
async function verifyBookingDate(page: Page, expectedDate: string): Promise<void> {
  const bookingDateText = await page
    .locator('text=/Booking Date/i')
    .first()
    .locator('..')
    .textContent();

  console.log('Booking Date text:', bookingDateText);
  expect(bookingDateText).toContain(expectedDate);
}

/**
 * Verify booking package contains "Sunset"
 */
async function verifyBookingPackage(page: Page): Promise<void> {
  const packageSection = page.getByText(/Booking Package/i).first();
  await expect(packageSection.locator('..')).toContainText(/sunset/i);
  console.log('Booking Package verified');
}

/**
 * Verify departure date on success page
 */
async function verifyDepartureDate(page: Page, expectedDate: string): Promise<void> {
  const departureDateText = await page
    .locator('text=/Departure Date/i')
    .first()
    .locator('..')
    .textContent();

  console.log('Departure Date text:', departureDateText);
  expect(departureDateText).toContain(expectedDate);
}

/**
 * Verify booking ID is present and has correct format
 * Booking ID is a CUID format (lowercase alphanumeric)
 */
async function verifyBookingId(page: Page): Promise<void> {
  const bookingIdElement = page.getByText(/Booking ID/i).first().locator('..');
  await expect(bookingIdElement).toContainText(
    /[a-z0-9]{24,}/  // CUID format - 24+ lowercase alphanumeric characters
  );
  console.log('Booking ID verified');
}

/**
 * Verify adult passenger count
 */
async function verifyAdultCount(page: Page, expectedCount: number = 5): Promise<void> {
  const adultCountElement = page
    .getByText(/Adult/)
    .locator('..')
    .first();
  await expect(adultCountElement).toContainText(expectedCount.toString());
  console.log(`Adult passenger count verified: ${expectedCount}`);
}
