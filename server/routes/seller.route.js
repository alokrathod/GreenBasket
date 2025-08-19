import express from "express";
import {
  checkAuthSeller,
  loginSeller,
  logoutSeller,
} from "../controllers/seller.controller.js";
import authSeller from "../middlewares/authSeller.middleware.js";

const router = express.Router();

router.post("/login", loginSeller);
router.get("/is-auth", authSeller, checkAuthSeller);
router.get("/logout", authSeller, logoutSeller);

export default router;
