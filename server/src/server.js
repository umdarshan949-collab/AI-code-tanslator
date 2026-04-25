import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.config.js";

import cors from "cors";

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://ai-code-tanslator.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
