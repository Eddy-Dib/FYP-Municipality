const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// login endpoint
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Please enter a Username and Password." });
    }

    try {
        const [rows] = await db.promise().query(
            `SELECT U_ID, Username, Password
     FROM USERS
     WHERE Username = ?`,
            [username]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: "Wrong username or password!" });
        }

        const user = rows[0];

        if (user.Password !== password) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        res.json({
            message: "Login successful",
            user: {
                id: user.U_ID,
                username: user.Username,
                roleId: user.Role_ID,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));