import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";

export default function Navbar() {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  // ✅ Load user (auto refresh on login/logout)
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    loadUser();

    // Listen for changes (important fix 🔥)
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  // ✅ Cart count
  const cartItemCount =
    cart?.reduce((total, item) => total + (item.qty || 1), 0) || 0;

  // ✅ Active link style
  const isActive = (path) =>
    location.pathname === path ? "text-blue-600 font-semibold" : "";

  return (
    <div className="flex justify-between items-center px-10 py-4 bg-white shadow-md sticky top-0 z-50">

      {/* LOGO */}
      <h1
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Exclusive
      </h1>

      {/* CENTER NAV */}
      <div className="flex gap-6 font-medium">
        <Link to="/" className={`hover:text-blue-500 ${isActive("/")}`}>
          Home
        </Link>

        <Link to="/about" className={`hover:text-blue-500 ${isActive("/about")}`}>
          About
        </Link>

        <Link to="/contact" className={`hover:text-blue-500 ${isActive("/contact")}`}>
          Contact
        </Link>

        <Link to="/orders" className={`hover:text-blue-500 ${isActive("/orders")}`}>
          Orders
        </Link>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex gap-4 items-center relative">

        {/* ✅ ADMIN DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setShowAdminMenu(!showAdminMenu)}
            className="hover:text-purple-600"
          >
            ⚙ Admin
          </button>

          {showAdminMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg">
              <Link
                to="/admin/products"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Manage Products
              </Link>

              <Link
                to="/admin/orders"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Manage Orders
              </Link>
            </div>
          )}
        </div>

        {/* CART */}
        <Link
          to="/cart"
          className={`hover:text-green-600 ${isActive("/cart")}`}
        >
          🛒 Cart ({cartItemCount})
        </Link>

        {/* USER */}
        {user ? (
          <>
            <span className="text-blue-600 font-semibold flex items-center gap-1">
              👤 {user.username}
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition">
                🔑 Login
              </button>
            </Link>

            <Link to="/register">
              <button className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition">
                👤 Register
              </button>
            </Link>
          </>
        )}

      </div>
    </div>
  );
}