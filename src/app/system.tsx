import {
  HiHome,
  HiBookOpen,
  HiCamera,
  HiChatAlt2,
  HiSpeakerphone,
  HiCurrencyDollar,
  HiQuestionMarkCircle,
  HiCog,
  HiBell,
} from "react-icons/hi";

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

      // --- Mandatory: Articles
      {
        label: "Article Management",
        path: "/article-management",
        icon: <HiBookOpen />,
        subs: [
          { name: "Article List", path: "/article-management" },
          { name: "Category Article", path: "/article-management/category" }
        ]
      },

      // --- Mandatory: Activities
      {
        label: "Activity Management",
        path: "/activity-management",
        icon: <HiCamera />,
        subs: [
          { name: "Activity List", path: "/activity-management/activity-list" },
          { name: "Category Activity", path: "/activity-management/category" }
        ]
      },

      // --- Content (supporting)
      {
        label: "Content",
        path: "/content",
        icon: <HiChatAlt2 />,
        subs: [
          { name: "Testimonials & Rating", path: "/content/testimonials" },
          { name: "Clients", path: "/content/clients" }
        ]
      },

      // --- Marketing & Promotion
      {
        label: "Marketing & Promotion",
        path: "/marketing",
        icon: <HiSpeakerphone />,
        subs: [
          { name: "Promotional Banners", path: "/marketing/banners" },
          { name: "Popup Management", path: "/marketing/popups" },
          { name: "Mega Menu Hooks", path: "/marketing/hooks-image" }
        ]
      },

      // --- Business Information
      {
        label: "Business Information",
        path: "/business",
        icon: <HiCurrencyDollar />,
        subs: [
          { name: "Price List", path: "/business/price-list" },
          { name: "Downloadables", path: "/business/downloads" }
        ]
      },

      // --- Optional Support
      {
        label: "Support",
        path: "/support",
        icon: <HiQuestionMarkCircle />,
        subs: [
          { name: "FAQ", path: "/support/faq" }
        ]
      }
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
      }
    ]
  }
};
