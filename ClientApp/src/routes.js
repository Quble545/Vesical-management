import React from "react";
import $ from "jquery";

window.jQuery = $;
window.$ = $;
global.jQuery = $;

const Home = React.lazy(() => import("./Components/Home/Home"));

const Owners = React.lazy(() => import("./Components/Registration/owners"));
const Vesicles = React.lazy(() => import("./Components/Registration/Vesicles"));

const Users = React.lazy(() => import("./Components/Registration/users"));

const TaxForm = React.lazy(() => import("./Components/Taxes/TaxForm"));
const Taxes = React.lazy(() => import("./Components/Taxes/Taxes"));

const userProfile = React.lazy(() =>
  import("./Components/UserProfile/Profile")
);

const routes = [
  {
    path: "/",
    exact: true,
    name: "Home",
    component: Home,
  },
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
    path: "/service/taxForm/:id",
    exact: true,
    name: "Tax",
    component: TaxForm,
  },
  {
    path: "/reports/taxes",
    exact: true,
    name: "Taxes",
    component: Taxes,
  },
  {
    path: "/user/profile/:id",
    exact: true,
    name: "Profile",
    component: userProfile,
  },
];

export default routes;
