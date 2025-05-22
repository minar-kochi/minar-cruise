import { BookingConfirmationEmailForAdmin } from "@/components/services/BookingConfirmationEmailForAdmin";
import VercelInviteUserEmail from "@/components/services/EmailService";
import NewScheduleCreatedAlertEmail from "@/components/services/NewScheduleCreatedAlertEmail";
import { MIN_NEW_BOOKING_COUNT } from "@/constants/config/business";
import { sendConfirmationEmail } from "@/lib/helpers/resend";
// import { sendConfirmationEmail } from "@/lib/helpers/CommonBuisnessHelpers";

export async function POST() {
  try {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Production");
    }
    console.log("User Reached");
    let hello = VercelInviteUserEmail({
      customerName: "Customer",
      BookingId: "#12as2d158ssads",
      packageTitle: "Sunset Cruise",
      totalCount: MIN_NEW_BOOKING_COUNT,
      duration: "5:30 - 6:30",
      totalAmount: 5000,
      status: "Confirmed",
      date: "18/08/24",
    });
    // /admin/booking/gadafjgdfgsdfg
    // /admin/booking === /admin/booking/gadafjgdfgsdfg

    const data = await sendConfirmationEmail({
      fromEmail: "joggers@cochincruiseline.com",
      emailComponent: hello,
      recipientEmail: "muadpn434@gmail.com",
      emailSubject: "",
    });
    console.log(data);

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
    //     adultCount:5,
    //     childCount:2,
    //     babyCount:2
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
