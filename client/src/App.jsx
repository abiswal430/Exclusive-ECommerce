import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Main Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import EditProduct from "./pages/EditProduct";

// Cart & Orders
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import Invoice from "./pages/Invoice";

// Admin Pages
import Admin from "./pages/Admin";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import AdminDashboard from "./pages/AdminDashboard";
import ProductList from "./pages/ProductList";
import AddProduct from "./pages/AddProduct"; // ✅ ADDED

function App() {
  return (
    <CartProvider>
      <BrowserRouter>

        <div className="flex flex-col min-h-screen bg-gray-100">

          {/* NAVBAR */}
          <Navbar />

          {/* MAIN CONTENT */}
          <div className="flex-grow max-w-6xl mx-auto px-6 py-6 w-full">

            <Routes>

              {/* ================= MAIN ================= */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* ================= AUTH ================= */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* ================= CART ================= */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />

              {/* ================= USER ORDERS ================= */}
              <Route path="/order/success" element={<OrderSuccess />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/invoice" element={<Invoice />} />
              {/* ================= ADMIN ================= */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              {/* 🔥 PRODUCTS MANAGEMENT */}
              <Route path="/admin/products" element={<ProductList />} />
              <Route path="/admin/add-product" element={<AddProduct />} />
              <Route path="/admin/edit-product/:id" element={<EditProduct />} /> 

              {/* ================= 404 ================= */}
              <Route
                path="*"
                element={
                  <h1 className="text-center text-3xl font-bold mt-20">
                    404 Page Not Found ❌
                  </h1>
                }
              />

            </Routes>

          </div>

          {/* FOOTER */}
          <Footer />

        </div>

      </BrowserRouter>
    </CartProvider>
  );
}

export default App;