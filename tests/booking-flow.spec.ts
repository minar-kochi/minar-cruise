import { test } from '@playwright/test';
import {
  generateRandomName,
  generateRandomEmail,
  generateIndianPhoneNumber,
  getFutureDateInfo,
  navigateToLandingPage,
  navigateToSunsetCruisePackage,
  selectDepartureDate,
  fillBookingForm,
  clickPayNow,
  completeRazorpayPayment,
  verifyBookingDetails,
} from './helpers';
test.describe('Sunset Cruise Booking Flow', () => {
  // Set extended timeout for the entire test
  test.setTimeout(90000);

  test('complete booking flow with payment and success verification', async ({
    page,
  }) => {
    // Generate test data
    const testData = {
      name: generateRandomName(),
      email: generateRandomEmail(),
      phone: generateIndianPhoneNumber(),
    };

    const departureInfo = getFutureDateInfo(5);
    const todayInfo = getFutureDateInfo(0);

    console.log('Test Data:', {
      ...testData,
      departureDate: departureInfo.formatted,
      bookingDate: todayInfo.formatted,
    });

    // Step 1: Navigate to landing page
    await test.step('Navigate to landing page', async () => {
      await navigateToLandingPage(page);
    });

    // Step 2: Navigate to Sunset Cruise package
    await test.step('Navigate to Sunset Cruise package', async () => {
      await navigateToSunsetCruisePackage(page);
    });

    // Step 3: Select date from calendar
    await test.step('Select departure date from calendar', async () => {
      await selectDepartureDate(page, departureInfo.day, departureInfo.month);
    });

    // Step 4: Fill booking form
    await test.step('Fill booking form with passenger details', async () => {
      await fillBookingForm(page, testData.name, testData.email, testData.phone);
    });

    // Step 5: Click Pay Now button
    await test.step('Click Pay Now and wait for payment modal', async () => {
      await clickPayNow(page);
    });

    // Step 6: Handle Razorpay payment modal
    await test.step('Complete Razorpay test payment', async () => {
      await completeRazorpayPayment(page, testData.phone);
    });

    // Step 7: Verify success page and booking details
    await test.step('Verify booking details on success page', async () => {
      await verifyBookingDetails(page, departureInfo, todayInfo);
    });
  });
});
