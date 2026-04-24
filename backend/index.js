import express, { json } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js"

const app = express();

app.use(cors());

app.use(json());

// Sends all requests starting with /auth to authRoutes
app.use("/auth", authRoutes);

// Requests system (citizen submissions)
app.use("/api/requests", requestRoutes);

app.get("/test", (req, res) => {
    res.send("API WORKS");
});
// Routes for handling complaints and citizen messages (stored in COMPLAINT table)
app.use("/api/complaints", complaintRoutes);
// Sends all requests starting with /employee to employeeRoutes
app.use("/employee", employeeRoutes);

// Start server. Backup port: 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

