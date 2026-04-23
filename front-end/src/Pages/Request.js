import styles from "./Request.module.css";
import { useState } from "react";
import axios from "axios";

function Request() {
    const [step, setStep] = useState(1);

    const [data, setData] = useState({
        title: "",
        type: "",
        otherType: "",
        fullName: "",
        phones: ["", ""],
        email: "",
        address: "",
        description: "",
        urgency: "",
        files: []
    });

    const [previews, setPreviews] = useState([]);
    const [reference] = useState(Math.floor(100000 + Math.random() * 900000));

    const handleChange = (e, index = null) => {
        const { name, value, files } = e.target;

        if (files) {
            const newFiles = Array.from(files);

            setData(prev => {
                const combined = [...prev.files, ...newFiles].slice(0, 3);
                return { ...prev, files: combined };
            });

            setPreviews(prev => {
                const newPreviews = newFiles.map(file => URL.createObjectURL(file));
                return [...prev, ...newPreviews].slice(0, 3);
            });
        }

        else if (name === "phones") {
            const updated = [...data.phones];
            updated[index] = value;
            setData(prev => ({ ...prev, phones: updated }));
        }

        else {
            setData(prev => ({ ...prev, [name]: value }));
        }
    };

    const removeImage = (index) => {
        setData(prev => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index)
        }));

        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const progress = (step / 2) * 100;

    const handlePrint = () => {
        const content = document.getElementById("voucherPrint").innerHTML;

        const printWindow = window.open("", "", "width=800,height=600");

        printWindow.document.write(`
        <html>
            <head>
                <title>Request Voucher</title>
                <style>
                    body { font-family: Arial; padding: 40px; }
                    h3 { margin-bottom: 20px; }
                    p { margin: 6px 0; }
                    img { width: 100px; margin: 5px; border-radius: 8px; }
                    ul { margin-left: 20px; }
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



    const handleSubmit = async () => {
        try {
            const priorityMap = {
                Low: 1,
                Medium: 2,
                High: 3,
                Emergency: 4
            };
            const typeMap = {
                "Building Permit": 1,
                "Renovation Permit": 2,
                "Business License": 3,
                "Other": 4
            };
            const payload = {
                title: data.title,
                type: typeMap[data.type],
                otherType: data.otherType,
                fullName: data.fullName,
                phones: data.phones,
                email: data.email,
                address: data.address,
                description: data.description,
                urgency: priorityMap[data.urgency],
                citizenId: 1
            };

            console.log("PAYLOAD:", payload);

            await axios.post("http://localhost:5000/api/requests", payload);

            alert("Request sent!");
        } catch (err) {
            console.log("FULL ERROR:", err);
            console.log("RESPONSE DATA:", err.response?.data);
            console.log("ERROR MESSAGE:", err.response?.data?.error);
            alert(err.response?.data?.error || "Error sending request");
        }
    };

    return (
        <div className={styles.requestPage}>

            <div className={styles.topSection}>
                <h1>Submit a Request</h1>
                <p>Fill the form to contact your municipality</p>
            </div>

            <div className={styles.formCard}>

                <div className={styles.progressBar}>
                    <div style={{ width: `${progress}%` }} />
                </div>

                {/* STEP 1 */}
                {step === 1 && (
                    <>
                        <h3>Request Information</h3>

                        <div className={styles.formGroup}>
                            <label>Request Title</label>
                            <input placeholder="e.g. Building Permit for House" name="title" onChange={handleChange} />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Full Name *</label>
                            <input placeholder="Enter your full name" name="fullName" onChange={handleChange} />
                        </div>

                        <div className={styles.phoneRow}>
                            <div className={styles.formGroup}>
                                <label>Phone 1 *</label>
                                <input placeholder="Primary phone number" value={data.phones[0]} onChange={(e) => handleChange(e, 0)} name="phones" />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Phone 2</label>
                                <input placeholder="Optional phone number" value={data.phones[1]} onChange={(e) => handleChange(e, 1)} name="phones" />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Email *</label>
                            <input type="email" placeholder="example@email.com" name="email" onChange={handleChange} />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Request Type *</label>
                            <select name="type" onChange={handleChange}>
                                <option value="">Select request type</option>
                                <option>Building Permit</option>
                                <option>Renovation Permit</option>
                                <option>Business License</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {data.type === "Other" && (
                            <div className={styles.formGroup}>
                                <label>Specify Type</label>
                                <input placeholder="Describe your request type" name="otherType" onChange={handleChange} />
                            </div>
                        )}

                        <div className={styles.formGroup}>
                            <label>Address *</label>
                            <input placeholder="Enter your full address" name="address" onChange={handleChange} />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Description</label>
                            <textarea placeholder="Provide additional details about your request..." name="description" onChange={handleChange} />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Urgency</label>
                            <div className={styles.urgencyGroup}>
                                {["Low", "Medium", "High", "Emergency"].map(level => (
                                    <label key={level}>
                                        <input type="radio" name="urgency" value={level} onChange={handleChange} />
                                        {level}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Upload Documents (max 3)</label>
                            <input type="file" multiple accept="image/*" onChange={handleChange} />
                        </div>

                        <div className={styles.previewContainer}>
                            {previews.map((src, i) => (
                                <div key={i} className={styles.imageWrapper}>
                                    <img src={src} className={styles.preview} />
                                    <button type="button" className={styles.removeBtn} onClick={() => removeImage(i)}>×</button>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <>

                        <div id="voucherPrint" className={styles.hiddenVoucher}>
                            <h3>Request Voucher</h3>

                            <p><b>Title:</b> {data.title}</p>
                            <p><b>Name:</b> {data.fullName}</p>

                            <p><b>Phones:</b></p>
                            <ul>
                                {data.phones.map((p, i) => p && <li key={i}>{p}</li>)}
                            </ul>

                            <p><b>Email:</b> {data.email}</p>
                            <p><b>Type:</b> {data.type === "Other" ? data.otherType : data.type}</p>
                            <p><b>Address:</b> {data.address}</p>
                            <p><b>Urgency:</b> {data.urgency}</p>
                            <p><b>Description:</b> {data.description}</p>

                            <p><b>Reference ID:</b> #{reference}</p>

                            <div>
                                {previews.map((src, i) => (
                                    <img key={i} src={src} />
                                ))}
                            </div>
                        </div>


                        <div className={styles.voucher}>
                            <h3>Request Voucher</h3>

                            <div className={styles.voucherBox}>
                                <p><b>Title:</b> {data.title}</p>
                                <p><b>Name:</b> {data.fullName}</p>

                                <p><b>Phones:</b></p>
                                <ul>
                                    {data.phones.map((p, i) => p && <li key={i}>{p}</li>)}
                                </ul>

                                <p><b>Email:</b> {data.email}</p>
                                <p><b>Type:</b> {data.type === "Other" ? data.otherType : data.type}</p>
                                <p><b>Address:</b> {data.address}</p>
                                <p><b>Urgency:</b> {data.urgency}</p>
                                <p><b>Description:</b> {data.description}</p>

                                <div className={styles.voucherImages}>
                                    {previews.map((src, i) => (
                                        <img key={i} src={src} />
                                    ))}
                                </div>

                                <p className={styles.reference}>
                                    Reference ID: #{reference}
                                </p>
                            </div>

                            <button className={styles.submitBtn} onClick={handleSubmit}>
                                Submit Request
                            </button>

                            <button className={styles.printBtn} onClick={handlePrint}>
                                Print as PDF
                            </button>

                            <p className={styles.printNote}>
                                Please print this voucher and present it at the municipality office to complete your request process or for further discussion with our staff.
                            </p>
                        </div>
                    </>
                )}
            </div>

            <div className={styles.navButtons}>
                {step === 2 && <button onClick={() => setStep(1)}>Back</button>}
                {step === 1 && <button onClick={() => setStep(2)}>Next</button>}
            </div>

        </div>
    );
}

export default Request;