import db from "../config/db.js";

export const generateFees = async (targetDate = new Date(), force = false) => {
    const today = targetDate;

    const isMonthlyRun = today.getDate() === 1;
    const isYearlyRun = today.getDate() === 1 && today.getMonth() === 0;

    if (!force && !isMonthlyRun && !isYearlyRun) {
        return;
    }

    const connection = db.promise();

    const [rules] = await connection.query(`
        SELECT *
        FROM SETTING_FEES
        WHERE Active_Flg = 1
    `);

    const [locations] = await connection.query(`
        SELECT Location_ID, LocT_ID
        FROM LOCATION
    `);

    const inserts = [];

    for (const rule of rules) {

        if (rule.Yearly_Flg === 1 && !isYearlyRun) continue;
        if (rule.Yearly_Flg === 0 && !isMonthlyRun) continue;

        for (const loc of locations) {

            if (loc.LocT_ID !== rule.LocT_ID) continue;

            const dueDate = new Date();

            if (rule.Yearly_Flg === 1) {
                dueDate.setFullYear(today.getFullYear() + 1);
            }
            else {
                dueDate.setMonth(today.getMonth() + 1);
            }

            inserts.push([
                rule.SetFee_Amt,
                dueDate,
                loc.Location_ID
            ]);
        }
    }

    if (inserts.length === 0) return;

    await connection.query(`
        INSERT INTO FEE (Amount, DateExpected, Location_ID)
        VALUES ?
    `, [inserts]);
};