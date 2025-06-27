import Stepper from "./Stepper";

export default function OrderItem({
  title,
  customerUrl,
  processingDate,
  fulfillmentStatus,
  financialStatus,
  expectedDateOfDelivery,
  size,
  quantity,
  imageSrc,
  orderId,
}) {
  return (
    <div>
      {/* Order Item */}
      <div className="flex lg:flex-row flex-wrap gap-12 lg:gap-2  justify-around  p-4  lg:justify-between  border-b-2 border-gray-200 pb-4">
        {/* image and order id section */}

        <div className="flex flex-row lg:gap-2 justify-between gap-4 ">
          <div className="w-[100px] h-[106px] ">
            <img
              title="image"
              className="object-cover w-full h-full"
              src={imageSrc}
              alt=""
            />
          </div>
          {/* Information */}

          <div className="flex flex-col justify-between ">
            <div className="flex gap-2">
              <span className="bg-[#D8E3B1] px-2 py-1 font-bold text-xs dark:text-black">
                {fulfillmentStatus === "UNFULFILLED"
                  ? "In Progress"
                  : "Shipped"}
              </span>
              <span className="bg-[#F5F5F5] dark:bg-black dark:border-2 dark:border-[#ffff] px-2 py-1 font-bold  text-xs">
                {" "}
                {financialStatus}
              </span>
            </div>

            <div className="font-antikor flex flex-col gap-2 ">
              <h1 className="font-black text-md tracking-tighter">
                Order ID: #{orderId}
              </h1>
              <h2 className="text-xs tracking-tighter font-bold">{title}</h2>

              <div className="flex items-center text-xs ">
                <span className=" border-r-2 border-r-black pr-4">
                  Quantity: <strong>{quantity}</strong>
                </span>
                <span className="pl-4">
                  Size: <strong>{size}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Progress */}
        <Stepper fulfillmentStatus={fulfillmentStatus} />
        {/* Action Section */}

        <div className="flex flex-col gap-2 justify-center items-end w-full xl:w-auto ">
          {fulfillmentStatus === "UNFULFILLED" ? null : (
            <a
              href={customerUrl}
              target="_blank"
              className="border-2 border-black dark:!border-[#ffff] px-4 py-2 font-black rounded-lg cursor-pointer font-outfit"
            >
              Track / Return
            </a>
          )}
          <div className="flex xl:flex-col justify-between  w-full xl:w-auto xl:text-right text-xs tracking-tighter">
            <span>
              Order date:{" "}
              <strong className="whitespace-nowrap">{processingDate}</strong>
            </span>
            <span>
              Expected Delivery date:{" "}
              <strong className="whitespace-nowrap">
                {expectedDateOfDelivery}
              </strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
