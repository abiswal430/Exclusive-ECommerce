import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios.get("http://localhost:5000/api/orders")
      .then(res => setOrders(res.data));
  };

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/orders/${id}`, { status });
    fetchOrders();
  };

  const deleteOrder = async (id) => {
    await axios.delete(`http://localhost:5000/api/orders/${id}`);
    fetchOrders();
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">📊 Admin Orders</h1>

      {orders.map(order =>
        order.items.map((item, i) => (

          <div key={i} className="bg-white p-4 mb-4 rounded shadow">

            <h3>{item.name}</h3>
            <p>₹ {item.price}</p>
            <p>Status: {order.status}</p>

            <button onClick={() => updateStatus(order._id, "Shipped")}>
              Ship
            </button>

            <button onClick={() => updateStatus(order._id, "Delivered")}>
              Deliver
            </button>

            <button onClick={() => deleteOrder(order._id)}>
              Delete
            </button>

          </div>

        ))
      )}

    </div>
  );
}