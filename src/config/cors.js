import cors from "cors";

export default cors({
  credentials: true,
  origin: [
    "https://7418fqfm-5173.asse.devtunnels.ms",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
});
