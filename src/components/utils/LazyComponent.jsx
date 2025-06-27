import { Suspense } from "react";
import Loading from "./Loading";
import PageLoader from "./PageLoader";
export default function LazyComponent ({ component }) {
    return(
      <Suspense fallback={<PageLoader />}>
        {component}
      </Suspense>
    )
};

// function FullScreenLoader(){
//   return (
//     <div className="bg-[#F5F5DC] h-screen w-screen flex items-center justify-center ">

//         <Loading />

//     </div>
//   )
// }