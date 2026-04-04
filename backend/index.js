import express, { json } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(json());

// Sends all requests starting with /auth to authRoutes
app.use("/auth", authRoutes);

// Start server. Backup port: 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));