import { Seo } from "@prisma/client";
import { Metadata } from "next";

// type TSeo = {
//   id: string;
//   title: string;
//   "description": string;
//   keywords: string[];
// };

// type TImageTable =  {
//     id: string;
//     "url": string;
//     altTag: string;
//   }
type TPackageJunctionTable = {
  id: string;
  packageId: string;
};

// const metda: Metadata = {

// }

// Updated TSeo type without alternateLanguages
// type TSeo = {
//   id: string;
//   title: string;
//   "description": string;
//   keywords: string[];
//   canonicalUrl: string;
//   ogTitle: string;
//   ogDescription: string;
//   ogImage: string;
//   structuredData: string; // JSON-LD as a string
//   metaRobots: string;
// };

// Complete seoSeedData for all cruise packages
export type TseoTable = Omit<Seo, "id">;
export const seoSeedData = [
  {
    id: "cm0mrtk7i00000cihba8s9ie1",
    title: "Breakfast Cruise in Cochin - Scenic Morning Voyage | Minar Cruise",
    "description":
      "Start your day with our unforgettable Breakfast Cruise in Cochin. Enjoy stunning Arabian Sea views, delicious breakfast, and family-friendly entertainment. Perfect for tourists and locals seeking a unique morning experience.",
    keywords: [
      "breakfast cruise Cochin",
      "morning cruise Kerala",
      "Arabian Sea breakfast",
      "family-friendly cruise",
      "Minar Cruise Cochin",
      "scenic voyage Kerala",
      "Cochin tourism",
    ],
    canonicalUrl: "https://minarcruise.com/packages/breakfast-cruise",
    ogTitle: "Experience the Best Breakfast Cruise in Cochin | Minar Cruise",
    ogDescription:
      "Embark on a scenic morning voyage with our Breakfast Cruise in Cochin. Enjoy gourmet breakfast, breathtaking Arabian Sea views, and entertainment for all ages. Book now for an unforgettable start to your day!",
    ogImage: "https://minarcruise.com/images/breakfast-cruise-og.jpg",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      name: "Minar Breakfast Cruise Cochin",
      "description":
        "A scenic breakfast cruise in Cochin offering gourmet breakfast, stunning Arabian Sea views, and family entertainment.",
      "url": "https://minarcruise.com/packages/breakfast-cruise",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "9.9312",
        "longitude": "76.2673",
      },
      "openingHours": "09:00-11:00",
    
    },
    metaRobots: "index, follow",
  },
  {
    id: "cm0mru9wf00010cih0tlc1ob6",
    title:
      "Luxury Lunch Cruise in Cochin - Gourmet Dining on the Arabian Sea | Minar Cruise",
    "description":
      "Indulge in our exquisite Lunch Cruise in Cochin. Savor a gourmet two-course meal while enjoying panoramic Arabian Sea views and live entertainment. The perfect midday escape for food lovers and adventure seekers.",
    keywords: [
      "lunch cruise Cochin",
      "gourmet dining cruise",
      "Arabian Sea lunch",
      "luxury cruise Kerala",
      "Minar Cruise Cochin",
      "midday cruise experience",
      "Cochin culinary tour",
    ],
    canonicalUrl: "https://minarcruise.com/packages/lunch-cruise",
    ogTitle:
      "Gourmet Lunch Cruise in Cochin | Luxury Dining at Sea | Minar Cruise",
    ogDescription:
      "Experience luxury dining on our Lunch Cruise in Cochin. Enjoy a gourmet two-course meal, stunning Arabian Sea views, and live entertainment. Book your unforgettable culinary voyage now!",
    ogImage: "https://minarcruise.com/images/lunch-cruise-og.jpg",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      name: "Minar Luxury Lunch Cruise Cochin",
      "description":
        "A luxury lunch cruise in Cochin offering gourmet two-course meals, panoramic Arabian Sea views, and live entertainment.",
      "url": "https://minarcruise.com/packages/lunch-cruise",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "9.9312",
        "longitude": "76.2673",
      },
      "openingHours": "12:00-14:00",
   
    },
    metaRobots: "index, follow",
  },
  {
    id: "cm0mrul0100020cih1olp18fb",
    title:
      "Romantic Sunset Cruise in Cochin - Twilight Magic on the Arabian Sea | Minar Cruise",
    "description":
      "Experience the enchanting beauty of a Cochin sunset on our Romantic Sunset Cruise. Enjoy breathtaking views, delicious snacks, and captivating entertainment as you sail along the picturesque Arabian Sea coastline.",
    keywords: [
      "sunset cruise Cochin",
      "romantic evening cruise",
      "Arabian Sea sunset",
      "Cochin twilight tour",
      "Minar Cruise Cochin",
      "scenic sunset voyage",
      "couples cruise Kerala",
    ],
    canonicalUrl: "https://minarcruise.com/packages/sunset-cruise",
    ogTitle:
      "Unforgettable Sunset Cruise in Cochin | Romantic Evening Sail | Minar Cruise",
    ogDescription:
      "Embark on a magical Sunset Cruise in Cochin. Witness breathtaking twilight views, enjoy delicious snacks, and experience enchanting entertainment on the Arabian Sea. Book your romantic evening now!",
    ogImage: "https://minarcruise.com/images/sunset-cruise-og.jpg",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      "name": "Minar Romantic Sunset Cruise Cochin",
      "description":
        "A romantic sunset cruise in Cochin offering breathtaking twilight views, delicious snacks, and captivating entertainment on the Arabian Sea.",
      "url": "https://minarcruise.com/packages/sunset-cruise",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "9.9312",
        "longitude": "76.2673",
      },
      "openingHours": "17:30-19:30",     
    },
    metaRobots: "index, follow",
  },
  {
    id: "cm0mruy2i00040cihe93k1sn2",

    title:
      "Exquisite Dinner Cruise in Cochin - Moonlit Dining on the Arabian Sea | Minar Cruise",
    "description":
      "Indulge in a magical evening aboard our Dinner Cruise in Cochin. Savor gourmet cuisine, dance to live music, and create unforgettable memories under the starlit sky of the Arabian Sea. Perfect for romantic dates or special celebrations.",
    keywords: [
      "dinner cruise Cochin",
      "moonlight sailing Kerala",
      "Arabian Sea dining",
      "romantic evening cruise",
      "Minar Cruise Cochin",
      "gourmet dinner sail",
      "night cruise experience",
    ],
    canonicalUrl: "https://minarcruise.com/packages/dinner-cruise",
    ogTitle:
      "Luxurious Dinner Cruise in Cochin | Moonlit Arabian Sea Dining | Minar Cruise",
    ogDescription:
      "Experience an enchanting evening on our Dinner Cruise in Cochin. Enjoy gourmet cuisine, live music, and stunning moonlit views of the Arabian Sea. Book your magical night out now!",
    ogImage: "https://minarcruise.com/images/dinner-cruise-og.jpg",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      "name": "Minar Exquisite Dinner Cruise Cochin",
      "description":
        "A luxurious dinner cruise in Cochin offering gourmet cuisine, live music, and stunning moonlit views of the Arabian Sea.",
      "url": "https://minarcruise.com/packages/dinner-cruise",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "9.9312",
        "longitude": "76.2673",
      },
      "openingHours": "20:00-22:00",
    
    },
    metaRobots: "index, follow",
  },
  {
    id: "cm0mrv8fa00050cihajxm20lc",

    title:
      "Sunset & Dinner Cruise Combo - Ultimate Cochin Evening Experience | Minar Cruise",
    "description":
      "Experience the best of Cochin's evening with our Sunset and Dinner Cruise Combo. Witness a spectacular sunset, then enjoy a sumptuous dinner and entertainment as you cruise the Arabian Sea. Ideal for couples, families, and special occasions.",
    keywords: [
      "sunset dinner cruise Cochin",
      "evening cruise package",
      "Arabian Sea sunset dining",
      "romantic cruise experience",
      "Minar Cruise Cochin",
      "special occasion cruise",
      "Cochin night tour",
    ],
    canonicalUrl: "https://minarcruise.com/packages/sunset-dinner-cruise",
    ogTitle:
      "Sunset & Dinner Cruise Combo in Cochin | Unforgettable Evening | Minar Cruise",
    ogDescription:
      "Enjoy the ultimate Cochin evening with our Sunset & Dinner Cruise Combo. Watch a spectacular sunset, savor a gourmet dinner, and experience enchanting entertainment on the Arabian Sea. Book your perfect night out now!",
    ogImage: "https://minarcruise.com/images/sunset-dinner-cruise-og.jpg",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      "name": "Minar Sunset & Dinner Cruise Combo Cochin",
      "description":
        "An ultimate evening experience in Cochin offering a spectacular sunset view, gourmet dinner, and enchanting entertainment on the Arabian Sea.",
      "url": "https://minarcruise.com/packages/sunset-dinner-cruise",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "9.9312",
        "longitude": "76.2673",
      },
      "openingHours": "17:30-20:30",
    
    },
    metaRobots: "index, follow",
  },
  {
    id: "cm0mrvg3z00060cih8p3xd9eo",

    title:
      "4-Hour Special Lunch Cruise - Extended Luxury Sailing in Cochin | Minar Cruise",
    "description":
      "Embark on our 4-Hour Special Lunch Cruise for the ultimate daytime sailing experience in Cochin. Indulge in gourmet cuisine, enjoy panoramic Arabian Sea views, and experience a variety of entertainment perfect for a leisurely afternoon.",
    keywords: [
      "4-hour lunch cruise Cochin",
      "extended day cruise",
      "luxury sailing Kerala",
      "gourmet lunch cruise",
      "Minar Cruise Cochin",
      "Arabian Sea tour",
      "premium cruise experience",
    ],
    canonicalUrl: "https://minarcruise.com/packages/special-lunch-cruise",
    ogTitle:
      "4-Hour Special Lunch Cruise in Cochin | Extended Luxury Experience | Minar Cruise",
    ogDescription:
      "Enjoy an extended 4-hour luxury lunch cruise in Cochin. Savor gourmet cuisine, take in panoramic Arabian Sea views, and experience top-notch entertainment. Book your premium daytime sailing adventure now!",
    ogImage: "https://minarcruise.com/images/special-lunch-cruise-og.jpg",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      "name": "Minar 4-Hour Special Lunch Cruise Cochin",
      "description":
        "An extended 4-hour luxury lunch cruise in Cochin offering gourmet cuisine, panoramic Arabian Sea views, and premium entertainment.",
      "url": "https://minarcruise.com/packages/special-lunch-cruise",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "9.9312",
        "longitude": "76.2673",
      },
      "openingHours": "11:00-15:00",
    },
    metaRobots: "index, follow",
  },
  {
    id: "cm0mrvnoz00070cih9mqt4r00",

    title:
      "4-Hour Deluxe Dinner Cruise - Ultimate Evening Luxury on the Arabian Sea | Minar Cruise",
    "description":
      "Indulge in our 4-Hour Deluxe Dinner Cruise for an extended evening of luxury and entertainment in Cochin. Savor fine cuisine, enjoy live performances, and dance the night away as you cruise the stunning waters of the Arabian Sea.",
    keywords: [
      "4-hour dinner cruise Cochin",
      "deluxe evening sail",
      "luxury night cruise Kerala",
      "fine dining cruise",
      "Minar Cruise Cochin",
      "Arabian Sea night tour",
      "premium evening experience",
    ],
    canonicalUrl: "https://minarcruise.com/packages/special-dinner-cruise",
    ogTitle:
      "4-Hour Deluxe Dinner Cruise in Cochin | Ultimate Luxury Evening | Minar Cruise",
    ogDescription:
      "Experience the ultimate 4-hour luxury dinner cruise in Cochin. Enjoy fine dining, live entertainment, and dancing under the stars on the Arabian Sea. Book your premium evening cruise adventure now!",
    ogImage: "https://minarcruise.com/images/special-dinner-cruise-og.jpg",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      "name": "Minar 4-Hour Deluxe Dinner Cruise Cochin",
      "description":
        "An extended 4-hour luxury dinner cruise in Cochin offering fine dining, live entertainment, and dancing under the stars on the Arabian Sea.",
      "url": "https://minarcruise.com/packages/special-dinner-cruise",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "9.9312",
        "longitude": "76.2673",
      },
      "openingHours": "17:00-21:00",
    
    
    },
    metaRobots: "index, follow",
  },
  {
    id: "cm0mrvvts00080cihgepwhcwz",

    title:
      "Exclusive Premium Cruise Packages - Tailored Luxury in Cochin | Minar Cruise",
    "description":
      "Experience unparalleled luxury with our Exclusive Premium Cruise Packages in Cochin. Enjoy personalized service, gourmet dining, and bespoke entertainment options as you sail the Arabian Sea in ultimate style and comfort.",
    keywords: [
      "exclusive cruise Cochin",
      "premium sailing package",
      "luxury cruise Kerala",
      "personalized cruise experience",
      "Minar Cruise Cochin",
      "VIP Arabian Sea tour",
      "bespoke cruise service",
    ],
    canonicalUrl: "https://minarcruise.com/packages/exclusive-packages",
    ogTitle:
      "Exclusive Premium Cruise Packages in Cochin | Tailored Luxury | Minar Cruise",
    ogDescription:
      "Indulge in the ultimate luxury with our Exclusive Premium Cruise Packages in Cochin. Enjoy personalized service, gourmet dining, and bespoke entertainment on the Arabian Sea. Book your VIP cruise experience now!",
    ogImage: "https://minarcruise.com/images/exclusive-packages-og.jpg",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      "name": "Minar Exclusive Premium Cruise Packages Cochin",
      "description":
        "Exclusive premium cruise packages in Cochin offering personalized service, gourmet dining, and bespoke entertainment options on the Arabian Sea.",
      "url": "https://minarcruise.com/packages/exclusive-packages",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "9.9312",
        "longitude": "76.2673",
      },
      "openingHours": "By Appointment",
     
    },
    metaRobots: "index, follow",
  },
  {
    id: "cm0mrw4tn000a0cih0ccrhm6w",
    title:
      "Custom Cruise Packages - Design Your Perfect Cochin Sailing Experience | Minar Cruise",
    "description":
      "Create your ideal cruise experience with our Custom Packages in Cochin. From intimate gatherings to grand celebrations, we tailor every aspect of your journey to ensure a unique and unforgettable voyage on the Arabian Sea.",
    keywords: [
      "custom cruise Cochin",
      "personalized sailing package",
      "bespoke cruise Kerala",
      "tailored cruise experience",
      "Minar Cruise Cochin",
      "Arabian Sea private tour",
      "unique cruise design",
    ],
    canonicalUrl: "https://minarcruise.com/packages/custom-packages",
    ogTitle:
      "Custom Cruise Packages in Cochin | Design Your Perfect Sail | Minar Cruise",
    ogDescription:
      "Design your perfect sailing experience with our Custom Cruise Packages in Cochin. Tailored for any occasion, from intimate gatherings to grand celebrations on the Arabian Sea. Create your unique voyage now!",
    ogImage: "https://minarcruise.com/images/custom-packages-og.jpg",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      "name": "Minar Custom Cruise Packages Cochin",
      "description":
        "Custom cruise packages in Cochin offering tailored experiences for any occasion, from intimate gatherings to grand celebrations on the Arabian Sea.",
      "url": "https://minarcruise.com/packages/custom-packages",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "9.9312",
        "longitude": "76.2673",
      },
      "openingHours": "By Appointment",
    },
    metaRobots: "index, follow",
  },
];
