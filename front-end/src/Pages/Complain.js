import styles from "./Complain.module.css";
import { useState, useEffect } from "react";
import axios from "axios";

function Complain() {

    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");
    const [data, setData] = useState({
        fullName: "",
        phone: "",
        category: "",
        location: "",
        description: "",
        priority: "",
        files: []
    });

    const [previews, setPreviews] = useState([]);
    const [reference] = useState(Math.floor(100000 + Math.random() * 900000));

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files) {
            const newFiles = Array.from(files);

            setData(prev => {
                const combined = [...prev.files, ...newFiles].slice(0, 3);
                return { ...prev, files: combined };
            });

            setPreviews(prev => {
                const newPreviews = newFiles.map(file =>
                    URL.createObjectURL(file)
                );
                return [...prev, ...newPreviews].slice(0, 3);
            });
        } else {
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
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/citizen/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.success) {
                    const p = res.data.data;
                    setProfile(p);

                    setData(prev => ({
                        ...prev,
                        fullName: p.FullName ?? "",
                        phone: p.Phone_Num ?? ""
                    }));
                }
            } catch (err) {
                console.log("Profile error:", err);
            }
        };

        fetchProfile();
    }, [API_URL, token]);
    const validate = () => {
        if (!data.category) return "Category is required";
        if (!data.description) return "Description is required";
        return "";
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            if (!data.category) {
                setError("Category is required");
                return;
            }

            if (!data.description) {
                setError("Description is required");
                return;
            }

            const payload = {
                subject: data.category,
                details: `
Name: ${data.fullName}
Phone: ${data.phone}
Location: ${data.location || "N/A"}

Description:
${data.description}
            `
            };

            await axios.post(
                `${API_URL}/api/complaints/createcomplaint`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Complaint sent!");
            setError(""); // clear error

        } catch (err) {
            console.log(err);
            alert(err.response?.data?.error || "Error sending complaint");

        } finally {
            setLoading(false); // 🔥 stop loading
        }
    };
    return (
        <div className={styles.complainPage}>

            <div className={styles.topSection}>
                <h1>Report an Issue</h1>
                <p>Help us improve your municipality by reporting problems in your area</p>
            </div>

            <div className={styles.formCard}>

                <h3 className={styles.sectionTitle}>Submit Complaint</h3>

                <div className={styles.formGroup}>
                    <label>Full Name *</label>
                    <input value={data.fullName} readOnly className={styles.readOnlyInput} />
                </div>

                <div className={styles.formGroup}>
                    <label>Phone *</label>
                    <input value={data.phone} readOnly />
                </div>

                <div className={styles.formGroup}>
                    <label>Category *</label>
                    <select name="category" onChange={handleChange}>
                        <option value="">Select category</option>
                        <option>Infrastructure</option>
                        <option>Sanitation</option>
                        <option>Property Violation</option>
                        <option>Public Safety / Noise</option>
                        <option>Staff Service</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label>Location</label>
                    <input name="location" placeholder="Street / Area" onChange={handleChange} />
                </div>

                <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea name="description" placeholder="Describe the issue..." onChange={handleChange} />
                </div>

                <div className={styles.formGroup}>
                    <label>Priority</label>

                    <div className={styles.priorityGroup}>
                        {["Low", "Medium", "High"].map(level => (
                            <label key={level}>
                                <input
                                    type="radio"
                                    name="priority"
                                    value={level}
                                    onChange={handleChange}
                                />
                                {level}
                            </label>
                        ))}
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Upload Photos (max 3)</label>
                    <input type="file" multiple accept="image/*" onChange={handleChange} />
                </div>

                <div className={styles.previewContainer}>
                    {previews.map((src, i) => (
                        <div key={i} className={styles.imageWrapper}>
                            <img src={src} alt="preview" />
                            <button onClick={() => removeImage(i)}>×</button>
                        </div>
                    ))}
                </div>

                <div className={styles.reference}>
                    Reference ID: #{reference}
                </div>

                {error && (
                    <p style={{ color: "red", marginTop: "10px" }}>
                        {error}
                    </p>
                )}

                <button
                    className={styles.submitBtn}
                    disabled={loading}
                    onClick={() => {
                        const err = validate();
                        if (err) {
                            setError(err);
                            return;
                        }
                        handleSubmit();
                    }}
                >
                    {loading ? "Sending..." : "Submit Complaint"}
                </button>

            </div>
        </div >
    );
}

export default Complain;