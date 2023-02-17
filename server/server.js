import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import { config } from "dotenv";
//import homeRoutes from "./routes/index.js";
import connectDB from "./config/connectDB.js";
import authRoutes from "./routes/auth.js";

config({ path: "./config/.env" });
const PORT = process.env.PORT || 3000;
const app = express();
connectDB();

app.use(cors());
app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//app.use(`/api/v1`, homeRoutes);
app.use("/api/v1/auth", authRoutes);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
