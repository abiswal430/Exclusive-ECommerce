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

// ================= ROUTES =================
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

// ================= AUTH =================

// ✅ SIGNUP
app.post("/api/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashed
    });

    await user.save();

    res.json({ message: "Registered Successfully ✅" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login Successful ✅",
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

// ✅ CREATE ORDER (FULL FIX)
app.post("/api/orders", async (req, res) => {
  try {
    const { items, total, paymentMethod, upi, bank, userId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order ❌" });
    }

    const order = new Order({
      userId,
      items: items.map(item => ({
        name: item.name,
        price: item.price,
        qty: item.qty || 1,
        image: item.image
      })),
      total,
      paymentMethod,
      upi,
      bank,
      status: "Placed",
      date: new Date()
    });

    await order.save();

    res.json(order);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET ALL ORDERS (ADMIN)
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET USER ORDERS (🔥 IMPORTANT FIX)
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

// ✅ UPDATE ORDER STATUS
app.put("/api/orders/:id", async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

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
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted ✅" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= TEST DATA =================
app.get("/add-test", async (req, res) => {
  try {
    const Product = require("./models/Product");

    await Product.deleteMany();

    await Product.insertMany([
      { name: "Gamepad", price: 1200, image: "/images/gamepad.png" },
      { name: "Keyboard", price: 1800, image: "/images/keyboard.png" },
      { name: "Monitor", price: 15000, image: "/images/monitor.png" },
      { name: "Laptop", price: 80000, image: "/images/laptop.png" },
      { name: "Headphones", price: 2000, image: "/images/headphone.png" },
      { name: "CPU Cooler", price: 2500, image: "/images/cooler.png" },
      { name: "iPhone 14", price: 70000, image: "/images/iphone14.png" }
    ]);

    res.send("✅ Products Added Successfully");

  } catch (err) {
    res.status(500).send(err.message);
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