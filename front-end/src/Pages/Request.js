import styles from "./Request.module.css";
import { useState } from "react";

function Request() {
    const [step, setStep] = useState(1);

    const [data, setData] = useState({
        title: "",
        type: "",
        fullName: "",
        phone: "",
        email: "",
        address: "",
        district: "",
        construction: "",
        description: "",
        urgency: "",
        idFront: null,
        idBack: null
    });

    const [previewFront, setPreviewFront] = useState(null);
    const [previewBack, setPreviewBack] = useState(null);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files) {
            const file = files[0];

            setData(prev => ({ ...prev, [name]: file }));

            if (name === "idFront") {
                setPreviewFront(URL.createObjectURL(file));
            }

            if (name === "idBack") {
                setPreviewBack(URL.createObjectURL(file));
            }
        } else {
            setData(prev => ({ ...prev, [name]: value }));
        }
    };

    const progress = (step / 4) * 100;

    return (
        <div className={styles.requestPage}>

            {/* TOP SECTION */}
            <div className={styles.topSection}>
                <h1>Submit a Request</h1>
                <p>Fill the form to contact your municipality</p>
            </div>

            {/* FORM CARD */}
            <div className={styles.formCard}>

                {/* PROGRESS */}
                <div className={styles.progressBar}>
                    <div style={{ width: `${progress}%` }} />
                </div>

                {/* STEP 1 */}
                {step === 1 && (
                    <>
                        <h3>Request & Personal Info</h3>

                        <div className={styles.formGroup}>
                            <label>Request Title</label>
                            <input name="title" onChange={handleChange} />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Full Name *</label>
                            <input name="fullName" onChange={handleChange} />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Phone *</label>
                            <input name="phone" onChange={handleChange} />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Email *</label>
                            <input type="email" name="email" onChange={handleChange} />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Request Type *</label>
                            <select name="type" onChange={handleChange}>
                                <option value="">Select request type</option>
                                <option>Building Permit</option>
                                <option>Renovation Permit</option>
                                <option>Demolition Request</option>
                                <option>Business License Request</option>
                            </select>
                        </div>
                    </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <>
                        <h3>Location & Details</h3>

                        <div className={styles.formGroup}>
                            <label>Address *</label>
                            <input name="address" onChange={handleChange} />
                        </div>

                        <div className={styles.formGroup}>
                            <label>District *</label>
                            <input name="district" onChange={handleChange} />
                        </div>

                        <div className={styles.mapBox}>
                            📍 Map will be here
                        </div>

                        <div className={styles.formGroup}>
                            <label>Construction Type</label>
                            <select name="construction" onChange={handleChange}>
                                <option value="">Select type</option>
                                <option>Residential</option>
                                <option>Commercial</option>
                                <option>Industrial</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Description</label>
                            <textarea name="description" onChange={handleChange} />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Urgency</label>

                            <div className={styles.urgencyGroup}>
                                {["Low", "Medium", "High", "Emergency"].map(level => (
                                    <label key={level}>
                                        <input
                                            type="radio"
                                            name="urgency"
                                            value={level}
                                            onChange={handleChange}
                                        />
                                        {level}
                                    </label>
                                ))}
                            </div>

                            {data.urgency === "Emergency" && (
                                <p className={styles.warning}>
                                    ⚠ Emergency detected — contact services immediately
                                </p>
                            )}
                        </div>
                    </>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <>
                        <h3>Upload ID</h3>

                        <div className={styles.formGroup}>
                            <label>ID Front</label>
                            <input type="file" name="idFront" onChange={handleChange} />
                            {previewFront && (
                                <img src={previewFront} className={styles.preview} />
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label>ID Back</label>
                            <input type="file" name="idBack" onChange={handleChange} />
                            {previewBack && (
                                <img src={previewBack} className={styles.preview} />
                            )}
                        </div>
                    </>
                )}

                {/* STEP 4 */}
                {step === 4 && (
                    <div className={styles.reviewBox}>
                        <h3>Review</h3>

                        <p><b>Type:</b> {data.type}</p>
                        <p><b>Name:</b> {data.fullName}</p>
                        <p><b>Phone:</b> {data.phone}</p>
                        <p><b>Email:</b> {data.email}</p>
                        <p><b>Address:</b> {data.address}</p>
                        <p><b>District:</b> {data.district}</p>
                        <p><b>Description:</b> {data.description}</p>
                        <p><b>Urgency:</b> {data.urgency}</p>

                        <button className={styles.submitBtn}>
                            Submit Request
                        </button>
                    </div>
                )}
            </div>

            {/* NAV BUTTONS */}
            <div className={styles.navButtons}>
                <button disabled={step === 1} onClick={() => setStep(step - 1)}>
                    Back
                </button>

                {step < 4 && (
                    <button onClick={() => setStep(step + 1)}>
                        Next
                    </button>
                )}
            </div>

        </div>
    );
}

export default Request;