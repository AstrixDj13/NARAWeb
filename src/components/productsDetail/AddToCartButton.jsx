export default function AddToCart(){
    const addToCartHandler = () => {
        if (!currentVariant || productOutOfStock) {
          console.log("variant is non existant at this point!");
          return;
        }
    
        if (cartId) {
          const variantId = currentVariant.node.id;
          addAnotherItemToTheCart(cartId, variantId);
        } else {
          const variantId = currentVariant.node.id;
          createCartWithOneitem(variantId);
        }
      };
    return(
        <button
        onClick={addToCartHandler}
        disabled={productOutOfStock || addingToThecart}
        className={` disabled:bg-gray-400 px-4 py-2  ${
          addingToThecart ? "bg-gray-800" : " bg-[#1F4A40]"
        }   text-white border-2 shadow-lg flex items-center justify-center gap-2`}
      >
        {addingToThecart ? (
          "Adding Item..."
        ) : (
          <>
            {" "}
            <FaPlus /> <pan>Add Item</pan>{" "}
          </>
        )}
      </button>
    )
}