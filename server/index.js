import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/connectDB.js";

const app = express();

const allowedOrigins = [process.env.CLIENT_URL];
const PORT = process.env.PORT || 8000;

// middlewares
app.use(express.json());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());

// API endpoints
app.get("/", (req, res) => {
  res.send("Hello world");
});

// start the server
app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
  connectDB();
});
