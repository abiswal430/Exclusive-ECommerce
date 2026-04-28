const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/Product");


// ================= GET ALL PRODUCTS =================
// 🔥 Supports search + pagination
router.get("/", async (req, res) => {
  try {
    const { search = "", page = 1, limit = 50 } = req.query;

    const query = {
      name: { $regex: search, $options: "i" } // case-insensitive search
    };

    const products = await Product.find(query)
      .sort({ _id: -1 }) // latest first
      .limit(Number(limit))
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      count: products.length,
      total,
      products
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


// ================= GET SINGLE PRODUCT =================
router.get("/:id", async (req, res) => {
  try {
    // ✅ check valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID ❌"
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found ❌"
      });
    }

    res.json({
      success: true,
      product
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


// ================= CREATE PRODUCT =================
router.post("/", async (req, res) => {
  try {
    const { name, price, image } = req.body;

    // ✅ validation
    if (!name || !price || !image) {
      return res.status(400).json({
        success: false,
        message: "All fields required ❌"
      });
    }

    const product = new Product({
      name: name.trim(),
      price: Number(price),
      image: image.trim()
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product Added ✅",
      product
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


// ================= UPDATE PRODUCT =================
router.put("/:id", async (req, res) => {
  try {
    const { name, price, image } = req.body;

    // ✅ validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID ❌"
      });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: name?.trim(),
        price: Number(price),
        image: image?.trim()
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Product not found ❌"
      });
    }

    res.json({
      success: true,
      message: "Product Updated ✅",
      product: updated
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


// ================= DELETE PRODUCT =================
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID ❌"
      });
    }

    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found ❌"
      });
    }

    res.json({
      success: true,
      message: "Product Deleted ✅"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


module.exports = router;