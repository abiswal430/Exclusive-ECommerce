import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">

      {/* CONTENT */}
      <div className="p-10">

        {/* TITLE */}
        <h1 className="text-3xl font-semibold mb-6">
          Admin Dashboard
        </h1>

        {/* BUTTONS */}
        <div className="flex gap-4">

          {/* Manage Products */}
          <button
            onClick={() => navigate("/admin/orders")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Manage Orders
          </button>
          
          {/* View Orders */}
          <button
            onClick={() => navigate("/admin/orders")}
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
          >
            View Orders
          </button>

        </div>

      </div>

      {/* FOOTER */}
      <div className="text-center mt-20 text-gray-500">
        © 2026 - Exclusive | Built with ❤️
      </div>

    </div>
  );
}