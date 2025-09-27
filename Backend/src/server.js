// server/src/server.js
import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import progressRoutes from "./routes/progress.js";
import connectDB from "./config/db.js"; // default export assumed

dotenv.config(); // Load .env variables

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true, 
  })
);
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/progress", progressRoutes);



const PORT = process.env.PORT || 5001;

// Start server only after DB connection
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err.message);
    process.exit(1);
  });

export default app; // For testing
