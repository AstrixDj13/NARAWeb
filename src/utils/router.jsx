import { createBrowserRouter } from "react-router-dom";
import React, { Suspense } from "react";
import App from "../App";
import ProtectedRoutes from "../components/utils/ProtectedRoutes";
import RedirectWhenLoggedIn from "../components/utils/RedirectWhenLoggedIn";
import ScrollToTop from "../components/utils/ScrollToTop";
import LazyComponent from "../components/utils/LazyComponent";


// Lazy load the components
const Home = React.lazy(() => import("../pages/Home"));
const AboutUs = React.lazy(() => import("../pages/AboutUs"));
const Login = React.lazy(() => import("../pages/Login"));
const Products = React.lazy(() => import("../pages/Products"));
const SignUp = React.lazy(() => import("../pages/SignUp"));
const Profile = React.lazy(() => import("../pages/Profile"));
const ProductsDetail = React.lazy(()=>import("../pages/ProductsDetail"));
const Orders = React.lazy(()=>import("../pages/Orders"));
const CollectionDetail = React.lazy(()=>import("../pages/CollectionDetail"));
const BehindTheScreen = React.lazy(()=>import("../pages/BehindTheScreen"));



export const router = createBrowserRouter([
  {
    path: "/",
    element: <LazyComponent component={<App />} />,
    children: [
      {
        index: true,
        element: <LazyComponent component={<Home />} />,
      },
      {
        path: "about",
        element: <LazyComponent component={<AboutUs />} />,
      },
      {
        path: "behind",
        element: <LazyComponent component={<BehindTheScreen />} />,
      },
      {
        path: "products",
        element: <LazyComponent component={<Products />} />,
      },
      {
        path: "collection",
        element: <LazyComponent component={<CollectionDetail />} />,
      },
      {
        path: "product/:id",
        element: <LazyComponent component={<ProductsDetail />} />,
      },
      {
        element: <RedirectWhenLoggedIn />,
        children: [
          {
            path: "login",
            element: <LazyComponent component={<Login />} />,
          },
          {
            path: "signup",
            element: <LazyComponent component={<SignUp />} />,
          },
        ],
      },
      {
        element: <ProtectedRoutes />,
        children: [
          {
            path: "orders",
            element: <LazyComponent component={<Orders />} />,
          },
          {
            path: "profile",
            element: <LazyComponent component={<Profile />} />,
          },
          
        ],
      },
    ],
  },
]);
