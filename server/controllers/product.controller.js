import Product from "../models/product.model.js";
import cloudinary from "../config/cloudinary.js";
import getDataUri from "../config/dataURI.js";

// @desc    Add products
// @route   POST /api/product/add
export const addProduct = async (req, res) => {
  try {
    const { name, price, offerPrice, description, category } = req.body;

    // Only handle files from req.files.file
    if (
      !name ||
      !price ||
      !offerPrice ||
      !description ||
      !category ||
      !req.files ||
      !req.files.file ||
      req.files.file.length === 0
    ) {
      return res.status(400).json({
        message: "All fields including images are required",
        success: false,
      });
    }

    // Convert files to DataURIs and upload to Cloudinary
    const imageUrls = [];
    for (const file of req.files.file) {
      const dataUri = getDataUri(file).content;
      const uploadRes = await cloudinary.uploader.upload(dataUri, {
        folder: "greenbasket/products",
      });
      imageUrls.push(uploadRes.secure_url);
    }

    const product = new Product({
      name,
      price,
      offerPrice,
      description,
      category,
      image: imageUrls,
    });

    const savedProduct = await product.save();

    return res.status(201).json({
      message: "Product added successfully",
      success: true,
      product: savedProduct,
    });
  } catch (error) {
    console.log("Error in addProductController", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// @desc     get all products
// @route    GET /api/products/get
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    if (!products) {
      return res
        .status(404)
        .json({ message: "No products found", success: false });
    }
    return res
      .status(200)
      .json({ message: "All products fetched", success: true, products });
  } catch (error) {
    console.log("Error in getAllProducts controller", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// @desc    get product by ID
// @route   GET /api/product/:id
export const getProductById = async (req, res) => {
  try {
    const id = req.params();
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }

    return res
      .status(200)
      .json({ message: "Product found", success: true, product });
  } catch (error) {
    console.log("Error in getProductById controller", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// @desc    update the stock
// @route   POST /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    const product = await Product.findByIdAndUpdate(
      id,
      { inStock },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, product, message: "Stock updated successfully" });
  } catch (error) {
    console.log("Error in changeStock controller", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
