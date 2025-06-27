
export default function Stepper({ fulfillmentStatus }) {
    return (
      <div className="font-antikor font-bold text-[10px]  flex justify-center -mt-3 ">
        {/* Order Placed */}
  
        <div className=" mt-auto mb-auto flex items-center ">
          <div className="bg-gray-200 h-[2px] w-8"></div>
          <div className="bg-[#1F4A40] dark:bg-[#ffff] border-2 border-[#1F4A40] dark:border-[#ffff] rounded-full w-2 h-2 relative">
            <span className=" absolute top-4 left-1/2 transform -translate-x-1/2">
              Order&nbsp;Placed
            </span>
          </div>
        </div>
  
        {/* In Progress */}
        <div className="mt-auto mb-auto flex items-center">
          <div className="bg-gray-200 h-[2px] w-20"></div>
          <div
            className={`border-2 ${
              fulfillmentStatus === "UNFULFILLED"
                ? "border-[#1F4A40] dark:border-[#ffff]  dark:animate-bounce"
                : "border-[#1F4A40] bg-[#1F4A40] dark:border-[#ffff] dark:bg-[#ffff]"
            } rounded-full w-2 h-2 relative`}
          >
            <span className=" absolute top-4 left-1/2 transform -translate-x-1/2">
              In&nbsp;Progress
            </span>
          </div>
        </div>
  
        {/* Shipped*/}
        <div className="mt-auto mb-auto flex items-center">
          <div className="bg-gray-200 h-[2px] w-16"></div>
          <div
            className={` border-2 ${
              fulfillmentStatus === "UNFULFILLED"
                ? "border-gray-200 bg-gray-200 dark:bg-black dark:border-black"
                : "border-[#1F4A40] bg-[#1F4A40] dark:bg-[#ffff] dark:border-[#ffff] dark:animate-bounce"
            } rounded-full w-2 h-2 relative`}
          >
            <span className=" absolute top-4 left-1/2 transform -translate-x-1/2">
              Shipped
            </span>
          </div>
        </div>
  
        {/* Shipped
        <div className="mt-auto mb-auto flex items-center">
          <div className="bg-gray-200 h-[2px] w-16"></div>
          <div className="bg-gray-200 border-2 border-gray-200 rounded-full w-2 h-2 relative">
            <span className=" absolute top-4 left-1/2 transform -translate-x-1/2">
              Delivered
            </span>
          </div>
        </div> */}
  
        {/* End*/}
        <div className="mt-auto mb-auto flex items-center">
          <div className="bg-gray-200 h-[2px] w-8"></div>
        </div>
      </div>
    );
  }
  