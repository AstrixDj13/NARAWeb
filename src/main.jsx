import { createRoot } from "react-dom/client";
import React from "react";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/index.js";
import { router } from "./utils/router.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import ScrollToTop from "./components/utils/ScrollToTop.jsx";

createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <Provider store={store}>
      <WishlistProvider>
        <RouterProvider router={router} />
      </WishlistProvider>
    </Provider>
  </HelmetProvider>
);
