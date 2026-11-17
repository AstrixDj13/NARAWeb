import React from "react";
import { useLocation } from "react-router-dom";
import LazyComponent from "../components/utils/LazyComponent";

const ProductsDetail = React.lazy(() => import("./ProductsDetail"));
const ProductPageV2 = React.lazy(() => import("./ProductPageV2"));

// Chooses the product page version. The new editorial page is the default for everyone;
// the previous page stays reachable at ?v=1 as a fallback while we watch the numbers.
export default function ProductRoute() {
  const { search } = useLocation();
  const useOld = new URLSearchParams(search).get("v") === "1";
  return <LazyComponent component={useOld ? <ProductsDetail /> : <ProductPageV2 />} />;
}
