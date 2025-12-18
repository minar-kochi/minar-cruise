# End-to-End Tests for Minar Cruise

This directory contains automated end-to-end tests for the Minar Cruise booking system using Playwright.

## Test Files

### `booking-flow.spec.ts`
Complete end-to-end test for the Sunset Cruise booking flow, covering:

1. **Landing Page Navigation** - Navigate to the application home page
2. **Package Selection** - Find and click on the Sunset Cruise package from the navigation menu
3. **Calendar Date Selection** - Select a departure date 5 days from today
4. **Booking Form** - Fill in customer details:
   - Random name (generated with 3-25 characters)
   - Random email (unique with timestamp)
   - Valid Indian phone number (10 digits, starts with 6-9)
   - Set 5 adult passengers
5. **Payment Processing** - Complete Razorpay test payment:
   - Wait for Razorpay modal to load
   - Handle phone number input if requested
   - Select UPI payment method
   - Enter test UPI ID
   - Click verify and pay
6. **Success Verification** - Verify the booking confirmation page displays:
   - Correct booking date (today)
   - Correct booking package (Sunset/Sunset Cruise)
   - Correct departure date (5 days from today)
   - Valid booking ID
   - Correct passenger count (5 adults)

## Setup

### Prerequisites
- Node.js and pnpm installed
- Application running on `http://localhost:3000`
- ngrok tunnel configured and running for webhook processing
- Razorpay test mode credentials configured in environment variables

### Environment Variables Required
```
NEXT_PUBLIC_RAZORPAY_KEYID=your_test_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret
```

## Running Tests

### Run all tests
```bash
pnpm exec playwright test
```

### Run specific test file
```bash
pnpm exec playwright test tests/booking-flow.spec.ts
```

### Run in headed mode (visible browser)
```bash
pnpm exec playwright test tests/booking-flow.spec.ts --headed
```

### Run in debug mode (interactive debugging)
```bash
pnpm exec playwright test tests/booking-flow.spec.ts --debug
```

### Run on specific browser
```bash
# Chromium only
pnpm exec playwright test --project=chromium

# All browsers (Firefox and Webkit commented out in config - enable when stable)
pnpm exec playwright test
```

### Run tests in UI mode (recommended for development)
```bash
pnpm exec playwright test --ui
```

## Test Configuration

Configuration is in `../playwright.config.ts`:

```typescript
{
  testDir: './tests',
  fullyParallel: false,          // Run tests sequentially (not in parallel)
  timeout: 90000,                 // 90 second timeout per test
  workers: 1,                     // Single worker to avoid DB conflicts
  retries: 1,                     // Retry failed tests once
  baseURL: 'http://localhost:3000',
  screenshot: 'only-on-failure',  // Take screenshots on test failure
  video: 'retain-on-failure',     // Record video on test failure
  trace: 'retain-on-failure',     // Keep trace for debugging
}
```

## Key Test Features

### Random Data Generation
Each test run generates unique random data to prevent conflicts:
- **Name**: Random first + last name combination
- **Email**: Unique email with timestamp suffix
- **Phone**: Valid Indian phone number (6-9 as first digit, 10 total digits)

### Date Handling
- Uses `date-fns` library for date calculations
- Departure date = Today + 5 days
- Booking date = Today
- Formats dates as `dd/MM/yyyy` to match ticket display

### Robust Selector Strategy
Uses Playwright's best practices for finding elements:
1. Role-based selectors (most stable) - `getByRole()`
2. Label/text selectors - `getByText()`
3. Placeholder selectors - `getByPlaceholder()`
4. CSS/locator selectors (fallback)

### Error Handling & Debugging
- Comprehensive logging at each step
- Screenshots on failure saved to `test-results/`
- Video recording on failure for visual debugging
- Detailed error messages with current URL context
- Timeout handling with graceful fallbacks

### Razorpay Payment Handling
The test handles the Razorpay test payment modal:
- Detects and waits for the Razorpay iframe
- Fills phone number if prompted
- Selects UPI payment method
- Enters test UPI ID (`success@razorpay`)
- Clicks verify and pay
- Waits for webhook processing and redirect (up to 60 seconds)

## Debugging Tests

### View Test Results
After a test run, Playwright generates an HTML report:
```bash
pnpm exec playwright show-report
```

### View Traces
For debugging, traces are saved when tests fail:
```bash
pnpm exec playwright show-trace test-results/[test-name]/trace.zip
```

### View Videos
Videos are recorded on failure and saved to:
```
test-results/[test-name]/video.webm
```

### Screenshots on Failure
Screenshots are automatically captured and saved to:
```
test-results/[test-name]/test-failed-*.png
```

### Debug Console Output
Each test logs important steps to console:
```bash
# Run with visible output
pnpm exec playwright test --headed --reporter=list
```

Look for logs like:
```
Test Data: {name: '...', email: '...', phone: '...'}
Clicked date 22
Form filled successfully
Found Razorpay frame
Clicked UPI payment method
Clicked pay/verify button
Successfully redirected to success page
```

## Common Issues & Solutions

### Issue: Calendar date not found
**Solution**: The test logs how many buttons it finds. Ensure the calendar is properly loaded by checking the page loads with `networkidle`.

### Issue: Razorpay modal doesn't appear
**Solution**:
- Check ReCAPTCHA is passing (may require manual intervention in sandbox)
- Verify Razorpay key is configured
- Check browser console for JavaScript errors

### Issue: Payment doesn't complete / webhook timeout
**Solution**:
- Ensure ngrok tunnel is running and configured
- Check that `/api/webhook/v2/razorpay` endpoint is accessible
- Verify webhook URL in Razorpay dashboard includes ngrok URL
- Check backend logs for webhook processing
- Test may timeout after 60 seconds; webhook might process in background

### Issue: Test passes but no booking in database
**Solution**: The test verifies the success page displays correctly, but actual booking creation depends on:
- Razorpay webhook successfully processing the `order.paid` event
- Backend database connectivity
- Email service (if enabled) not blocking the flow

### Issue: Firefox/Webkit tests fail
**Solution**: Currently only Chromium is enabled in config. Firefox and Webkit need testing with:
- Different iframe selector handling
- Different Razorpay modal rendering
- Enable them in `playwright.config.ts` after Chromium is stable

## Test Execution Flow Diagram

```
START
  ↓
1. Navigate to localhost:3000
  ↓
2. Click "Sunset Cruise" from navigation
  ↓
3. Wait for package page to load
  ↓
4. Wait for calendar
  ↓
5. Click date (5 days from today)
  ↓
6. Fill form:
   - Name
   - Email
   - Phone
   - 5 Adults
   - Accept terms
  ↓
7. Click "Pay Now"
  ↓
8. Razorpay modal loads
  ↓
9. Complete payment:
   - Phone (optional)
   - Select UPI
   - Enter UPI ID
   - Click pay
  ↓
10. Webhook processes order.paid event
  ↓
11. Redirected to /success page
  ↓
12. Verify ticket contains:
   - Correct booking date
   - Correct package name
   - Correct departure date
   - Valid booking ID
   - 5 adults
  ↓
SUCCESS / FAIL
```

## Expected Duration

- **Per test run**: 30-60 seconds
  - Navigation & loading: 5-10s
  - Form filling: 5-10s
  - Razorpay interaction: 10-20s
  - Webhook processing: 10-30s
  - Verification: 5-10s

## Future Enhancements

1. **Add test IDs** - Add `data-testid` attributes to components for more stable selectors
2. **Error scenarios** - Test invalid dates, form validation, payment failures
3. **Multiple passengers** - Test with child and infant passengers
4. **Mobile testing** - Add mobile viewport tests
5. **Multi-browser** - Expand to Firefox and Webkit after Chromium is stable
6. **Mock Razorpay** - Mock payment gateway for faster CI/CD execution
7. **Visual regression** - Add visual regression testing for ticket display
8. **Accessibility** - Add accessibility testing for form interactions

## Support & Debugging

For issues or questions:
1. Check test logs in console output
2. Review screenshots/videos in `test-results/` folder
3. Check Playwright documentation: https://playwright.dev
4. Review test code comments for logic explanation
5. Check backend logs for webhook processing issues

## Related Documentation

- **Playwright**: https://playwright.dev/docs/intro
- **date-fns**: https://date-fns.org/
- **Razorpay Test Mode**: https://razorpay.com/docs/build-integration/upi/test-mode/
- **Test Configuration**: See comments in `../playwright.config.ts`
- **Component Structure**: Check relevant component files referenced in test comments
