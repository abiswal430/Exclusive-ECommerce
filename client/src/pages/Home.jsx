import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");

      console.log("🔥 PRODUCTS:", res.data);
      console.log("🔥 COUNT:", res.data.length); // ✅ DEBUG

      setProducts(res.data.products || res.data); // ✅ SAFE ACCESS
    } catch (err) {
      console.error(err);
      setError("Failed to load products ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="bg-blue-100 min-h-screen py-8">

      {/* ✅ FULL WIDTH FIX */}
      <div className="w-full px-6">

        <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
          🔥 Exclusive Store
        </h2>

        {/* 🔄 LOADING */}
        {loading && (
          <p className="text-gray-600">Loading products...</p>
        )}

        {/* ❌ ERROR */}
        {error && (
          <p className="text-red-500">{error}</p>
        )}

        {/* 📦 PRODUCTS */}
        {!loading && !error && (
          <div className="min-h-[500px]">

            {/* ✅ GRID FIX (RESPONSIVE LIKE FLIPKART) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

              {products.length === 0 ? (
                <p>No Products Found 😢</p>
              ) : (
                products.map((product) => (
                  <ProductCard
                    key={product._id || product.name} // ✅ SAFE KEY FIX
                    {...product}
                  />
                ))
              )}

            </div>

          </div>
        )}

      </div>

    </div>
  );
}