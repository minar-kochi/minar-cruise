/**
 * Test Helpers Index
 * Central export point for all test utilities
 */

// Data generators
export {
  generateRandomName,
  generateRandomEmail,
  generateIndianPhoneNumber,
} from './data-generators';

// Date utilities
export {
  getFutureDateInfo,
  parseDateFromTicket,
  type DateInfo,
} from './date-utils';

// Page interactions
export {
  navigateToLandingPage,
  navigateToSunsetCruisePackage,
  selectDepartureDate,
  fillBookingForm,
  clickPayNow,
} from './page-interactions';

// Razorpay payment
export {
  completeRazorpayPayment,
} from './razorpay-payment';

// Success page verifications
export {
  verifyBookingDetails,
} from './success-page-verifications';
