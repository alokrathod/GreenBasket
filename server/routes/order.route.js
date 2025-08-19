import express from "express";
import {
  getAllOrders,
  getUserOrders,
  placeOrder,
} from "../controllers/order.controller.js";
import authSeller from "../middlewares/authSeller.middleware.js";
import authUser from "../middlewares/authUser.middleware.js";

const router = express.Router();

router.post("/cod", authUser, placeOrder);
router.get("/:userId", authUser, getUserOrders);
router.get("/seller", authSeller, getAllOrders);

export default router;
