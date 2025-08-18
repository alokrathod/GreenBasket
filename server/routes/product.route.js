import express from "express";

import authSeller from "../middlewares/authSeller.middleware.js";
import {
  addProduct,
  changeStock,
  getAllProducts,
  getProductById,
} from "../controllers/product.controller.js";
import { multipleUpload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/add", authSeller, multipleUpload, addProduct);
router.get("/get", getAllProducts);
router.get("/:id", getProductById);
router.post("/stock", authSeller, changeStock);

export default router;
