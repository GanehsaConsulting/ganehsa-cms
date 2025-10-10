import {
  HiHome,
  HiBookOpen,
  HiCamera,
  HiSpeakerphone,
  HiCurrencyDollar,
  HiCog,
  HiBell,
} from "react-icons/hi";
import { LuLogOut } from "react-icons/lu";
import { HiPhoto } from "react-icons/hi2";

export const navigationItems = {
  menu: {
    label: "Main Menu",
    contents: [
      {
        label: "Dashboard",
        path: "/",
        icon: <HiHome />,
        subs: []
      },

      {
        label: "Article",
        path: "/article",
        icon: <HiBookOpen />,
        subs: [
          { name: "Article List", path: "/article" },
          { name: "Category Article", path: "/article/category" }
        ]
      },

      {
        label: "Activity",
        path: "/activity",
        icon: <HiCamera />,
        subs: [
          { name: "Activity List", path: "/activity" },
          // { name: "Category Activity", path: "/activity/category" } 
        ]
      },

      {
        label: "Marketing & Promotion",
        path: "/marketing",
        icon: <HiSpeakerphone />,
        subs: [
          { name: "Promotional Banners", path: "/marketing" },
          { name: "Popup Image", path: "/popup" },
        ]
      },

      {
        label: "Business Information",
        path: "/business",
        icon: <HiCurrencyDollar />,
        subs: [
          { name: "Price List", path: "/price-list" },
          { name: "Testimonials & Rating", path: "/testimonials" },
          { name: "Clients", path: "/clients" },
        ]
      },
    ]
  },

  settings: {
    label: "Umum",
    contents: [
      {
        label: "Pengaturan",
        path: "/pengaturan",
        icon: <HiCog />,
        subs: []
      },
      {
        label: "Pemberitahuan",
        path: "/pemberitahuan",
        icon: <HiBell />,
        subs: []
      },
      {
        label: "Media Library",
        path: "/media-library",
        icon: <HiPhoto />,
        subs: []
      },
      {
        label: "Logout",
        path: "/login",
        icon: <LuLogOut />,
        subs: []
      }
    ]
  }
};

