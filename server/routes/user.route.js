import express from "express";
import {
  checkAuthUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller";
import authUser from "../middlewares/authUser.middleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/is-auth", authUser, checkAuthUser);
router.get("/logout", authUser, logoutUser);

export default router;
