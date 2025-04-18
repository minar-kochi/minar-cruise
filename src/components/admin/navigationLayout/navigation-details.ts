import {
  AudioWaveform,
  Command,
  Frame,
  Home,
  ImageUp,
  LineChart,
  Package,
  PieChart,
  ShipIcon,
  ShoppingCart,
  SquarePen,
} from "lucide-react";

export const sideBarData = {
  user: {
    name: "Example Name",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Minar Cruise",
      logo: ShipIcon,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      routeName: "admin",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "View dashboard",
          url: "/admin",
        },
        {
          title: "Empty",
          url: "#",
        },
        {
          title: "Empty",
          url: "#",
        },
      ],
    },
    {
      title: "Schedule",
      url: "#",
      routeName: "schedule",
      icon: ShoppingCart,
      items: [
        {
          title: "Manage schedules",
          url: "/admin/schedule",
        },
        {
          title: "View upcoming schedules",
          url: "#",
        },
        {
          title: "View previous schedules",
          url: "#",
        },
      ],
    },
    {
      title: "Bookings",
      url: "#",
      routeName: "booking",
      icon: Package,
      items: [
        {
          title: "View bookings",
          url: "/admin/booking",
        },
      ],
    },
    {
      title: "Image",
      url: "#",
      routeName: "image-uploader",
      icon: ImageUp,
      items: [
        {
          title: "Upload image",
          url: "/admin/image-uploader",
        },
      ],
    },
    {
      title: "Blogs",
      url: "#",
      routeName: "createBlog",
      icon: SquarePen,
      items: [
        {
          title: "View blogs",
          url: "/admin/blog/view",
        },
        {
          title: "Create blog",
          url: "/admin/blog/create",
        },
        {
          title: "Update blog",
          url: "#",
        },
      ],
    },
    {
      title: "Packages",
      url: "#",
      routeName: "cruise-packages",
      icon: LineChart,
      items: [
        {
          title: "View packages",
          url: "/admin/cruise-packages",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};
