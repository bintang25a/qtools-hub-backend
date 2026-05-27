const originalStderrWrite = process.stderr.write;
process.stderr.write = function (chunk, encoding, callback) {
  const s = chunk.toString();

  if (s.includes("EBADF") || s.includes("Unhandled pty write error")) {
    return true;
  }

  return originalStderrWrite.apply(process.stderr, arguments);
};

import express from "express";
import dotenv from "dotenv";
import cors from "./config/cors.js";
import path from "path";

import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";

import AuthRoute from "./routes/AuthRoute.js";
import UserRoute from "./routes/UserRoute.js";

dotenv.config();

const app = express();
const port = process.env.APP_PORT;

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

app.use(AuthRoute);
app.use("/users", UserRoute);

httpServer.listen(port, () =>
  console.log(`Server run on http://localhost:${port}`)
);
