import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  <button
  onClick={() =>
    navigate("/invoice", { state: { order } })
  }
  className="bg-purple-600 text-white px-3 py-1 rounded"
>
  Invoice
</button>

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const BASE_URL = "http://localhost:5000";

  // ✅ FETCH ORDERS
  useEffect(() => {
    if (!user?._id) {
      navigate("/login");
      return;
    }

    axios
      .get(`${BASE_URL}/api/orders/${user._id}`)
      .then(res => {
        console.log("Orders:", res.data);

        // ✅ Handle both formats safely
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.orders || [];

        setOrders(data);
      })
      .catch(err => {
        console.error("Order fetch error:", err);
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // ✅ UPDATE STATUS
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${BASE_URL}/api/orders/${id}`, { status });

      setOrders(prev =>
        prev.map(order =>
          order._id === id ? { ...order, status } : order
        )
      );
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">📦 My Orders</h1>

      {/* ✅ LOADING */}
      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No Orders Found 😢</p>
      ) : (
        orders.map((order, i) => {

          // ✅ SUPPORT BOTH (IMPORTANT FIX)
          const items = order.products || order.items || [];

          return (
            <div key={order._id} className="mb-6 shadow rounded">

              {/* HEADER */}
              <div className="bg-gray-200 p-3 flex justify-between font-semibold rounded-t">
                <span>Order #{i + 1}</span>
                <span>Status: {order.status || "Placed"}</span>
              </div>

              {/* PRODUCTS */}
              {items.length === 0 ? (
                <div className="bg-white p-4">
                  No items in this order
                </div>
              ) : (
                items.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 border-b flex justify-between items-center"
                  >
                    {/* LEFT SIDE */}
                    <div className="flex gap-4 items-center">

                      <img
                        src={`${BASE_URL}${item.image}`}
                        alt={item.name}
                        className="w-20 h-20 object-contain border rounded"
                      />

                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-green-600">
                          ₹ {item.price} × {item.qty || 1}
                        </p>
                      </div>

                    </div>

                    {/* RIGHT SIDE ACTIONS */}
                    <div className="flex gap-2">

                      {/* SHIP */}
                      {order.status === "Placed" && (
                        <button
                          onClick={() =>
                            updateStatus(order._id, "Shipped")
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Ship
                        </button>
                      )}

                      {/* DELIVER */}
                      {order.status === "Shipped" && (
                        <button
                          onClick={() =>
                            updateStatus(order._id, "Delivered")
                          }
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Deliver
                        </button>
                      )}

                      {/* CANCEL */}
                      {(order.status === "Placed" ||
                        order.status === "Shipped") && (
                        <button
                          onClick={() =>
                            updateStatus(order._id, "Cancelled")
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      )}

                    </div>
                  </div>
                ))
              )}

              {/* TOTAL */}
              <div className="bg-white p-4 text-right font-bold rounded-b">
                Total: ₹ {order.total}
              </div>

            </div>
          );
        })
      )}

    </div>
  );
}