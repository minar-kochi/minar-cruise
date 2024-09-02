import VercelInviteUserEmail from "@/components/services/EmailService";
import { sendConfirmationEmail } from "@/lib/helpers/CommonBuisnessHelpers";

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

    return Response.json(data);
  } catch (error) {
    return Response.json(error);
  }
}
