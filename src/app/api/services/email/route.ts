import BookingConfirmationEmailForAdmin from "@/components/services/BookingConfirmationEmailForAdmin";
import VercelInviteUserEmail from "@/components/services/EmailService";
import NewScheduleCreatedAlertEmail from "@/components/services/NewScheduleCreatedAlertEmail";
import { sendConfirmationEmail, sendEmail } from "@/lib/helpers/resend";
// import { sendConfirmationEmail } from "@/lib/helpers/CommonBuisnessHelpers";

export async function POST() {
  try {
    const data = await sendConfirmationEmail({
      emailComponent: VercelInviteUserEmail({
        customerName: "Customer",
        BookingId: "#12as2d158ssads",
        packageTitle: "Sunset Cruise",
        totalCount: 25,
        duration: "5:30 - 6:30",
        totalAmount: 5000,
        status: "Confirmed",
        date: "18/08/24",
      }),
      recipientEmail: "amjupm3@gmail.com"
    });

    // >>>>>>>>>>> TEST FOR BOOKING CONFIRMATION <<<<<<<<<<<<<<<<<<<<<<
    // const data = await sendEmail({
    //   toEmail: "amjupm3@gmail.com",
    //   subject: "New Booking confirmation!",
    //   reactEmailComponent: BookingConfirmationEmailForAdmin({
    //     BookingId: "2544351",
    //     totalCount: 5,
    //     packageTitle: "Dinner Cruise",
    //     Name: "Amjus",
    //     email: "amsj@mailc.com",
    //     phone: "954853212",
    //     scheduleDate: "12-sep-24",
    //     totalAmount: 7820,
    //     BookingDate: "22/4/24",
    //     Duration: 120
    //   }),
    // });

    // >>>>>>>>>>> TEST FOR SCHEDULE CREATED <<<<<<<<<<<<<<<<<<<<<<

    // const packageTitle = 'sunset cruise'
    // const data = await sendEmail({
    //   toEmail: "amjupm3@gmail.com",
    //   subject: `New schedule Created for ${packageTitle}`,
    //   reactEmailComponent: NewScheduleCreatedAlertEmail({
    //     packageTitle: "Sunset cruise",
    //     scheduleDate: "12 sept 2024",
    //     fromTime: "04 sept 2024",
    //     duration: 120
    //   }),
    // });
    
    return Response.json(data);
  } catch (error) {
    return Response.json(error);
  }
}
