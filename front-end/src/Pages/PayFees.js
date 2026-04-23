import styles from "./PayFees.module.css";
import { useState } from "react";

function PayFees() {
    const [entries, setEntries] = useState([]);

    const addEntry = (type) => {
        const newEntry = {
            id: Date.now(),
            type,
            name: "",
            businessType: "",
            fees: type === "house"
                ? [
                    { label: "Property Tax", amount: 120 },
                    { label: "Waste Collection", amount: 50 }
                ]
                : [
                    { label: "Business License", amount: 200 }
                ]
        };

        setEntries([...entries, newEntry]);
    };


    const removeEntry = (id) => {
        setEntries(entries.filter(e => e.id !== id));
    };

    const updateField = (id, field, value) => {
        setEntries(entries.map(e =>
            e.id === id ? { ...e, [field]: value } : e
        ));
    };

    const getTotal = () => {
        let total = 0;
        entries.forEach(e =>
            e.fees.forEach(f => total += f.amount)
        );
        return total;
    };

    const handlePrint = () => {
        const content = document.getElementById("invoice").innerHTML;

        const printWindow = window.open("", "", "width=800,height=600");

        printWindow.document.write(`
            <html>
                <head>
                    <title>Fees Statement</title>
                    <style>
                        body { font-family: Arial; padding: 40px; }
                        h3 { margin-bottom: 20px; }
                        h4 { margin-top: 20px; }
                        .row {
                            display: flex;
                            justify-content: space-between;
                        }
                        .total {
                            margin-top: 15px;
                            font-weight: bold;
                            border-top: 1px solid #ccc;
                            padding-top: 10px;
                        }
                    </style>
                </head>
                <body>
                    ${content}
                </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className={styles.feesPage}>

            <div className={styles.hero}>
                <h1>Your Municipality Fees</h1>
                <p>Review your dues and print your statement</p>
            </div>

            <div className={styles.container}>

                <div className={styles.actions}>
                    <button onClick={() => addEntry("house")}>
                        + Add House
                    </button>
                    <button onClick={() => addEntry("business")}>
                        + Add Business
                    </button>
                </div>

                {entries.map((entry, index) => (
                    <div key={entry.id} className={styles.card}>

                        <div className={styles.cardHeader}>
                            <h3>
                                {entry.type === "house" ? "House" : "Business"} #{index + 1}
                            </h3>

                            <button
                                className={styles.removeBtn}
                                onClick={() => removeEntry(entry.id)}
                            >
                                ✕
                            </button>
                        </div>

                        {entry.type === "business" && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Business name"
                                    value={entry.name}
                                    onChange={(e) =>
                                        updateField(entry.id, "name", e.target.value)
                                    }
                                />

                                <select
                                    value={entry.businessType}
                                    onChange={(e) =>
                                        updateField(entry.id, "businessType", e.target.value)
                                    }
                                >
                                    <option value="">Select type</option>
                                    <option>Mini Market</option>
                                    <option>Supermarket</option>
                                    <option>Clothing Store</option>
                                    <option>Salon</option>
                                    <option>Restaurant</option>
                                    <option>Cafe</option>
                                    <option>Pharmacy</option>
                                    <option>Other</option>
                                </select>
                            </>
                        )}

                        <div className={styles.feesList}>
                            {entry.fees.map((f, i) => (
                                <div key={i} className={styles.feeRow}>
                                    <span>{f.label}</span>
                                    <span>${f.amount}</span>
                                </div>
                            ))}
                        </div>

                    </div>
                ))}

                {entries.length > 0 && (
                    <div id="invoice" className={styles.hiddenInvoice}>
                        <h3>Fees Statement</h3>

                        {entries.map((e, i) => (
                            <div key={i}>
                                <h4>
                                    {e.type === "house"
                                        ? `House ${i + 1}`
                                        : `${e.name || "Business"} (${e.businessType || ""})`}
                                </h4>

                                {e.fees.map((f, j) => (
                                    <div key={j} className="row">
                                        <span>{f.label}</span>
                                        <span>${f.amount}</span>
                                    </div>
                                ))}
                            </div>
                        ))}

                        <div className="total">
                            Total: ${getTotal()}
                        </div>
                    </div>
                )}

                {entries.length > 0 && (
                    <div className={styles.totalBox}>
                        Total: ${getTotal()}
                    </div>
                )}

                {entries.length > 0 && (
                    <>
                        <button className={styles.printBtn} onClick={handlePrint}>
                            Print Statement
                        </button>

                        <p className={styles.note}>
                            Please print this statement and visit the municipality to complete your payment.
                        </p>
                    </>
                )}

            </div>

        </div>
    );
}

export default PayFees;