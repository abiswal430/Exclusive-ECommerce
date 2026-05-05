import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const orderRes = await axios.get(`${BASE_URL}/api/orders`);
      const productRes = await axios.get(`${BASE_URL}/api/products`);

      setOrders(orderRes.data || []);
      setProducts(productRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // 💰 TOTAL REVENUE
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.total || 0),
    0
  );

  // 📊 CHART DATA
  const chartData = orders.map((o, i) => ({
    name: `Order ${i + 1}`,
    amount: o.total
  }));

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">
        📊 Admin Dashboard
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-6 mb-8">

        <div className="bg-white p-5 rounded shadow text-center">
          <h2 className="text-gray-500">Total Orders</h2>
          <p className="text-2xl font-bold">{orders.length}</p>
        </div>

        <div className="bg-white p-5 rounded shadow text-center">
          <h2 className="text-gray-500">Total Products</h2>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>

        <div className="bg-white p-5 rounded shadow text-center">
          <h2 className="text-gray-500">Revenue</h2>
          <p className="text-2xl font-bold text-green-600">
            ₹ {totalRevenue}
          </p>
        </div>

      </div>

      {/* CHART */}
      <div className="bg-white p-6 rounded shadow">

        <h2 className="text-lg font-bold mb-4">
          📈 Revenue Chart
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" />
          </BarChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
}