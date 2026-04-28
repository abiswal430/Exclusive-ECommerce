import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Delete Product
  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">
        📦 Manage Products
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        {products.length === 0 ? (
          <p className="p-6 text-gray-500">No Products Found 😢</p>
        ) : (
          <table className="w-full text-center">

            {/* HEADER */}
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>

              {products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">

                  {/* IMAGE */}
                  <td className="p-3">
                    <img
                      src={`http://localhost:5000${product.image}`}
                      alt={product.name}
                      className="h-16 mx-auto object-contain"
                    />
                  </td>

                  {/* NAME */}
                  <td className="font-semibold">
                    {product.name}
                  </td>

                  {/* PRICE */}
                  <td className="text-green-600 font-bold">
                    ₹ {product.price}
                  </td>

                  {/* ACTIONS */}
                  <td className="flex justify-center gap-2 py-2">

                    {/* EDIT */}
<button
  onClick={() => navigate(`/admin/products/${product._id}`)}
  className="bg-blue-500 text-white px-3 py-1 rounded"
>
  Edit
</button>

                    {/* DELETE */}
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        )}

      </div>

    </div>
  );
}