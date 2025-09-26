require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const progressRoutes = require("./routes/progress");

const app = express();
app.use(cors());
app.use(express.json());

connectDB(process.env.MONGO_URI || "mongodb://localhost:27017/researchnest");

app.use("/api/auth", authRoutes);
app.use("/api/progress", progressRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
