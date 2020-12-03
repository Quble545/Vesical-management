import React from "react";
import $ from "jquery";

window.jQuery = $;
window.$ = $;
global.jQuery = $;

const Owners = React.lazy(() => import("./Components/Registration/owners"));
const Vesicles = React.lazy(() => import("./Components/Registration/Vesicles"));

const Users = React.lazy(() => import("./Components/Registration/users"));

const TaxForm = React.lazy(() => import("./Components/Taxes/TaxForm"));
const Tickets = React.lazy(() => import("./Components/ticket/tickets"));

const visaForm = React.lazy(() => import("./Components/visa/visaForm"));
const visas = React.lazy(() => import("./Components/visa/visas"));

const Invoices = React.lazy(() => import("./Components/Invoices/Invoices"));

const userProfile = React.lazy(() =>
  import("./Components/UserProfile/Profile")
);

const routes = [
  {
    path: "/list/owners",
    exact: true,
    name: "Owners",
    component: Owners,
  },
  {
    path: "/list/vesicles",
    exact: true,
    name: "Vesicles",
    component: Vesicles,
  },
  {
    path: "/list/users",
    exact: true,
    name: "Users",
    component: Users,
  },
  {
    path: "/taxForm/:id",
    exact: true,
    name: "Tax form",
    component: TaxForm,
  },
  {
    path: "/reports/tickets",
    exact: true,
    name: "Tickets",
    component: Tickets,
  },
  {
    path: "/visaForm/:id",
    exact: true,
    name: "Visa form",
    component: visaForm,
  },
  {
    path: "/reports/visas",
    exact: true,
    name: "Visas",
    component: visas,
  },
  {
    path: "/user/profile",
    exact: true,
    name: "Profile",
    component: userProfile,
  },
  {
    path: "/transactions/invoices",
    exact: true,
    name: "Invoices",
    component: Invoices,
  },
];

export default routes;
