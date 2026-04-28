import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [method, setMethod] = useState("card");

  // 💳 Card
  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvv: ""
  });

  // 📱 UPI
  const [upi, setUpi] = useState("");

  // 🏦 Netbanking
  const [bank, setBank] = useState("");

  // 💰 Total
  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );

  // ✅ Place Order
const placeOrder = async () => {

  if (!cart || cart.length === 0) {
    return alert("Cart is empty ❌");
  }

  // 🔥 VALIDATIONS
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

    // ✅ FIX: CLEAN PRODUCT DATA
    const formattedProducts = cart.map(item => ({
      productId: item._id,
      name: item.name,
      price: item.price,
      qty: item.qty || 1,
      image: item.image
    }));

    console.log("🛒 Sending:", formattedProducts);

    await axios.post("http://localhost:5000/api/orders", {
      products: formattedProducts,
      total,
      paymentMethod: method,
      paymentDetails:
        method === "card"
          ? card
          : method === "upi"
          ? { upi }
          : method === "netbanking"
          ? { bank }
          : {}
    });

    clearCart();
    navigate("/order/success");

  } catch (err) {
    console.error("❌ ERROR:", err.response?.data || err.message);
    alert("Payment Failed ❌");
  }
};

  return (
    <div className="flex gap-6 p-6 bg-gray-100 min-h-screen">

      {/* LEFT SIDE */}
      <div className="w-2/3 bg-white p-6 rounded shadow">

        <h2 className="text-xl font-bold mb-4">
          Complete Payment
        </h2>

        {/* PAYMENT OPTIONS */}
        <div className="space-y-3">

          {/* CARD */}
          <label className="block border p-3 rounded cursor-pointer">
            <input
              type="radio"
              checked={method === "card"}
              onChange={() => setMethod("card")}
            />
            <span className="ml-2">Credit / Debit Card</span>
          </label>

          {/* UPI */}
          <label className="block border p-3 rounded cursor-pointer">
            <input
              type="radio"
              checked={method === "upi"}
              onChange={() => setMethod("upi")}
            />
            <span className="ml-2">UPI</span>
          </label>

          {/* NETBANKING */}
          <label className="block border p-3 rounded cursor-pointer">
            <input
              type="radio"
              checked={method === "netbanking"}
              onChange={() => setMethod("netbanking")}
            />
            <span className="ml-2">Net Banking</span>
          </label>

          {/* COD */}
          <label className="block border p-3 rounded cursor-pointer">
            <input
              type="radio"
              checked={method === "cod"}
              onChange={() => setMethod("cod")}
            />
            <span className="ml-2">Cash on Delivery</span>
          </label>

        </div>

        {/* ================= CARD FORM ================= */}
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

        {/* ================= UPI ================= */}
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

        {/* ================= NETBANKING ================= */}
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

        {/* PAY BUTTON */}
        <button
          onClick={placeOrder}
          className="bg-yellow-500 text-white px-6 py-2 mt-6 rounded w-full"
        >
          Pay ₹ {total}
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