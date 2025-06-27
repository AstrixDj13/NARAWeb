import { PiShoppingCartSimpleFill } from "react-icons/pi";

export default function CartToast (){
  return (
    <div className=" flex items-center justify-center gap-2 px-2 py-6 bg-[#000000A6] text-white -m-4  ">
        <PiShoppingCartSimpleFill className="text-white" size={36} />
        <h1 className="font-bold text-sm ">Added to cart successfully </h1>

    </div>
  )
}