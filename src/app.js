import express from "express";
import path from "path";
import cors from "./config/cors.js";
import { createServer } from "http";
import { Server } from "socket.io";

import AuthRoute from "./routes/AuthRoute.js";
import UserRoute from "./routes/UserRoute.js";
import AssetRoute from "./routes/AssetRoute.js";
import RepairRoute from "./routes/RepairRoute.js";
import ReportRoute from "./routes/ReportRoute.js";
import TransactionRoute from "./routes/TransactionRoute.js";
import ActionRoute from "./routes/ActionsRoute.js";

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("socketio", io);
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}!`);

  socket.on("disconnect", () => {
    console.log("User disconnected!");
  });
});

app.use(cors);
app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    const method = `[${req.method}]`;
    const status = String(res.statusCode).padStart(3);
    const time = `${duration}ms`.padStart(6);
    const url = req.originalUrl;

    console.log(`${method.padEnd(8)} | ${status} ${time} | ${url}`);
  });

  next();
});
app.use(express.urlencoded({ extended: true }));

app.use("/api", AuthRoute);
app.use("/api/users", UserRoute);
app.use("/api/assets", AssetRoute);
app.use("/api/repairs", RepairRoute);
app.use("/api/reports", ReportRoute);
app.use("/api/transactions", TransactionRoute);
app.use("/api/actions", ActionRoute);

const evidencePath = path.join(process.cwd(), "public", "evidences");
const profilePath = path.join(process.cwd(), "public", "profiles");

app.use("/uploads/evidences", express.static(evidencePath));
app.use("/uploads/profiles", express.static(profilePath));

export default httpServer;
