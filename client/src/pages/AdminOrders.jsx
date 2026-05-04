import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ FETCH ORDERS (SAFE)
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/orders`);
      console.log("API:", res.data);

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.orders || [];

      setOrders(data);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATE STATUS
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${BASE_URL}/api/orders/${id}`, { status });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ DELETE ORDER
  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/orders/${id}`);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">
        📊 Admin Order Management
      </h1>

      {/* LOADING */}
      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No Orders Found</p>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">

          <table className="w-full text-left">

            {/* HEADER */}
            <thead className="bg-black text-white">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Products</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {orders.map((order, index) => {

                // ✅ SUPPORT BOTH products & items
                const items = order.products || order.items || [];

                return (
                  <tr key={order._id} className="border-b">

                    {/* INDEX */}
                    <td className="p-3">{index + 1}</td>

                    {/* PRODUCTS */}
                    <td className="p-3">

                      {items.length === 0 ? (
                        <p className="text-gray-500">No items</p>
                      ) : (
                        items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 mb-2">

                            <img
                              src={`${BASE_URL}${item.image}`}
                              alt={item.name}
                              className="w-12 h-12 object-contain border"
                            />

                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-green-600 text-sm">
                                ₹ {item.price} × {item.qty || 1}
                              </p>
                            </div>

                          </div>
                        ))
                      )}

                    </td>

                    {/* TOTAL */}
                    <td className="p-3 text-green-600 font-bold">
                      ₹ {order.total}
                    </td>

                    {/* STATUS */}
                    <td className="p-3">
                      <span
                        className={`font-semibold ${
                          order.status === "Delivered"
                            ? "text-green-600"
                            : order.status === "Cancelled"
                            ? "text-red-500"
                            : "text-blue-500"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-3 flex gap-2 flex-wrap">

                      {/* SHIP */}
                      {order.status === "Placed" && (
                        <button
                          onClick={() =>
                            updateStatus(order._id, "Shipped")
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm"
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
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
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
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                        >
                          Cancel
                        </button>
                      )}

                      {/* DELETE */}
                      <button
                        onClick={() => deleteOrder(order._id)}
                        className="bg-gray-700 hover:bg-gray-800 text-white px-2 py-1 rounded text-sm"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}