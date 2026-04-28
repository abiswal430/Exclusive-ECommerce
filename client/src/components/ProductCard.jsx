import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function ProductCard({ _id, name, price, image }) {

  const { addToCart } = useContext(CartContext);

  // ✅ FIX IMAGE URL (backend → frontend)
  const imageUrl = image.startsWith("http")
    ? image
    : `http://localhost:5000${image}`;

  return (
    <div className="bg-white shadow-md rounded-xl p-4 hover:shadow-xl transition">

      {/* ✅ FIXED IMAGE */}
      <img
        src={imageUrl}
        alt={name}
        className="h-48 w-full object-contain mb-4"
        onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
      />

      <h3 className="text-lg font-semibold">{name}</h3>

      <p className="text-red-500 font-bold">₹ {price}</p>

      <button
        onClick={() =>
          addToCart({
            _id,        // ✅ IMPORTANT (for cart remove/update)
            name,
            price,
            image,
            qty: 1
          })
        }
        className="bg-black text-white w-full py-2 rounded mt-3 hover:bg-gray-800"
      >
        Add to Cart
      </button>

    </div>
  );
}