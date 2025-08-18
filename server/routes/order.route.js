import express from "express";
import {
  getAllOrders,
  getUserOrders,
  placeOrder,
} from "../controllers/order.controller.js";
import authSeller from "../middlewares/authSeller.middleware";
import authUser from "../middlewares/authUser.middleware";

const router = express.Router();

router.post("/cod", authUser, placeOrder);
router.get("/:userId", authUser, getUserOrders);
router.get("/seller", authSeller, getAllOrders);

export default router;
