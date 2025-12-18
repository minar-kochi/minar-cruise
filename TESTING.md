# Testing Guide - Minar Cruise Booking Flow

## Quick Start

### 1. Prerequisites
Make sure you have:
- Dev server running: `pnpm run dev` (on port 3000)
- ngrok tunnel active and configured for webhooks
- Environment variables set (`.env.local` or `.env`)

### 2. Run the Booking Test

```bash
# Run test in headed mode (see the browser)
pnpm exec playwright test tests/booking-flow.spec.ts --headed

# Run test in UI mode (interactive)
pnpm exec playwright test --ui

# Run test in background (no browser window)
pnpm exec playwright test tests/booking-flow.spec.ts
```

### 3. View Results
After the test completes:
```bash
# View HTML report
pnpm exec playwright show-report

# View trace file (if test failed)
pnpm exec playwright show-trace test-results/[test-name]/trace.zip
```

## What the Test Does

The test simulates a complete user booking flow:

1. ✅ Navigate to home page
2. ✅ Find and click "Sunset Cruise" package
3. ✅ Select a date 5 days from today on the calendar
4. ✅ Fill in customer details:
   - Random name
   - Random email
   - Random Indian phone number
   - 5 adult passengers
5. ✅ Complete Razorpay test payment
6. ✅ Verify success page shows:
   - Booking date = today
   - Booking package = Sunset
   - Departure date = selected date
   - 5 adults booked

## Test Execution Time
- **Typical**: 30-60 seconds per run
- **Timeout**: 90 seconds (configurable)

## Viewing Test Output

### Console Logs
Each test run logs important steps:
```
Test Data: {name: 'John Smith', email: 'test.xyz@minar-test.com', ...}
Navigate to landing page
Clicked date 22
Form filled successfully
Found Razorpay frame
Clicked UPI payment method
Successfully redirected to success page
Ticket loaded successfully
```

### Screenshots (on failure)
Located in: `test-results/booking-flow-*/test-failed-*.png`

### Videos (on failure)
Located in: `test-results/booking-flow-*/video.webm`

### Trace Files (on failure)
Located in: `test-results/booking-flow-*/trace.zip`

## Test Configuration

All test settings are in `playwright.config.ts`:

| Setting | Value | Purpose |
|---------|-------|---------|
| `baseURL` | `http://localhost:3000` | Where tests navigate to |
| `timeout` | `90000ms` | Max time for entire test |
| `actionTimeout` | `15000ms` | Max time per action |
| `workers` | `1` | Run tests sequentially |
| `retries` | `1` | Retry failed tests once |
| `screenshot` | `only-on-failure` | Capture on failures |
| `video` | `retain-on-failure` | Record on failures |

## Common Test Issues

### ❌ Test hangs at Razorpay modal
**Cause**: Razorpay iframe isn't responding or webhook isn't processing
**Solution**:
- Verify ngrok tunnel is active: `ngrok status`
- Check Razorpay keys in environment: `echo $NEXT_PUBLIC_RAZORPAY_KEYID`
- Check browser console for JavaScript errors
- Look at backend logs for webhook errors

### ❌ Calendar date not found
**Cause**: Calendar element not properly loaded
**Solution**:
- Check if page has loaded with `networkidle`
- Review screenshot of failure to see calendar state
- Try running with `--debug` flag to pause and inspect

### ❌ Success page doesn't load
**Cause**: Webhook processing or database issue
**Solution**:
- Check backend logs for booking creation errors
- Verify database is connected and migrations are run
- Check ngrok logs for webhook delivery: `ngrok web`
- Review webhook endpoint at `/api/webhook/v2/razorpay/route.ts`

### ❌ Form fields not filling
**Cause**: Selectors don't match actual element placeholders
**Solution**:
- Run test with `--debug` to inspect form
- Check actual input placeholder values
- Update selectors in test if they changed
- Look at form component code for correct field names

## Advanced Testing

### Debug Mode (Step Through Test)
```bash
pnpm exec playwright test tests/booking-flow.spec.ts --debug
```
- Opens Playwright Inspector
- Step through code line by line
- Inspect elements in browser
- Very useful for fixing selectors

### Headed Mode (See Browser)
```bash
pnpm exec playwright test tests/booking-flow.spec.ts --headed
```
- Opens actual Chrome browser
- Watch test interact with page
- Pause with `--debug` to inspect

### Verbose Output
```bash
pnpm exec playwright test tests/booking-flow.spec.ts --reporter=list
```
- See all test steps and logs
- Includes timing for each step

### Single Retry (No automatic retries)
```bash
pnpm exec playwright test tests/booking-flow.spec.ts --retries=0
```
- Useful for local debugging
- Don't want test to auto-retry on flaky payment

## Test File Structure

```
tests/
├── booking-flow.spec.ts      ← Main test file
├── README.md                 ← Detailed testing guide
└── example.spec.ts           ← Example test (can delete)

playwright.config.ts          ← Test configuration
TESTING.md                     ← This file
```

## Key Test Data

### Generated for Each Test Run
- **Name**: Random (e.g., "John Smith")
- **Email**: Unique with timestamp (e.g., "test.xyz.1765987943508@minar-test.com")
- **Phone**: Valid Indian format (e.g., "8234567890")

### Fixed Test Data
- **Departure Date**: Always 5 days from today
- **Booking Date**: Always today
- **Package**: Sunset Cruise
- **Passengers**: 5 adults, 0 children, 0 infants
- **UPI ID**: `success@razorpay` (test mode)

## Test Assertions

The test verifies:

```javascript
// Booking Date = Today (dd/MM/yyyy format)
expect(bookingDateText).toContain('17/12/2025');

// Booking Package contains "Sunset" (case-insensitive)
expect(packageText).toContainText(/sunset/i);

// Departure Date = 5 days from today
expect(departureDateText).toContain('22/12/2025');

// Booking ID exists and has format "MNC-*"
expect(bookingIdText).toContainText(/MNC-/);

// Adult passenger count = 5
expect(adultCountText).toContainText('5');
```

## Performance Tips

1. **Local testing is faster than CI**
   - Run locally before pushing
   - ngrok adds ~1-2s latency

2. **Debug slow tests**
   - Enable video to see where delays occur
   - Check network tab in trace viewer
   - Look for long waits in backend logs

3. **Optimize timeouts**
   - Current timeouts are generous (90s)
   - Adjust if your infrastructure is slower/faster

## Continuous Integration

When running in CI:
```typescript
// playwright.config.ts
workers: process.env.CI ? 1 : 1,      // Single worker always
retries: process.env.CI ? 2 : 1,      // More retries in CI
timeout: 90000,                        // Keep generous timeout
```

## Support

If test fails:
1. **Check logs**: Look at console output for step-by-step execution
2. **Check screenshots**: Review `test-results/*/test-failed-*.png`
3. **Check videos**: Play `test-results/*/video.webm` to see interactions
4. **Check traces**: View `test-results/*/trace.zip` with playwright show-trace
5. **Check backend**: Review server logs for booking/webhook errors

## Next Steps

Once test is stable, consider:
- [ ] Add more test scenarios (payment failure, validation errors)
- [ ] Test with multiple passenger types (children, infants)
- [ ] Add tests for other packages (Breakfast, Lunch, Dinner)
- [ ] Enable Firefox and Webkit browsers
- [ ] Add mobile viewport tests
- [ ] Set up CI/CD integration (GitHub Actions, etc.)
- [ ] Add visual regression testing

## Resources

- **Playwright Docs**: https://playwright.dev
- **Test Code**: `tests/booking-flow.spec.ts`
- **Configuration**: `playwright.config.ts`
- **Test README**: `tests/README.md`
