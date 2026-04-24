import styles from "./Complain.module.css";
import { useState } from "react";
import axios from "axios";

function Complain() {
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

    const handleSubmit = async () => {
        try {
            setLoading(true); // 🔥 start loading

            const payload = {
                subject: data.category,
                details: `
                         Name: ${data.fullName}
                         Phone: ${data.phone}
                         Location: ${data.location}
                         Priority: ${data.priority}

                        Description:
                             ${data.description}
            `,
                citizenId: 1
            };

            console.log("PAYLOAD:", payload);

            const res = await axios.post("http://localhost:5000/api/complaints", payload);

            alert(res.data.message || "Complaint sent!");

        } catch (err) {
            console.log(err.response?.data);
            alert(err.response?.data?.error || "Error sending complaint");
        } finally {
            setLoading(false); // 🔥 stop loading
        }
    };
    return (
        <div className={styles.complainPage}>

            {/* HEADER */}
            <div className={styles.topSection}>
                <h1>Report an Issue</h1>
                <p>Help us improve your municipality by reporting problems in your area</p>
            </div>

            {/* FORM CARD */}
            <div className={styles.formCard}>

                <h3 className={styles.sectionTitle}>Submit Complaint</h3>

                <div className={styles.formGroup}>
                    <label>Full Name *</label>
                    <input name="fullName" placeholder="Enter your full name" onChange={handleChange} />
                </div>

                <div className={styles.formGroup}>
                    <label>Phone *</label>
                    <input name="phone" placeholder="Enter your phone number" onChange={handleChange} />
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

                {/* PRIORITY */}
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

                {/* FILES */}
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

                {/* REFERENCE */}
                <div className={styles.reference}>
                    Reference ID: #{reference}
                </div>

                <button
                    className={styles.submitBtn}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Submit Complaint"}
                </button>

            </div>
        </div>
    );
}

export default Complain;