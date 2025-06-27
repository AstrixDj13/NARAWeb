import { useSelector } from "react-redux";
import { getAllOrders } from "../../apis/Orders";
import { useState, useEffect } from "react";
import { PiShoppingBagFill } from "react-icons/pi";
import { Link } from "react-router-dom";
import OrderItem from "./OrderItem";
export default function ContentArea() {
    const customerAccessToken = useSelector((state) => state.user.accessToken);
    const [orders, setOrders] = useState([]);
    
    const fetchAllOrders = async () => {
      try {
        let orders = await getAllOrders(customerAccessToken);
        setOrders(orders);
      } catch (error) {
        console.error(error);
      }
    };
  
  
    useEffect(() => {
      fetchAllOrders();
    }, []);
  
    return (
      <section className="flex-grow  lg:w-[calc(100vw-25%)] overflow-y-auto">
        {/* In Progress and Completed */}
        {/* <div className="bg-[#F5F5F5] p-3 font-outfit flex gap-2 justify-center items-center">
          <button className="rounded-full border-2 border-[#D8E3B1] px-2 bg-[#D8E3B1]">
            In Progress
          </button>
          <button className="border-2 px-2 border-[#C4C4C4] rounded-full">
            Completed
          </button>
        </div> */}
        {orders.length == 0 ? (
          <div className="w-full h-full flex items-center justify-center flex-col">
            <h1 className="text-2xl text-center font-outfit ">
              You have not placed any order yet!
            </h1>{" "}
            <PiShoppingBagFill className="animate-pulse" size={200} />{" "}
            <Link to={"/products"}  className="px-2 py-1 font-outfit border-2 border-black rounded-lg">
              Browse Products
            </Link>{" "}
          </div>
        ) : (
          <div className="pt-2 pb-4 pl-2 lg:pr-8 pr-8">
            {orders.reverse().map((order, index) => (
              <OrderItem
                key={index}
                processingDate={order.processingDate}
                fulfillmentStatus={order.fulfillmentStatus}
                title={order.name}
                size={order.size}
                quantity={order.quantity}
                imageSrc={order.imageUrl}
                orderId={order.orderId}
                financialStatus={order.financialStatus}
                expectedDateOfDelivery={order.expectedDateOfDelivery}
                customerUrl={order.customerUrl}
              />
            ))}
          </div>
        )}
      </section>
    );
  }