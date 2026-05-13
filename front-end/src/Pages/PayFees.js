import styles from "./PayFees.module.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

function PayFees() {

    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    const [citizen, setCitizen] = useState(null);
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);

    const printRef = useRef();

    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/api/citizen/fees`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = res.data?.data;

            setCitizen(data?.citizen || null);
            setFees(data?.fees || []);

        } catch (err) {
            console.log(err);

            setCitizen(null);
            setFees([]);

        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-GB");

    const getTotal = () => {
        return fees.reduce((sum, f) => sum + Number(f.FinalAmount || 0), 0);
    };

    const handlePrint = () => {
        const content = printRef.current;

        const printWindow = window.open("", "", "width=900,height=650");

        printWindow.document.write(`
            <html>
                <head>
                    <title>Municipality Fees</title>
                    <style>
                        body { font-family: Arial; padding: 20px; }
                        h2 { text-align: center; }
                        .card { border: 1px solid #ddd; padding: 12px; margin-bottom: 10px; border-radius: 8px; }
                        .row { display: flex; justify-content: space-between; margin: 5px 0; }
                        .total { font-weight: bold; text-align: right; margin-top: 20px; font-size: 18px; }
                    </style>
                </head>
                <body>
                    <h2>Municipality Fees Statement</h2>
                    ${content.innerHTML}
                </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.print();
    };

    if (loading) {
        return <div className={styles.feesPage}>Loading...</div>;
    }

    return (
        <div className={styles.feesPage}>

            {/* HERO */}
            <div className={styles.hero}>
                <h1>Your Municipality Fees</h1>
                <p>Review your dues and print your statement</p>
            </div>

            <div className={styles.container}>

                {/* ================= CITIZEN CARD (FIXED SAFETY) ================= */}
                <div className={styles.card}>

                    <h3 className={styles.citizenName}>
                        {citizen
                            ? `${citizen.First_Name} ${citizen.Last_Name}`
                            : "Guest Citizen"}
                    </h3>

                    <div className={styles.infoRow}>
                        <span className={styles.label}>Email:</span>
                        <span className={styles.value}>{citizen?.Email}</span>
                    </div>

                    <div className={styles.infoRow}>
                        <span className={styles.label}>City:</span>
                        <span className={styles.value}>{citizen?.City_Name}</span>
                    </div>

                    <div className={styles.infoRow}>
                        <span className={styles.label}>Street:</span>
                        <span className={styles.value}>{citizen?.Street_Name}</span>
                    </div>

                    <div className={styles.infoRow}>
                        <span className={styles.label}>Building:</span>
                        <span className={styles.value}>{citizen?.Building_Name}</span>
                    </div>

                </div>

                {/* ================= PRINT AREA ================= */}
                <div ref={printRef}>

                    {fees.length === 0 ? (
                        <div className={styles.card}>
                            No fees found.
                        </div>
                    ) : (
                        fees.map((fee) => (
                            <div key={fee.Fee_ID} className={styles.card}>

                                {/* TYPE */}
                                <h3>
                                    {fee.LocT_Type} Municipal Fee
                                </h3>

                                <div className={styles.feeRow}>
                                    <span>Amount</span>
                                    <span>${fee.Amount}</span>
                                </div>

                                <div className={styles.feeRow}>
                                    <span>Due Date</span>
                                    <span>{formatDate(fee.DateExpected)}</span>
                                </div>

                                {fee.LateFee > 0 && (
                                    <div className={styles.feeRow}>
                                        <span>Late Fee</span>
                                        <span>${fee.LateFee}</span>
                                    </div>
                                )}

                                <div className={styles.feeRow}>
                                    <span>Status</span>

                                    <span
                                        className={
                                            fee.IsPaid
                                                ? styles.paid
                                                : styles.unpaid
                                        }
                                    >
                                        {fee.IsPaid ? "PAID" : "UNPAID"}
                                    </span>
                                </div>

                            </div>
                        ))
                    )}

                    {/* TOTAL */}
                    <div className={styles.totalBox}>
                        Total: ${getTotal()}
                    </div>

                </div>

                {/* PRINT BUTTON */}
                <button className={styles.printBtn} onClick={handlePrint}>
                    Print Statement
                </button>

                <p className={styles.note}>
                    Please print this statement and visit the municipality office for payment.
                </p>

            </div>


        </div>
    );
}

export default PayFees;