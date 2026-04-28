import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);

  return (
    <div className="p-10 bg-gray-100 min-h-screen text-center">

      <h1 className="text-3xl text-green-600 mb-2">
        ✅ Order Placed Successfully!
      </h1>

      <p>Your order has been placed 🎉</p>

      <div className="mt-6">
        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-4 py-2 rounded mr-4"
        >
          Go to Home
        </button>

        <button
          onClick={() => navigate("/orders")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          View Orders
        </button>
      </div>

    </div>
  );
}