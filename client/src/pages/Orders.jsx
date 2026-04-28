import { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/orders/${user._id}`) // ✅ FIX
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/orders/${id}`, { status });

    setOrders(prev =>
      prev.map(order =>
        order._id === id ? { ...order, status } : order
      )
    );
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">📦 My Orders</h1>

      {orders.map((order, i) =>
        order.items.map((item, idx) => {

          const status = order.status || "Placed";

          return (
            <div key={i + idx} className="bg-white p-4 mb-4 rounded shadow">

              <h3>{item.name}</h3>
              <p>₹ {item.price}</p>
              <p>Status: {status}</p>

              {status === "Placed" && (
                <button onClick={() => updateStatus(order._id, "Cancelled")}>
                  Cancel
                </button>
              )}

            </div>
          );
        })
      )}

    </div>
  );
}