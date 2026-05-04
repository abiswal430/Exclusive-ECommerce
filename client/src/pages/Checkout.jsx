import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvv: ""
  });

  const [upi, setUpi] = useState("");
  const [bank, setBank] = useState("");

  const BASE_URL = "http://localhost:5000";

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );

  // 🚀 PLACE ORDER
  const placeOrder = async () => {
    if (!cart || cart.length === 0) {
      return alert("Cart is empty ❌");
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) {
      alert("Please login first 🔐");
      navigate("/login");
      return;
    }

    // ✅ VALIDATIONS
    if (method === "card") {
      if (!card.number || !card.expiry || !card.cvv) {
        return alert("Enter full card details ❗");
      }
    }

    if (method === "upi") {
      if (!upi.includes("@")) {
        return alert("Enter valid UPI ID ❗");
      }
    }

    if (method === "netbanking") {
      if (!bank) {
        return alert("Select a bank ❗");
      }
    }

    try {
      setLoading(true);

      // 🔥 IMPORTANT FIX (CORE ISSUE SOLVED)
      const products = cart.map(item => ({
        name: item.name,
        price: Number(item.price),
        qty: Number(item.qty || 1),
        image: item.image || "/images/default.png"
      }));

      console.log("🛒 Sending products:", products);

      const orderData = {
        userId: user._id,
        products,   // ✅ MUST be products
        total,
        paymentMethod: method,
        upi: method === "upi" ? upi : "",
        bank: method === "netbanking" ? bank : "",
        status: "Placed"
      };

      console.log("📦 Final Order:", orderData);

      const res = await axios.post(`${BASE_URL}/api/orders`, orderData);

      console.log("✅ ORDER SUCCESS:", res.data);

      alert("Payment Successful ✅");

      clearCart();
      navigate("/orders");
      navigate("/invoice", { state: { order: res.data.order } });

    } catch (err) {
      console.error("❌ ERROR:", err.response?.data || err.message);

      alert(err.response?.data?.message || "Payment Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-6 p-6 bg-gray-100 min-h-screen">

      {/* LEFT SIDE */}
      <div className="w-2/3 bg-white p-6 rounded shadow">

        <h2 className="text-xl font-bold mb-4">Complete Payment</h2>

        {/* PAYMENT OPTIONS */}
        <div className="space-y-3">
          {["card", "upi", "netbanking", "cod"].map(type => (
            <label key={type} className="block border p-3 rounded cursor-pointer">
              <input
                type="radio"
                checked={method === type}
                onChange={() => setMethod(type)}
              />
              <span className="ml-2 capitalize">
                {type === "cod" ? "Cash on Delivery" : type}
              </span>
            </label>
          ))}
        </div>

        {/* CARD */}
        {method === "card" && (
          <div className="mt-6 space-y-3">
            <input
              placeholder="Card Number"
              className="border p-2 w-full"
              value={card.number}
              onChange={(e) =>
                setCard({ ...card, number: e.target.value })
              }
            />
            <input
              placeholder="MM/YY"
              className="border p-2 w-full"
              value={card.expiry}
              onChange={(e) =>
                setCard({ ...card, expiry: e.target.value })
              }
            />
            <input
              placeholder="CVV"
              className="border p-2 w-full"
              value={card.cvv}
              onChange={(e) =>
                setCard({ ...card, cvv: e.target.value })
              }
            />
          </div>
        )}

        {/* UPI */}
        {method === "upi" && (
          <div className="mt-6">
            <input
              placeholder="example@bank"
              className="border p-2 w-full"
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
            />
          </div>
        )}

        {/* NETBANKING */}
        {method === "netbanking" && (
          <div className="mt-6">
            <select
              className="border p-2 w-full"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
            >
              <option value="">Select Bank</option>
              <option value="SBI">SBI</option>
              <option value="ICICI">ICICI</option>
              <option value="Axis">Axis</option>
              <option value="Canara">Canara</option>
              <option value="Kotak">Kotak</option>
            </select>
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={placeOrder}
          disabled={loading}
          className="bg-yellow-500 text-white px-6 py-2 mt-6 rounded w-full hover:bg-yellow-600 disabled:opacity-50"
        >
          {loading ? "Processing..." : `Pay ₹ ${total}`}
        </button>

      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/3 bg-white p-4 rounded shadow h-fit">

        <h2 className="font-bold mb-3">Price Details</h2>

        <div className="flex justify-between mb-2">
          <span>Total</span>
          <span>₹ {total}</span>
        </div>

        <div className="flex justify-between font-bold text-lg">
          <span>Amount</span>
          <span>₹ {total}</span>
        </div>

      </div>

    </div>
  );
}