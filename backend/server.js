import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./lib/mongodb.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import messageRoute from "./routes/messageRoute.js";
import { app, server } from "./lib/socket.js";
import path from "path"

const PORT = process.env.PORT || 6000;
const __dirname = path.resolve();

app.get("/api/auth", (req, res) => {
  res.send("server running");
});

app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
    origin: "https://whatsupp-frontend.vercel.app",
    credentials: true
  }
))

app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")))
}

server.listen(PORT || 6000, (req, res) => {
  console.log(`server running on http://localhost:${PORT}/api/auth`);
  connectDB();
})