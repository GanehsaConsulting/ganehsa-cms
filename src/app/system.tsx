import {
  HiHome,
  HiCurrencyDollar,
  HiCog,
  HiBell,
} from "react-icons/hi";
import { HiPhoto } from "react-icons/hi2";
import { MdBusinessCenter } from "react-icons/md";
import { TbFoldersFilled } from "react-icons/tb";

export const navigationItems = {
  menu: {
    label: "Main Menu",
    contents: [
      {
        label: "Dashboard",
        path: "/",
        icon: <HiHome />,
        subs: [],
      },
      {
        label: "Content",
        path: "/content",
        icon: <TbFoldersFilled />,
        subs: [
          { name: "Article List", path: "/content/articles" },
          { name: "Category Article", path: "/content/articles/category" },
          { name: "Activity List", path: "/content/activity" },
        ],
      },
      {
        label: "Business",
        path: "/business",
        icon: <MdBusinessCenter />,
        subs: [
          { name: "Packages", path: "/business/packages" },
          { name: "Services", path: "/business/services" },
          { name: "Clients", path: "/business/clients" },
          { name: "Promo Banner", path: "/business/promos" },
        ],
      },

      {
        label: "Projects",
        path: "/projects",
        icon: <HiCurrencyDollar />,
        subs: [
          {
            name: "Website Development",
            path: "/projects/website-development",
          },
          {
            name: "Social Media Management",
            path: "/projects/socmed-management",
          },
        ],
      },
    ],
  },

  settings: {
    label: "Umum",
    contents: [
      {
        label: "Pengaturan",
        path: "/settings",
        icon: <HiCog />,
        subs: [],
      },
      {
        label: "Pemberitahuan",
        path: "/notification",
        icon: <HiBell />,
        subs: [],
      },
      {
        label: "Media Library",
        path: "/media-library",
        icon: <HiPhoto />,
        subs: [],
      },
      // {
      //   label: "Logout",
      //   path: "/login",
      //   icon: <LuLogOut />,
      //   subs: []
      // }
    ],
  },
};
