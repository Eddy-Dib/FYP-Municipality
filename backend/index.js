import express, { json } from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import citizenRoutes from "./routes/citizenRoutes.js";
import secretaryRoutes from "./routes/secretaryRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import mayorRoutes from "./routes/mayorRoutes.js"
import locationRoutes from "./routes/locationRoutes.js"
import feesRoutes from "./routes/feesRoutes.js";
import myRequestsRoutes from "./routes/myrequestsRoutes.js";
import documentRoutes from "./routes/documentRoutes.js"

const app = express();

app.use(cors());
app.use(json());
app.use("/files", express.static(process.env.DOC_ROOT));

// Routes
app.use("/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/employee", employeeRoutes);
app.use("/api/citizen", citizenRoutes);
app.use("/secretary", secretaryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/mayor", mayorRoutes)
app.use("/api", feesRoutes);
app.use("/api/mayor", mayorRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/my-requests", myRequestsRoutes);

app.use("/issued-docs", express.static(path.join(process.env.DOC_ROOT, "municipality")));

app.get("/test", (req, res) => {
    res.send("API WORKS");
});

// Start server (ONLY ONCE)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
