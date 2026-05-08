import styles from "./Request.module.css";
import { useState, useEffect } from "react";
import axios from "axios";

function Request() {
    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token"); // 👈 where you store it

    const [step, setStep] = useState(1);
    const [requestTypes, setRequestTypes] = useState([]);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");

    const validateStep1 = () => {
        if (!data.title) return "Request title is required";
        if (!data.fullName) return "Full name is required";
        if (!data.phones[0]) return "Primary phone number is required";
        if (!data.email) return "Email is required";
        if (!data.type) return "Request type is required";
        if (!data.address) return "Address is required";

        return "";
    };

    const [data, setData] = useState({
        title: "",
        type: "",
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

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/requests/types`);
                if (res.data.success) {
                    setRequestTypes(res.data.data || []);
                }
            } catch (err) {
                console.log("Error fetching request types:", err);
            }
        };

        fetchTypes();
    }, []);

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
            setError("");
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

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/citizen/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("PROFILE RESPONSE:", res.data);

                if (res.data.success) {
                    const p = res.data.data;

                    setProfile(p);

                    setData(prev => ({
                        ...prev,

                        fullName: p.FullName ?? "",

                        email: p.Email ?? "",

                        address: p.Address ?? "",

                        phones: p.Phone_Num
                            ? [p.Phone_Num, ""]
                            : ["", ""]
                    }));
                }
            } catch (err) {
                console.log("Profile fetch error:", err);
            }
        };

        fetchProfile();
    }, []);

    const handleSubmit = async () => {
        try {

            const payload = {
                title: data.title,
                type: data.type,
                fullName: data.fullName,
                phones: data.phones,
                email: data.email,
                address: data.address,
                description: data.description,
                urgency: data.urgency
            };

            console.log("PAYLOAD:", payload);

            await axios.post(
                `${API_URL}/api/requests`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Request sent!");

        } catch (err) {

            console.log("FULL ERROR:", err);

            alert(
                err.response?.data?.error ||
                "Error sending request"
            );
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
                        <h3 className={styles.sectionTitle}>Request Information</h3>

                        <div className={styles.formGroup}>
                            <label>Request Title *</label>
                            <input placeholder="e.g. Building Permit for House" name="title" onChange={handleChange} value={data.title} />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Full Name *</label>
                            <input placeholder="Enter your full name" name="fullName" onChange={handleChange} value={data.fullName} />
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
                            <input type="email" placeholder="example@email.com" name="email" onChange={handleChange} value={data.email} />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Request Type *</label>
                            <select
                                name="type"
                                onChange={handleChange}
                                value={data.type}
                            >
                                <option value="">Select request type</option>

                                {requestTypes.map(type => (
                                    <option key={type.RType_ID} value={type.RType_ID}>
                                        {type.RType_Name}
                                    </option>
                                ))}

                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Address *</label>
                            <input placeholder="Enter your full address" name="address" onChange={handleChange} value={data.address} />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Description</label>
                            <textarea
                                placeholder="Provide additional details..."
                                name="description"
                                onChange={handleChange}
                                value={data.description}
                            />
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

                        {error && (
                            <p style={{ color: "red", marginTop: "10px" }}>
                                {error}
                            </p>
                        )}

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
                            <p><b>Type:</b> {requestTypes.find(t => t.RType_ID == data.type)?.RType_Name}</p>
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
                                <p>
                                    <b>Type:</b>{" "}
                                    {requestTypes.find(t => t.RType_ID == data.type)?.RType_Name}
                                </p>
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
                <button
                    onClick={() => {
                        const err = validateStep1();

                        if (err) {
                            setError(err);
                            return;
                        }

                        setError("");
                        setStep(2);
                    }}>
                    Next
                </button>
            </div>

        </div>
    );
}

export default Request;