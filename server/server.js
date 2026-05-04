const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// ================= MIDDLEWARE =================
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// ✅ SERVE IMAGES
app.use("/images", express.static("images"));

// ================= DB =================
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/exclusive")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ DB Error:", err));

// ================= MODELS =================
const User = require("./models/User");
const Order = require("./models/Order");
const Product = require("./models/Product");

// ================= PRODUCT ROUTES =================
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

// ================= AUTH =================

// ✅ SIGNUP
app.post("/api/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required ❌" });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "User already exists ❌" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ username, password: hashed });
    await user.save();

    res.json({
      success: true,
      message: "Registration successful ✅"
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found ❌" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials ❌" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= ORDERS =================

// ✅ CREATE ORDER (🔥 FIXED)
app.post("/api/orders", async (req, res) => {
  try {
    console.log("Incoming Order Data:", req.body);

    const { products, total, paymentMethod, userId } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Cart is empty ❌" });
    }

    // ✅ CONVERT products → items (VERY IMPORTANT FIX)
    const items = products.map(p => ({
      name: p.name,
      price: p.price,
      qty: p.qty || 1,
      image: p.image
    }));

    const order = new Order({
      userId,
      items, // ✅ CORRECT FIELD
      total,
      paymentMethod,
      status: "Placed",
      date: new Date()
    });

    await order.save();

    res.json({
      success: true,
      message: "Order placed successfully ✅",
      order
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET ALL ORDERS
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET USER ORDERS
app.get("/api/orders/:userId", async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.params.userId
    }).sort({ date: -1 });

    res.json(orders);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ UPDATE STATUS
app.put("/api/orders/:id", async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Order not found ❌" });
    }

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ DELETE ORDER
app.delete("/api/orders/:id", async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Order not found ❌" });
    }

    res.json({
      success: true,
      message: "Order deleted ✅"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= HEALTH =================
app.get("/", (req, res) => {
  res.send("🚀 API Running...");
});

// ================= START =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});