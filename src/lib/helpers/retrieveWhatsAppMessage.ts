export type TSendWhatsAppBookingMessageToClient = {
  bookingId: string;
  name: string;
  email: string;
  dateOfBooking: string;
  time: string;
  packageName: string;
};
export function sendWhatsAppBookingMessageToClient({
  bookingId,
  dateOfBooking,
  email,
  name,
  time,
  packageName,
}: TSendWhatsAppBookingMessageToClient) {
  return `
    Dear ${name},
    
    Exciting news! Your booking for the Minar Cruise experience has been confirmed. 🚢✨
    
    Booking Details:
    📌 Booking ID: ${bookingId}
    🎉 Package: ${packageName}
    📅 Date: ${dateOfBooking}
    ⏰ Time: ${time}
    
    We're thrilled to have you join us for this unforgettable adventure. Your journey aboard our luxurious cruise awaits, promising breathtaking views, exceptional service, and cherished memories.
    
    Should you need any further information or have any questions, please don't hesitate to contact us. We've sent a detailed itinerary to your email address (${email}).
    
    Get ready for an extraordinary experience with Minar Cruise!
    
    Best regards,
    The Minar Cruise Team
        `;
}

export function getInvalidScheduleTemplateWhatsApp({
  ScheduleTime,
  adultCount,
  babyCount,
  childCount,
  date,
  email,
  name,
  packageTitle,
}: {
  packageTitle: string;
  date: string;
  ScheduleTime: string;
  name: string;
  email: string;
  babyCount: string;
  adultCount: string;
  childCount: string;
}) {
  return `Important: Minar Website Booking Error

A booking attempt has failed due to an invalid schedule time. This requires immediate attention.

Booking Details:
- Package: ${packageTitle}
- Date: ${date}
- Requested Schedule Time: ${ScheduleTime}

Customer Information:

- Name: ${name}
- Email: ${email}

Booking Size:
- Adults: ${adultCount}
- Children: ${childCount}
- Babies: ${babyCount}

Action Required:
Please verify the schedule time for this package and update the system accordingly. Contact the customer to resolve this issue and reschedule if necessary.

This is a critical error that prevents successful bookings. Please investigate and resolve as soon as possible.
      `;
}

export const SendAdminPackageConflictError = ({
  ExistPackage,
  ReqPackageId,
  //   amount,
  contact,
  email,
  payId,
}: {
  ReqPackageId: string;
  ExistPackage: string;
  email: string;
  contact: string;
  payId: string;
  //   amount: number;
}) => {
  return `URGENT: Package Schedule Conflict Detected

A critical error has occurred during the booking process. The scheduled time exists but is associated with a different package. This requires immediate attention and resolution.

Error Details:
- Error Code: SCHEDULE_TIME_NOT_FOUND
- Issue: Package ID mismatch for existing schedule

Booking Attempt Details:
- Requested Package ID: ${ReqPackageId}
- Conflicting Schedule Package ID: ${ExistPackage}

Customer Information:
- Email: ${email}
- Contact: ${contact}

Payment Information:
- Payment ID: ${payId}
Required Actions:
1. Immediately review the Admin Dashboard for schedule conflicts.
2. Check Razorpay for the payment status and details.
3. Contact the customer to inform them of the issue and discuss rescheduling options.
4. Investigate the root cause of the package ID mismatch in the scheduling system.
5. Resolve the conflict and update the system to prevent future occurrences.

This is a critical error that could lead to double-bookings or customer dissatisfaction. Please prioritize and resolve this issue as soon as possible.

For any questions or escalations, please contact the IT support team immediately.`;
};

export const CreateBookingFailed = ({
  orderId,
  email,
  contact,
  packageTitle,
}: {
  orderId: string;
  email: string;
  contact: string;
  packageTitle: string;
}) => {
  return `
ALERT: Booking Creation Failed
- Order ID: ${orderId}
- Customer Email: ${email}
- Customer Contact: ${contact}
- Package : ${packageTitle}
Action: Urgent review required. Check payment status and contact customer.
      `;
};

export function sendBookingFailedNotification({
  customerEmail,
  customerName,
  dateAttempted,
  packageName,
  reason,
  payId
}: {
  packageName: string;
  customerName: string;
  customerEmail: string;
  dateAttempted: string;
  reason: string;
  payId:string
}) {
  const notificationMessage = `
  🚨 Booking Failed Alert
  Package: ${packageName}
  Customer: ${customerName} (${customerEmail})
  Date Attempted: ${dateAttempted}
  razorPay paymentId: ${payId}
  Reason: ${reason}
  
  Immediate action required. Please review and contact the customer if necessary.
    `;

  // Here you would call your notification service, e.g.:
  // adminNotificationService.send(notificationMessage);

  console.log(notificationMessage);
  return notificationMessage;
}
