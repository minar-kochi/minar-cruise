import { Disc2, Laugh, MicVocal, SmilePlus, WandSparkles } from "lucide-react";
import { CONSTANTS } from "../data/assets";

export const fallBackImgBlur = {
  url: "/assets/Screenshot 2024-09-10 210118.png",
};

export const landingData = {
  video: CONSTANTS.HERO.LANDING_VIDEO_URL,
  heading: "MINAR CRUISE",
  title: "Best Cruise in the Arabian Sea",
  description:
    "Minar Cruise is India's largest private luxurious yacht registered under IRS (Indian Register of Shipping). It’s a sea-going vessel, perfect for unforgettable experiences on the Arabian Sea. Our beautiful cruise ship features three amazing floors. The first floor includes a completely air-conditioned banquet hall suitable for grand events. The second floor is an open area where you can enjoy a breathtaking 360-degree view of the Arabian Sea, along with an exclusive, cosy air-conditioned VIP lounge. The third floor is an open sundeck, providing even more space for fun and relaxation. Our sea-going vessel can accommodate up to 150 guests, making it perfect for memorable corporate meetings, family gatherings, birthday parties, and even beautiful wedding ceremonies. Live singers, spectacular magic performances, mentalism acts, and a vibrant DJ are all available on board. Sail on the Arabian Sea with our elegant sea-going vessel, Minar Cruise Cochin, and have experiences that will last a lifetime.",
  image: {
    url: CONSTANTS.HERO.HERO_IMAGE_URL,
    alt: CONSTANTS.HERO.HERO_IMAGE_ALT,
  },
};

export const Exclusive = {
  mainHeading: "Exclusive",
  subHeading:
    "BRING BACK YOUR MEMORIES IN OUR EXCLUSIVE MINAR CRUISE PACKAGE. ENJOY YOUR LIFE.",
  desc: "Host unforgettable events on our exclusive cruises, perfect for get-togethers, birthday parties, weddings, corporate meetings, and pre-wedding celebrations. Enjoy stunning sunsets, entertainment, and top-notch service on the Arabian Sea",
  video1: {
    url: CONSTANTS.EXCLUSIVE.PACKAGE_VIDEO_URL,
  },
};

export const BookingData = {
  mainHeading: "Why Choose ",
  subHeading:
    "Be it a cool DJ party with your friends and colleagues or a laid-back family vacation, now you can enjoy in the open sea with Minar",
  bgImage: {
    url: `url("/assets/sea2.gif")`,
    alt: "Booking image background",
  },
  boatImage: {
    url: "/assets/minar.png",
    alt: "Booking image background",
  },
  features: [
    {
      icon: CONSTANTS.WHY_CHOOSE.BOAT_ICON,
      iconClass: "",
      heading: "Certified & Safe",
      description:
        "Minar Cruise is Kerala’s first private luxury yacht registered under the Indian Register of Shipping (IRS), ensuring top safety and professional service.",
    },
    {
      icon: CONSTANTS.WHY_CHOOSE.CALENDER_ICON,
      iconClass: "",
      heading: "Seamless Online Booking",
      description:
        "Book your cruise instantly through our user-friendly online system or connect with our team for personalized assistance.",
    },
    {
      icon: CONSTANTS.WHY_CHOOSE.WALLET_ICON,
      iconClass: "",
      heading: "Best Price Guarantee",
      description:
        "Enjoy the best cruise experience at the most competitive rates, with transparent pricing and no hidden costs.",
    },
    {
      icon: CONSTANTS.WHY_CHOOSE.PEOPLE_ICON,
      iconClass: "",
      heading: "Customizable Events",
      description:
        "From weddings and birthdays to corporate meetings and private celebrations, we offer tailored experiences to suit every occasion.",
    },
    {
      icon: CONSTANTS.WHY_CHOOSE.TICK_ICON,
      iconClass: "",
      heading: "Unmatched Safety Standards",
      description:
        "Our vessel is equipped with top-tier life-saving gear and adheres to international maritime safety regulations.",
    },
  ],
};

export const star = {
  url: "/assets/Star.png",
};

export const facilities = {
  description: [
    {
      icon: CONSTANTS.FACILITIES.IRS_ICON,
      heading: "IRS Registered",
      description:
        "Kerala's first private cruise yacht registered under Indian Register of Shipping.",
    },
    {
      icon: CONSTANTS.FACILITIES.CUSTOM_ICON,
      heading: "Custom Packages",
      description:
        "Tailored cruise experiences to match your specific needs and preferences.",
    },
    {
      icon: CONSTANTS.FACILITIES.WHEELCHAIR_ICON,
      heading: "Wheelchair Accessible",
      description:
        "Easy access for guests with mobility needs for a comfortable journey.",
    },
    // {
    //   icon: ShieldIcon,
    //   heading: "Premium Sound System",
    //   description: "Enjoy high-quality audio with our top-tier sound system.",
    // },
    // {
    //   icon: ShieldIcon,
    //   heading: "A/C Lounge",
    //   description:
    //     "Relax in a private, air-conditioned lounge for added luxury.",
    // },
    // {
    //   icon: ShieldIcon,
    //   heading: "Entertainment & Dining",
    //   description:
    //     "Onboard entertainment paired with delicious food of your choice.",
    // },
    {
      icon: CONSTANTS.FACILITIES.EVENT_ICON,
      heading: "Event Hosting",
      description:
        "Perfect for weddings, birthdays, corporate events, and celebrations.",
    },
    {
      icon: CONSTANTS.FACILITIES.CELEBRATION_ICON,
      heading: "Celebration",
      description:
        "A/c hall for marriage, wedding anniversary, birthday, corporate meetings",
    },
    {
      icon: CONSTANTS.FACILITIES.FOOD_ICON,
      heading: "Food",
      description: "Food counter facility",
    },
    {
      icon: CONSTANTS.FACILITIES.SAFETY_ICON,
      heading: "Safety First",
      description:
        "Equipped with life-saving gear and firefighting equipment up to international standards.",
    },
    {
      icon: CONSTANTS.FACILITIES.CREW_ICON,
      heading: "Crew",
      description: "Trained and professional crew for assistance",
    },
    // {
    //   icon: "/assets/minarfeature/messages-2.svg",
    //   heading: "Ideal",
    //   description: "Ideal for business meetings…",
    // },
  ],
};

export const entertainment = {
  image: {
    url: "/assets/nightPhoto.jpg",
    logo: "https://utfs.io/f/Lnh9TIEe6BHcwNVwPbOvUADJTVQk9uEoMClNfbOpWawhBy5q",
  },
  activities: [
    { description: "Live DJ performance", icon: Disc2 },
    { description: "Live Karaoke singers", icon: MicVocal },
    { description: "Mimicry show", icon: SmilePlus },
    { description: "Magic Show", icon: WandSparkles },
    { description: "Fun filled programs", icon: Laugh },
  ],
};

export const services = {
  heading: "Minar Cruise Events ",
  subHeading: "PLAN YOUR EXPERIENCE",

  bgVid: CONSTANTS.EVENTS.VIDEO_URL,

  description: [
    "Are you looking for an unforgettable and exciting experience for your special event or organization’s next corporate retreat?",
    "If you’re ready to explore all the exciting possibilities of charter cruising, contact us at:",
  ],
  contact: ["+91 8089021666", "+91 8089031666"],
  events: [
    {
      image: CONSTANTS.EVENTS.FAMILY_IMAGE_URL,
      alt: CONSTANTS.EVENTS.FAMILY_IMAGE_ALT,
      title: "Family Gathering",
      description:
        "Planning a family reunion? Minar Cochin Cruise offer a fun-filled vacation with your loved ones.",
    },
    {
      image: CONSTANTS.EVENTS.CELEBRATION_IMAGE_URL,
      alt: CONSTANTS.EVENTS.CELEBRATION_IMAGE_ALT,
      title: "Celebration Events",
      description:
        "Celebrate your Wedding, Anniversaries, Birthdays and other memorable events with the best celebration cruise.",
    },
    {
      image: CONSTANTS.EVENTS.CORPORATE_IMAGE_URL,
      alt: CONSTANTS.EVENTS.CORPORATE_IMAGE_ALT,
      title: "Corporate Events",
      description:
        "We have the perfect space for corporate meetings and your business needs on our luxury cruise.",
    },
  ],
};

export const galleryImageUrl = [
  { url: CONSTANTS.GALLERY.IMG_1_URL, alt: CONSTANTS.GALLERY.IMG_1_ALT },
  { url: CONSTANTS.GALLERY.IMG_2_URL, alt: CONSTANTS.GALLERY.IMG_2_ALT },
  { url: CONSTANTS.GALLERY.IMG_3_URL, alt: CONSTANTS.GALLERY.IMG_3_ALT },
  { url: CONSTANTS.GALLERY.IMG_4_URL, alt: CONSTANTS.GALLERY.IMG_4_ALT },
  { url: CONSTANTS.GALLERY.IMG_5_URL, alt: CONSTANTS.GALLERY.IMG_5_ALT },
  { url: CONSTANTS.GALLERY.IMG_6_URL, alt: CONSTANTS.GALLERY.IMG_6_ALT },
  { url: CONSTANTS.GALLERY.IMG_7_URL, alt: CONSTANTS.GALLERY.IMG_7_ALT },
  { url: CONSTANTS.GALLERY.IMG_8_URL, alt: CONSTANTS.GALLERY.IMG_8_ALT },
];

export const footer = {
  image: "https://utfs.io/f/Lnh9TIEe6BHcUrCcf7WNbKLTVg5knvAfD8pQYay0m4qERxcX",
  contact: ["+91 8089021666", "+91 8089061444"],
  email: "info@cochincruiseline.com",
  address:
    "GF, 40/6185, Swapnil Enclave, Highcourt junction, Marine Drive, Ernakulam, Kerala, India, 682031",
  socials: [
    {
      name: "Minar Facebook Url",
      icon: "/assets/Social/facebook.svg",
      url: "https://www.facebook.com/minar.touristcochin/",
    },
    {
      name: "Minar Instagram Url",
      icon: "/assets/Social/instagram.svg",
      url: "https://www.instagram.com/minarcruisecochin",
    },
    {
      name: "Minar Whatsapp Url",
      icon: "/assets/Social/whatsapp.svg",
      url: "https://api.whatsapp.com/send?phone=917034191993",
    },
  ],
};
