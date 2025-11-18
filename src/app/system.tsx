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
          { name: "Promotional Banners", path: "/marketing/promo-banner" },
          // { name: "Popup Image", path: "/popup" },
        ]
      },

      {
        label: "Business Information",
        path: "/business",
        icon: <HiCurrencyDollar />,
        subs: [
          { name: "Packages", path: "/business/packages" },
          { name: "Services", path: "/business/services" },
          { name: "Clients", path: "/business/clients" },
        ]
      },

       {
        label: "Projects",
        path: "/projects",
        icon: <HiCurrencyDollar />,
        subs: [
          { name: "Website Development", path: "/projects/website-development" },
          { name: "Social Media Management", path: "/projects/socmed-management" },
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

