import { Suspense } from "react";
import Loading from "./Loading";

export default function LazyComponent ({ component }) {
    return(
      <Suspense fallback={<Loading />}>
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