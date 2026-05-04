import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const {
    cart,
    savedItems,
    removeFromCart,
    saveForLater,
    moveToCart,
    removeFromSaved,
    increaseQty,
    decreaseQty,
    totalPrice
  } = useContext(CartContext);

  const navigate = useNavigate();

  return (
    <div className="flex gap-6 p-6 bg-gray-100 min-h-screen">

      {/* LEFT */}
      <div className="w-2/3">

        {/* 🛒 CART */}
        <div className="bg-white rounded shadow p-6 mb-6">

          <h2 className="text-xl font-bold mb-4">
            🛒 My Cart ({cart.length})
          </h2>

          {cart.length === 0 ? (
            <p>No items in cart 😢</p>
          ) : (
            cart.map((item, index) => (
              <div key={item._id || index} className="flex gap-4 border-b py-5">

                {/* IMAGE */}
                <img
                  src={`http://localhost:5000${item.image}`}
                  alt={item.name}
                  className="h-24 w-24 object-contain border"
                />

                {/* DETAILS */}
                <div className="flex-1">

                  <h3 className="font-semibold">{item.name}</h3>

                  <p className="text-green-600 font-bold">
                    ₹ {item.price}
                  </p>

                  {/* 🔥 QTY CONTROL */}
                  <div className="flex items-center gap-3 mt-2">

                    <button
                      onClick={() => decreaseQty(item._id)}
                      className="px-3 py-1 bg-gray-200 rounded"
                    >
                      −
                    </button>

                    <span className="font-bold">{item.qty}</span>

                    <button
                      onClick={() => increaseQty(item._id)}
                      className="px-3 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>

                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-4 mt-3 text-sm">

                    <button
                      onClick={() => saveForLater(item)}
                      className="text-blue-500 hover:underline"
                    >
                      Save for later
                    </button>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>

                  </div>

                </div>
              </div>
            ))
          )}

        </div>

        {/* 💾 SAVED ITEMS */}
        {savedItems.length > 0 && (
          <div className="bg-white rounded shadow p-6">

            <h2 className="text-xl font-bold mb-4">
              💾 Saved for Later ({savedItems.length})
            </h2>

            {savedItems.map((item, index) => (
              <div key={item._id || index} className="flex gap-4 border-b py-5">

                {/* IMAGE */}
                <img
                  src={`http://localhost:5000${item.image}`}
                  alt={item.name}
                  className="h-20 w-20 object-contain border"
                />

                {/* DETAILS */}
                <div className="flex-1">

                  <h3 className="font-semibold">{item.name}</h3>

                  <p className="text-green-600 font-bold">
                    ₹ {item.price}
                  </p>

                  {/* ACTIONS */}
                  <div className="flex gap-4 mt-2 text-sm">

                    <button
                      onClick={() => moveToCart(item)}
                      className="text-blue-500 hover:underline"
                    >
                      Move to Cart
                    </button>

                    <button
                      onClick={() => removeFromSaved(item._id)}
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>

      {/* RIGHT */}
      <div className="w-1/3 bg-white rounded shadow p-6 h-fit">

        <h2 className="font-bold mb-4">PRICE DETAILS</h2>

        <div className="flex justify-between mb-2">
          <span>Price</span>
          <span>₹ {totalPrice}</span>
        </div>

        <div className="flex justify-between mb-2 text-green-600">
          <span>Discount</span>
          <span>- ₹ 0</span>
        </div>

        <div className="flex justify-between mb-2 text-green-600">
          <span>Delivery</span>
          <span>Free</span>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between font-bold text-lg">
          <span>Total Amount</span>
          <span>₹ {totalPrice}</span>
        </div>

        <button
          onClick={() => navigate("/checkout")}
          className="bg-yellow-500 text-white w-full py-2 mt-4 rounded hover:bg-yellow-600"
        >
          Place Order
        </button>

      </div>

    </div>
  );
}