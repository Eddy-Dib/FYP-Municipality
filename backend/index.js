import express, { json } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";

const app = express();

app.use(cors());
app.use(json());

// Sends all requests starting with /auth to authRoutes
app.use("/auth", authRoutes);

// Routes for handling complaints and citizen messages (stored in COMPLAINT table)
app.use("/api/complaints", complaintRoutes);

// Start server. Backup port: 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

