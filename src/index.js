import dotenv from "dotenv";
import httpServer from "./app.js";

dotenv.config();

const port = process.env.APP_PORT;

httpServer.listen(port, () =>
  console.log(`Server run on http://localhost:${port}`)
);
