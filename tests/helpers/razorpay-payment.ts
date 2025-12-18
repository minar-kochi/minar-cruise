/**
 * Razorpay Payment Handler
 * Handles the complex Razorpay payment flow in iframe
 */

import { Page } from '@playwright/test';

/**
 * Complete Razorpay test payment flow
 * Since Razorpay's checkout iframe is difficult to interact with in headless mode,
 * we manually trigger the webhook endpoint with a test payment payload.
 * This simulates what Razorpay does when a real payment succeeds.
 */
export async function completeRazorpayPayment(
  page: Page,
  phone: string
): Promise<void> {
  try {
    console.log('Starting Razorpay test payment flow...');

    // Extract booking details that were created in the previous step
    let bookingData = null;

    // Try to get booking data from page by intercepting TRPC response
    const bookingDataPromise = new Promise<any>((resolve) => {
      const onResponse = async (response: any) => {
        if (response.url().includes('/trpc/user.createRazorPayIntent')) {
          try {
            const data = await response.json();
            const result = Array.isArray(data) ? data[0]?.result?.data : data?.result?.data;
            if (result) {
              bookingData = result;
              console.log('Captured booking data');
            }
          } catch (e) {
            //
          }
          page.removeListener('response', onResponse);
          resolve(bookingData);
        }
      };
      page.on('response', onResponse);

      setTimeout(() => {
        page.removeListener('response', onResponse);
        resolve(null);
      }, 5000);
    });

    // Wait briefly for booking data to be captured
    await page.waitForTimeout(500);
    bookingData = await bookingDataPromise;

    console.log('Booking data available:', !!bookingData);
    if (!bookingData?.bookingId) {
      throw new Error('Could not capture booking data from Razorpay intent response');
    }

    // Close/hide the Razorpay modal
    await page.evaluate(() => {
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        const style = iframe.getAttribute('style') || '';
        if (style.includes('display') === false) {
          iframe.style.display = 'none';
        }
      });
    });

    console.log('Razorpay modal hidden');
    await page.waitForTimeout(500);

    // Now call the webhook endpoint with test payment data
    const webhookUrl = `${page.url().split('/package')[0]}/api/webhook/v2/razorpay`;
    console.log('Calling webhook endpoint:', webhookUrl);

    // Create a test payment payload that Razorpay would send
    const webhookPayload = {
      event: 'order.paid',
      created_at: Math.floor(Date.now() / 1000),
      entity: 'event',
      payload: {
        order: {
          entity: {
            id: bookingData.order.id,
            entity: 'order',
            amount: bookingData.order.amount,
            amount_paid: bookingData.order.amount,
            amount_due: 0,
            currency: 'INR',
            receipt: `receipt_${bookingData.bookingId}`,
            status: 'paid',
            attempts: 1,
            notes: bookingData.order.notes,
            created_at: Math.floor(Date.now() / 1000)
          }
        },
        payment: {
          entity: {
            id: `pay_test_${bookingData.bookingId}`,
            entity: 'payment',
            amount: bookingData.order.amount,
            currency: 'INR',
            status: 'captured',
            method: 'upi',
            description: 'test payment',
            amount_refunded: 0,
            refund_status: null,
            captured: true,
            email: bookingData.email,
            contact: bookingData.phone,
            fee: 0,
            tax: 0,
            notes: {},
            created_at: Math.floor(Date.now() / 1000)
          }
        }
      }
    };

    // Make the webhook call
    try {
      const eventId = `evt_test_${bookingData.bookingId}_${Date.now()}`;
      const webhookResponse = await page.request.post(webhookUrl, {
        headers: {
          'Content-Type': 'application/json',
          'X-Razorpay-Signature': 'test_signature_for_testing',  // Will be ignored in test mode
          'x-razorpay-event-id': eventId
        },
        data: webhookPayload
      });

      console.log('Webhook call status:', webhookResponse.status());
      const responseText = await webhookResponse.text();
      console.log('Webhook response:', responseText.substring(0, 200));

      if (!webhookResponse.ok()) {
        throw new Error(`Webhook call failed with status ${webhookResponse.status()}`);
      }
    } catch (webhookError) {
      console.error('Error calling webhook:', webhookError);
      throw new Error(`Failed to trigger webhook: ${(webhookError as Error).message}`);
    }

    // Wait for the webhook to process and database to be updated
    await page.waitForTimeout(2000);

    // Now navigate to the success page
    const successUrl = `/success?b_id=${bookingData.bookingId}&email=${encodeURIComponent(bookingData.email)}&time=${encodeURIComponent(new Date().toLocaleDateString())}`;
    console.log('Navigating to success URL:', successUrl);

    await page.goto(successUrl, { waitUntil: 'networkidle' });
    console.log('Success page loaded');

  } catch (error) {
    const currentUrl = page.url();
    console.log('Current URL at error:', currentUrl);
    try {
      await page.screenshot({ path: 'payment-error-final.png', fullPage: true });
    } catch (e) {
      console.log('Could not take screenshot');
    }
    console.error('Payment flow error:', error);
    throw error;
  }
}

