export const getSendAdminCreateNotificationMessage = ({
  date,
  packageName,
  time,
}: {
  packageName: string;
  date: string;
  time: string;
}) => {
  return `
    📅 New Schedule Created
    Package: ${packageName}
    Date: ${date}
    Time: ${time}
    
    Schedule has been successfully added to the system.
    `;
};

export const getSendAdminBookingNotification = ({
  date,
  packageName,
  time,
}: {
  packageName: string;
  date: string;
  time: string;
}) => {
  return `
      📅 New Booking Created
      Package: ${packageName}
      Date: ${date}
      Time: ${time}
      
      Schedule has been successfully added to the system.
      `;
};

export const sendAdminBookingUpdateNotification = ({
  adultCount,
  babyCount,
  childCount,
  email,
  name,
  date,
  packageTitle,
}: {
  adultCount: number;
  babyCount: number;
  childCount: number;
  email: string;
  name: string;
  date: string;
  packageTitle: string;
}) => {
  return `
    📣 Booking Update Notification
  
    A booking update has been made with the following details:
    Date: ${date}
    Customer Information:
    - Name: ${name}
    - Email: ${email}

  

    Booking Details:
    - Package ${packageTitle}
    - Adults: ${adultCount}
    - Children: ${childCount}
    - Babies: ${babyCount}
  
    Please verify the booking and ensure that everything is in order. If any issues are detected, contact the customer promptly.
    
    This notification is intended to keep you informed about any significant updates to the bookings.
    `;
};
