import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: ""
  });

  const [loading, setLoading] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  // ✅ Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setPreviewError(false); // reset image error
  };

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.image) {
      return alert("All fields are required ❗");
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/products", {
        name: form.name,
        price: Number(form.price),
        image: form.image
      });

      alert("Product Added Successfully ✅");

      // ✅ Reset form
      setForm({
        name: "",
        price: "",
        image: ""
      });

      // ✅ Redirect like .NET
      navigate("/admin/products");

    } catch (err) {
      console.error(err);
      alert("Error adding product ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow">

        <h2 className="text-2xl font-bold mb-6">
          ➕ Add Product
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* NAME */}
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          {/* PRICE */}
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          {/* IMAGE */}
          <input
            type="text"
            name="image"
            placeholder="/images/laptop.png"
            value={form.image}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          {/* ✅ IMAGE PREVIEW */}
          {form.image && !previewError && (
            <img
              src={`http://localhost:5000${form.image}`}
              alt="preview"
              className="h-32 object-contain border rounded"
              onError={() => setPreviewError(true)}
            />
          )}

          {/* ❌ ERROR MESSAGE */}
          {previewError && (
            <p className="text-red-500 text-sm">
              Image not found. Check path like /images/xyz.png
            </p>
          )}

          {/* BUTTON */}
          <button
            disabled={loading}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>

        </form>

      </div>

    </div>
  );
}