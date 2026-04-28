import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: ""
  });

  // ✅ Fetch product by ID
  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setForm(res.data))
      .catch(err => console.error(err));
  }, [id]);

  // ✅ Handle change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Update product
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, {
        name: form.name,
        price: Number(form.price),
        image: form.image
      });

      alert("Product Updated ✅");
      navigate("/admin/products");

    } catch (err) {
      console.error(err);
      alert("Update Failed ❌");
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">

        <h2 className="text-2xl font-bold mb-6">
          ✏ Edit Product
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded"
            placeholder="Name"
          />

          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            className="border p-2 rounded"
            placeholder="Price"
          />

          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            className="border p-2 rounded"
            placeholder="Image URL"
          />

          <button className="bg-blue-500 text-white p-2 rounded">
            Update Product
          </button>

        </form>

      </div>

    </div>
  );
}