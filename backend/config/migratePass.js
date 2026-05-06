import db from "./db.js";
import { hashPassword } from "../utils/hash.js";

const migrate = async () => {
    try {
        const [users] = await db.promise().query(`SELECT U_ID, Password FROM USERS`);

        for (const user of users) {
            const plain = user.Password;

            if (plain.startsWith("$2b$")) continue;

            const hashed = await hashPassword(plain);

            await db.promise().query(
                `UPDATE USERS SET Password = ? WHERE U_ID = ?`,
                [hashed, user.U_ID]
            );

            console.log(`Updated user ${user.U_ID}`);
        }

        console.log("Migration complete");
        process.exit(0);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

migrate();