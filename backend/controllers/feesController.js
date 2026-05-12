import db from "../config/db.js";
import { sendSuccess, sendError } from "../utils/responses.js";

export const getCitizenFees = async (req, res) => {
    try {
        console.log("\n================ FEES DEBUG START ================");

        const userId = req.user?.id;

        console.log("🔐 USER ID FROM TOKEN:", userId);

        if (!userId) {
            console.log("❌ NO USER ID IN TOKEN");
            return sendError(res, 401, "Unauthorized", "NO_USER");
        }

        // =========================
        // 1. GET CITIZEN
        // =========================
        const [citizenRows] = await db.promise().query(
            `
            SELECT 
                c.C_ID,
                c.First_Name,
                c.Last_Name,
                c.Email,
                c.Phone_Num,
                c.Location_ID,

                l.Floor,
                l.Size,

                lt.LocT_Type,
                b.Building_Name,
                s.Street_Name,
                ci.City_Name

            FROM CITIZEN c
            LEFT JOIN LOCATION l ON c.Location_ID = l.Location_ID
            LEFT JOIN LOCATION_TYPE lt ON l.LocT_ID = lt.LocT_ID
            LEFT JOIN BUILDING b ON l.Building_ID = b.Building_ID
            LEFT JOIN STREET s ON b.Street_ID = s.Street_ID
            LEFT JOIN CITY ci ON s.City_ID = ci.City_ID

            WHERE c.U_ID = ?
            LIMIT 1
            `,
            [userId]
        );

        console.log("👤 CITIZEN ROWS:", citizenRows);

        if (!citizenRows.length) {
            console.log("❌ NO CITIZEN FOUND FOR USER:", userId);

            return sendSuccess(res, "No citizen found", {
                citizen: null,
                fees: [],
                total: 0,
                taxRate: 0
            });
        }

        const citizen = citizenRows[0];

        console.log("📍 CITIZEN LOCATION_ID:", citizen.Location_ID);

        if (!citizen.Location_ID) {
            console.log("❌ CITIZEN HAS NO LOCATION");
            return sendSuccess(res, "Citizen has no location", {
                citizen,
                fees: [],
                total: 0,
                taxRate: 0
            });
        }

        // =========================
        // 2. TAX RULE
        // =========================
        const [taxRows] = await db.promise().query(
            `
            SELECT TaxSet_Amt, TaxSet_Days_Threshold
            FROM SETTINGS_TAX
            ORDER BY TaxSet_Date DESC
            LIMIT 1
            `
        );

        const taxRate = taxRows[0]?.TaxSet_Amt || 0;
        const threshold = taxRows[0]?.TaxSet_Days_Threshold || 0;

        console.log("📊 TAX RATE:", taxRate);
        console.log("⏱ THRESHOLD DAYS:", threshold);

        // =========================
        // 3. FEES QUERY
        // =========================
        console.log("📡 FETCHING FEES FOR LOCATION:", citizen.Location_ID);

        const [fees] = await db.promise().query(
            `
            SELECT 
                f.Fee_ID,
                f.Amount,
                f.DateExpected,

                p.Pay_ID,

                l.Location_ID,
                lt.LocT_Type,
                b.Building_Name,
                s.Street_Name,
                ci.City_Name

            FROM FEE f
            LEFT JOIN PAYMENT p ON f.Fee_ID = p.Fee_ID

            JOIN LOCATION l ON f.Location_ID = l.Location_ID
            JOIN LOCATION_TYPE lt ON l.LocT_ID = lt.LocT_ID
            JOIN BUILDING b ON l.Building_ID = b.Building_ID
            JOIN STREET s ON b.Street_ID = s.Street_ID
            JOIN CITY ci ON s.City_ID = ci.City_ID

            WHERE f.Location_ID = ?
            `,
            [citizen.Location_ID]
        );

        console.log("💰 FEES FOUND:", fees.length);
        console.log("💰 RAW FEES:", fees);

        // =========================
        // 4. CALCULATIONS
        // =========================
        let total = 0;

        const formattedFees = fees.map((f) => {
            const isPaid = !!f.Pay_ID;

            const today = new Date();
            const due = new Date(f.DateExpected);

            const lateDays = Math.floor(
                (today - due) / (1000 * 60 * 60 * 24)
            );

            let lateFee = 0;

            if (!isPaid && lateDays > threshold) {
                lateFee = (Number(f.Amount) * taxRate) / 100;
            }

            const final = Number(f.Amount) + lateFee;
            total += final;

            return {
                Fee_ID: f.Fee_ID,
                Amount: Number(f.Amount),
                DateExpected: f.DateExpected,
                LateFee: lateFee,
                FinalAmount: final,
                IsPaid: isPaid,

                LocT_Type: f.LocT_Type,
                Building_Name: f.Building_Name,
                Street_Name: f.Street_Name,
                City_Name: f.City_Name
            };
        });

        console.log("✅ TOTAL CALCULATED:", total);

        console.log("================ FEES DEBUG END ================\n");

        return sendSuccess(res, "Fees loaded successfully", {
            citizen,
            fees: formattedFees,
            total,
            taxRate
        });

    } catch (err) {
        console.log("❌ FEES CONTROLLER ERROR:");
        console.log(err);

        return sendError(res, 500, "Server error", "FEES_ERROR");
    }
};