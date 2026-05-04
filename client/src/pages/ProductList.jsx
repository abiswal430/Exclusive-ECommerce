import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");

      console.log("🔥 API RESPONSE:", res.data);

      // ✅ FIX HERE
      setProducts(res.data.products);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">
        📦 Manage Products
      </h1>

      <div className="bg-white rounded shadow p-4">

        {products.length === 0 ? (
          <p>No Products Found</p>
        ) : (
          <table className="w-full text-center">
            <thead>
              <tr className="bg-gray-200">
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b">
                  <td>
                    <img
                      src={`http://localhost:5000${p.image}`}
                      className="h-16 mx-auto"
                    />
                  </td>
                  <td>{p.name}</td>
                  <td className="text-green-600">₹ {p.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

    </div>
  );
}