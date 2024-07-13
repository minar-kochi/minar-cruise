import {
  Amenities,
  FoodMenu,
  Package,
  Schedule,
  User,
  Image,
  Booking,
  PackageImage,
} from "@prisma/client";

type bookingPartialId = (Omit<Booking, "id" | "createdAt"> & { id?: string })[];
type packagesPartialId = (Omit<Package, "id" | "createdAt"> & {
  id?: string;
})[];
type foodMenuPartialId = (Omit<FoodMenu, "id"> & { id?: string })[];
type schedulePartialId = (Omit<Schedule, "id"> & { id?: string })[];
type amenitiesPartialId = (Omit<Amenities, "id"> & { id?: string })[];
type userPartialId = (Omit<User, "id"> & { id?: string })[];
type imagesPartialId = (Omit<Image, "id"> & { id?: string })[];
type packageImagePartialId = (Omit<PackageImage, "id"> & { id?:string})[]

export const booking: bookingPartialId = [
  {
    numOfAdults: 3,
    numOfChildren: 5,
    packageId: "clj9r7rku0000356cql29f672",
    userId: "clj9r7rku0000356cql29f670",
  },
];

export const packages: packagesPartialId = [
  {
    id: "clj9r7rku0000356cql29f672",
    title: "Breakfast cruise",
    packageType: "normal",
    description:
      "Set out on a breakfast cruise with Minar Cruise Cochin and enjoy a chilled-out party in the Arabian sea. It is a delightful leisure activity for groups and a good option to kick-start your day in Cochin. A Breakfast cruise is a good option for those who are short of time for a full-day cruise, as it ensures you the fun of a day cruise while saving enough time for experiencing other daytime events. With Minar Breakfast Cruise you can find laugh-out-loud performances with Fun Filled entertainment. Kids get to have a blast with others their age at one of three youth spaces, while adults will find themselves thrilled with Live DJ performances",
    childPrice: 40000,
    adultPrice: 75000,
    duration: 120,
    slug: "breakfast-cruise",
    foodMenuId: "clj9r7rku0000356cql29f674",
    amenitiesId: "clj9r7rku0000356cql29f673",
    startFrom: new Date("1970-01-01T09:00:00Z"),
    endAt: new Date("1970-01-01T11:00:00Z"),
    packageCategory: "BREAKFAST"
    
  },
  {
    id: "clqqx9xhp000108l5frrkhu8h",
    title: "Lunch cruise",
    packageType: "normal",
    description:
      "Enjoy a delicious two-course lunch while we cruise through the heart of the Arabian Sea. Take time to enjoy the view and the company! A fun-filled tour down the tides would provide you with a complete and enchanting experience on the cruise deck. Our chef and waiter would compete with each other to serve you an array of both conventional and contemporary cuisines, especially with a sumptuous feast that is served. Also up on stage find laugh-out-loud performances with Fun Filled entertainment performances. Kids get to have a blast with others their age at one of three youth spaces, while adults will find themselves thrilled with Live DJ performances.",
    childPrice: 50000,
    adultPrice: 100000,
    duration: 120,
    slug: "lunch-cruise",
    foodMenuId: "clj9r7rku0000356cql29f674",
    amenitiesId: "clj9r7rku0000356cql29f673",
    startFrom: new Date("1970-01-01T12:00:00Z"),
    endAt: new Date("1970-01-01T14:00:00Z"),
    packageCategory: "LUNCH"
  },
  {
    id:"clqqxa3wq000208l5enk651jd",
    title: "sunset cruise",
    packageType: "normal",
    description:
      "Half past five in the evening starts the sunset cruise of Minar Cruise. The Sunset Cruise is an amazing 2 hours journey beginning from Marine Drive, Kochi. The vastness of the deep blue sea, undulating waves, fishing crafts focusing on the harbor, and red beautiful sky all combine to paint a rare picture of natural harmony. Our professional crew will be ready with hot teapots with crunchy snacks to serve you and the entertainment team to serve you with fun-filled entertainment performances. Kids get to have a blast with others their age at one of three youth spaces, while adults will find themselves thrilled with Live DJ performances.",
    childPrice: 40000,
    adultPrice: 75000,
    duration: 120,
    slug: "sunset-cruise",
    foodMenuId: "clj9r7rku0000356cql29f674",
    amenitiesId: "clj9r7rku0000356cql29f673",
    startFrom: new Date("1970-01-01T17:30:00Z"),
    endAt: new Date("1970-01-01T19:30:00Z"),
    packageCategory: "DINNER"
  },
  {
    id: "clqqxac8q000308l55rjn5nv8",
    title: "Dinner cruise",
    packageType: "normal",
    description:
      "The waves of the Arabian Sea are the best way to enjoy quality time with family, friends, and relatives. It is the best choice to rejuvenate your senses and feel free from the whole day’s hectic sightseeing schedule. The cruise will let you get fascinated with the hues of beauty in the surroundings along with the perfection that lies in the twilight hour. Imagine spending time with your favorite people under the moonlight and enjoying dinner along with Fun Filled entertainment and Live DJ performances.",
    childPrice: 50000,
    adultPrice: 100000,
    duration: 120,
    slug: "dinner-cruise",
    foodMenuId: "clj9r7rku0000356cql29f674",
    amenitiesId: "clj9r7rku0000356cql29f673",
    startFrom: new Date("1970-01-01T20:00:00Z"),
    endAt: new Date("1970-01-01T22:00:00Z"),
    packageCategory: "DINNER"
  },
  {
    id: "clqqxaklk000408l5cq6v8xfm",
    title: "Sunset with Dinner cruise",
    packageType: "special",
    description:
      "Half past five in the evening starts the sunset cruise of Minar Cruise. The Sunset Cruise is an amazing 2 hours journey beginning from Marine Drive, Kochi. The vastness of the deep blue sea, undulating waves, fishing crafts focusing on the harbor, and red beautiful sky all combine to paint a rare picture of natural harmony. Our professional crew will be ready with hot teapots with crunchy snacks to serve you and the entertainment team to serve you with fun-filled entertainment performances. Kids get to have a blast with others their age at one of three youth spaces, while adults will find themselves thrilled with Live DJ performances.",
    childPrice: 75000,
    adultPrice: 150000,
    duration: 180,
    slug: "sunset-with-dinner-cruise",
    foodMenuId: "clj9r7rku0000356cql29f674",
    amenitiesId: "clj9r7rku0000356cql29f673",
    startFrom: new Date("1970-01-01T17:00:00Z"),
    endAt: new Date("1970-01-01T20:30:00Z"),
    packageCategory: "DINNER"
  },
  {
    id:"clqqxasvi000508l59j1z4obt",
    title: "Special 4 Hours Lunch Cruise",
    packageType: "special",
    description:
      "Half past five in the evening starts the sunset cruise of Minar Cruise. The Sunset Cruise is an amazing 2 hours journey beginning from Marine Drive, Kochi. The vastness of the deep blue sea, undulating waves, fishing crafts focusing on the harbor, and red beautiful sky all combine to paint a rare picture of natural harmony. Our professional crew will be ready with hot teapots with crunchy snacks to serve you and the entertainment team to serve you with fun-filled entertainment performances. Kids get to have a blast with others their age at one of three youth spaces, while adults will find themselves thrilled with Live DJ performances.",
    childPrice: 75000,
    adultPrice: 150000,
    duration: 240,
    slug: "special-4-hour-lunch-cruise",
    foodMenuId: "clj9r7rku0000356cql29f674",
    amenitiesId: "clj9r7rku0000356cql29f673",
    startFrom: new Date("1970-01-01T11:00:00Z"),
    endAt: new Date("1970-01-01T15:00:00Z"),
    packageCategory: "LUNCH"
  },
  {
    id:"clqqxb1q1000608l5fdxf3lj9",
    title: "Special 4 Hours Dinner Cruise",
    packageType: "special",
    description: "",
    childPrice: 100000,
    adultPrice: 200000,
    duration: 240,
    slug: "special-4-hour-dinner-cruise",
    foodMenuId: "clj9r7rku0000356cql29f674",
    amenitiesId: "clj9r7rku0000356cql29f673",
    startFrom: new Date("1970-01-01T17:00:00Z"),
    endAt: new Date("1970-01-01T21:00:00Z"),
    packageCategory: "DINNER"
  },
  {
    id:"clqqxbb7r000708l58m9f3ry2",
    title: "Premium Packages",
    packageType: "premium",
    description: "",
    childPrice: 100000,
    adultPrice: 200000,
    duration: 240,
    slug: "premium-cruise",
    foodMenuId: "clj9r7rku0000356cql29f674",
    amenitiesId: "clj9r7rku0000356cql29f673",
    startFrom: new Date("1970-01-01T17:00:00Z"),
    endAt: new Date("1970-01-01T21:00:00Z"),
    packageCategory: "EXCLUSIVE"
  },
];

export const foodMenu: foodMenuPartialId = [
  {
    id: "clj9r7rku0000356cql29f674",
    name: "dosa",
  },
  {
    name: "biriyani",
  },
  {
    name: "snacks",
  },
  {
    name: "fried rice",
  },
  {
    name: "mandi",
  },
];

export const schedule: schedulePartialId = [
  {
    day: new Date(),
    schedulePackage: "BREAKFAST",
    scheduleStatus: "AVAILABLE",
    packageId: "clj9r7rku0000356cql29f672",
  },
];

export const amenities: amenitiesPartialId = [
  {
    id: "clj9r7rku0000356cql29f673",
    description: [
      "2 hours sea cruise ( timing 9 am - 11 am)",
      "Including Break Fast",
      "Live music performances",
      "Fun filled entertainment programs",
      "Live DJ programs",
    ],
  },
];

export const users: userPartialId = [
  {
    id: "clj9r7rku0000356cql29f670",
    name: "ramu",
    email: "ramu@gmail.com",
    contact: "3248273642",
  },
  {
    name: "monu",
    email: "monu@gmail.com",
    contact: "34985734534",
  },
];

export const image: imagesPartialId = [ 
  {
    id: "clq9z4f0b000008l57kqf2fj3",
    url: "https://cochincruiseline.com/wp-content/uploads/2023/10/lunch-cruise-4-580x450.jpg",
    alt: "",
    ImageUse: ["COMMON"]
    
  },
  {
    id: "clqqxc2ks000808l5dvjh9aub",
    url:"https://cochincruiseline.com/wp-content/uploads/2023/10/family-gathering-3-580x450.jpg", 
    alt: "",
    ImageUse: ["COMMON"]
  },
  {
    id: "clqqxc2ku000908l5gukdgasg",
    url: "https://cochincruiseline.com/wp-content/uploads/2023/07/Sunset-With-Dinner-Cruise1-580x450.jpg",
    alt: "",
    ImageUse: ["COMMON"]
  },
  {
    id: "clqqxc2kv000a08l5esk65wkm",
    url: "https://cochincruiseline.com/wp-content/uploads/2023/10/dinner-3-580x450.jpg",
    alt: "",
    ImageUse: ["COMMON"]
  },
  {
    id: "clqqxc2kw000b08l57goz4rk4",
    url: "https://cochincruiseline.com/wp-content/uploads/2023/07/Sunset-With-Dinner-Cruise2-580x450.jpg",
    alt: "",
    ImageUse: ["COMMON"]
  },
  {
    id: "clqqxc2kx000c08l59xip2bk8",
    url: "https://cochincruiseline.com/wp-content/uploads/2023/09/lunch-cruise-minar-580x450.jpg",
    alt: "",
    ImageUse: ["COMMON"]
  },
  {
    id: "clqqxc2ky000d08l57cdt3tz4",
    url: "https://cochincruiseline.com/wp-content/uploads/2023/10/dinner-9-580x450.jpg",
    alt: "",
    ImageUse: ["COMMON"]
  },
  {
    id: "clqqxc2kz000e08l5d0v553g4",
    url: "https://cochincruiseline.com/wp-content/uploads/2023/10/dinner-5-580x450.jpg",
    alt: "",
    ImageUse: ["COMMON"]
  },
  
];

export const packageImage: packageImagePartialId  = [
  {
    imageId: "clq9z4f0b000008l57kqf2fj3",
    packageId: "clj9r7rku0000356cql29f672"
  },
  {
    imageId: "clqqxc2ks000808l5dvjh9aub",
    packageId: "clqqx9xhp000108l5frrkhu8h"
  },
  {
    imageId: "clqqxc2ku000908l5gukdgasg",
    packageId: "clqqxa3wq000208l5enk651jd"
  },
  {
    imageId: "clqqxc2kv000a08l5esk65wkm",
    packageId: "clqqxac8q000308l55rjn5nv8"
  },
  {
    imageId: "clqqxc2kw000b08l57goz4rk4",
    packageId: "clqqxaklk000408l5cq6v8xfm"
  },
  {
    imageId: "clqqxc2kx000c08l59xip2bk8",
    packageId: "clqqxasvi000508l59j1z4obt"
  },
  {
    imageId: "clqqxc2ky000d08l57cdt3tz4",
    packageId: "clqqxb1q1000608l5fdxf3lj9"
  },
  {
    imageId: "clqqxc2kz000e08l5d0v553g4",
    packageId: "clqqxbb7r000708l58m9f3ry2"
  },
];


