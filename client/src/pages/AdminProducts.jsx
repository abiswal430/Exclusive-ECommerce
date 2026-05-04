import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: ""
  });

  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products`);
      setProducts(res.data.products || res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // 🗑 DELETE
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await axios.delete(`${BASE_URL}/api/products/${id}`);
    fetchProducts();
  };

  // ➕ OPEN ADD MODAL
  const openAdd = () => {
    setForm({ name: "", price: "", image: "" });
    setEditMode(false);
    setShowModal(true);
  };

  // ✏️ OPEN EDIT MODAL
  const openEdit = (product) => {
    setForm(product);
    setEditMode(true);
    setShowModal(true);
  };

  // 💾 SAVE PRODUCT
  const saveProduct = async () => {
    try {
      if (editMode) {
        await axios.put(`${BASE_URL}/api/products/${form._id}`, form);
      } else {
        await axios.post(`${BASE_URL}/api/products`, form);
      }

      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔍 SEARCH
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📦 Manage Products</h1>

        <button
          onClick={openAdd}
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
        >
          ➕ Add Product
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="🔍 Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-3 mb-4 w-full rounded shadow-sm"
      />

      {/* COUNT */}
      <p className="mb-4 text-gray-600 font-medium">
        📊 Total Products: {filtered.length}
      </p>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left">

          <thead className="bg-black text-white">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((product, index) => (
              <tr key={product._id} className="border-b hover:bg-gray-50">

                <td className="p-3">{index + 1}</td>

                <td className="p-3">
                  <img
                    src={`${BASE_URL}${product.image}`}
                    alt={product.name}
                    className="h-16 w-16 object-contain border rounded"
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/100")
                    }
                  />
                </td>

                <td className="p-3 font-semibold">{product.name}</td>

                <td className="p-3 text-green-600 font-bold">
                  ₹ {product.price}
                </td>

                <td className="p-3 flex justify-center gap-2">

                  <button
                    onClick={() => setSelected(product)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    👁 View
                  </button>

                  <button
                    onClick={() => openEdit(product)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    🗑 Delete
                  </button>

                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* 👁 VIEW MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow w-96">

            <h2 className="text-xl font-bold mb-4">👁 Product Details</h2>

            <img
              src={`${BASE_URL}${selected.image}`}
              className="w-full h-40 object-contain mb-4"
            />

            <p><b>Name:</b> {selected.name}</p>
            <p><b>Price:</b> ₹ {selected.price}</p>

            <button
              onClick={() => setSelected(null)}
              className="mt-4 bg-gray-700 text-white px-4 py-2 rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ➕ ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow w-96">

            <h2 className="text-xl font-bold mb-4">
              {editMode ? "✏️ Edit Product" : "➕ Add Product"}
            </h2>

            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border p-2 w-full mb-3 rounded"
            />

            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="border p-2 w-full mb-3 rounded"
            />

            <input
              type="text"
              placeholder="/uploads/image.jpg"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="border p-2 w-full mb-3 rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveProduct}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}