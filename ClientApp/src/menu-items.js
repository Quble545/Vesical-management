const items = [
  {
    id: "Home",
    title: "Home",
    type: "group",
    icon: "icon-navigation",
    children: [
      {
        id: "dashboard",
        title: "Dashboard",
        type: "item",
        url: "/home",
        icon: "feather icon-home",
      },
    ],
  },
  {
    id: "List",
    title: "List",
    type: "group",
    icon: "icon-ui",
    children: [
      {
        id: "basic",
        title: "Registration",
        type: "collapse",
        icon: "feather icon-box",
        children: [
          {
            id: "Owners",
            title: "Owners",
            type: "item",
            url: "/list/owners",
          },
          {
            id: "Vesicles",
            title: "Vesicles",
            type: "item",
            url: "/list/vesicles",
          },
          {
            id: "User",
            title: "Users",
            type: "item",
            url: "/list/users",
          },
        ],
      },
    ],
  },
  {
    id: "travel",
    title: "Services",
    type: "group",
    icon: "icon-group",
    children: [
      {
        id: "Tax",
        title: "Tax",
        type: "item",
        url: "/taxForm/new",
        icon: "feather icon-file-text",
      },
    ],
  },
  {
    id: "Reports",
    title: "Reports",
    type: "group",
    icon: "icon-ui",
    children: [
      {
        id: "report",
        title: "Report",
        type: "collapse",
        icon: "feather icon-pie-chart",
        children: [
          {
            id: "Tickets",
            title: "Tickets",
            type: "item",
            url: "/reports/Tickets",
          },
          {
            id: "Visas",
            title: "Visas",
            type: "item",
            url: "/reports/Visas",
          },
        ],
      },
    ],
  },
];

export default {
  items,
};
