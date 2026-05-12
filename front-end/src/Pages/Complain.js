import styles from "./Complain.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import SuccessToast from "../Components/UI/SuccessToast";

function Complain() {

    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");
    const [cities, setCities] = useState([]);
    const [streets, setStreets] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [locations, setLocations] = useState([]);
    const [types, setTypes] = useState([]);
    const [data, setData] = useState({
        fullName: "",
        phone: "",
        type: "",
        cityId: "",
        streetId: "",
        buildingId: "",
        locationId: "",
        description: "",
        priority: "",
        files: []
    });

    const [previews, setPreviews] = useState([]);
    const [reference] = useState(Math.floor(100000 + Math.random() * 900000));

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(false);
    const [fileInputKey, setFileInputKey] = useState(0);

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

            return;
        }


        if (name === "cityId") {
            setData(prev => ({
                ...prev,
                cityId: value,
                streetId: "",
                buildingId: "",
                locationId: ""
            }));

            setStreets([]);
            setBuildings([]);
            setLocations([]);
            return;
        }


        if (name === "streetId") {
            setData(prev => ({
                ...prev,
                streetId: value,
                buildingId: "",
                locationId: ""
            }));

            setBuildings([]);
            setLocations([]);
            return;
        }


        if (name === "buildingId") {
            setData(prev => ({
                ...prev,
                buildingId: value,
                locationId: ""
            }));

            setLocations([]);
            return;
        }


        setData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        axios.get(`${API_URL}/api/locations/cities`)
            .then(res => setCities(res.data.data));
    }, []);

    useEffect(() => {
        if (!data.cityId) return;

        axios.get(`${API_URL}/api/locations/streets?cityId=${data.cityId}`)
            .then(res => setStreets(res.data.data));
    }, [data.cityId]);

    useEffect(() => {
        if (!data.streetId) return;

        axios.get(`${API_URL}/api/locations/buildings?streetId=${data.streetId}`)
            .then(res => setBuildings(res.data.data));
    }, [data.streetId]);

    useEffect(() => {
        if (!data.buildingId) return;

        axios.get(`${API_URL}/api/locations/locations?buildingId=${data.buildingId}`)
            .then(res => setLocations(res.data.data));
    }, [data.buildingId]);

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/complaints/types`);
                if (res.data.success) {
                    setTypes(res.data.data);
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchTypes();
    }, []);

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
                        phone: p.Phone_Num ?? "",
                        cityId: p.City_ID ?? "",
                        streetId: p.Street_ID ?? "",
                        buildingId: p.Building_ID ?? "",
                        locationId: p.Location_ID ?? ""
                    }));
                }
            } catch (err) {
                console.log("Profile error:", err);
            }
        };

        fetchProfile();
    }, [API_URL, token]);

    const validate = () => {
        if (!data.type) return "Type is required";
        if (!data.description) return "Description is required";
        return "";
    };

    const resetForm = () => {
        setData(prev => ({
            fullName: prev.fullName,
            phone: prev.phone,
            type: "",
            cityId: "",
            streetId: "",
            buildingId: "",
            locationId: "",
            description: "",
            priority: "",
            files: []
        }));

        setStreets([]);
        setBuildings([]);
        setLocations([]);
        setPreviews([]);

        setFileInputKey(k => k + 1);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            if (!data.type) {
                setError("Type is required");
                return;
            }

            if (!data.description) {
                setError("Description is required");
                return;
            }

            const payload = {
                type: data.type,
                cityId: data.cityId,
                streetId: data.streetId,
                buildingId: data.buildingId,
                locationId: data.locationId,
                details: `
                    Name: ${data.fullName}
                    Phone: ${data.phone}
                    Location: ${data.cityId}-${data.streetId}-${data.buildingId}-${data.locationId}
                    Description: ${data.description}`
            };

            const res = await axios.post(
                `${API_URL}/api/complaints/createcomplaint`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const complaintId = res.data.data.insertId;

            if(data.files.length > 0){
                const formData = new FormData();

                data.files.forEach(file => {
                    formData.append("documents", file);
                });

                await axios.post(
                    `${API_URL}/api/documents/complaints/${complaintId}/upload`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );
            }

            setError("");
            setToast(true);
            resetForm();

        } catch (err) {
            console.log(err);
            alert(err.response?.data?.error || "Error sending complaint");

        } finally {
            setLoading(false);
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
                    <label>Type *</label>

                    <select
                        name="type"
                        value={data.type}
                        onChange={handleChange}
                        className={styles.typeSelect}
                    >
                        <option value="">Select type</option>

                        {types.map(t => (
                            <option key={t.CType_ID} value={t.CType_ID}>
                                {t.CType_Name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label>City</label>
                    <select name="cityId" onChange={handleChange} value={data.cityId}>
                        <option value="">Select city</option>
                        {cities.map(c => (
                            <option key={c.City_ID} value={c.City_ID}>
                                {c.City_Name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label>Street</label>
                    <select name="streetId" onChange={handleChange} value={data.streetId}>
                        <option value="">Select street</option>
                        {streets.map(s => (
                            <option key={s.Street_ID} value={s.Street_ID}>
                                {s.Street_Name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label>Building</label>
                    <select name="buildingId" onChange={handleChange} value={data.buildingId}>
                        <option value="">Select building</option>
                        {buildings.map(b => (
                            <option key={b.Building_ID} value={b.Building_ID}>
                                {b.Building_Name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label>Location</label>
                    <select name="locationId" onChange={handleChange} value={data.locationId}>
                        <option value="">Select location</option>
                        {locations.map(l => (
                            <option key={l.Location_ID} value={l.Location_ID}>
                                Floor {l.Floor} - {l.LocT_Type}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea name="description" placeholder="Describe the issue..." onChange={handleChange} value={data.description} />
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
                                    checked={data.priority === level}
                                />
                                {level}
                            </label>
                        ))}
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Upload Photos </label>
                    <input key={fileInputKey} type="file" multiple accept="image/*" onChange={handleChange} />
                </div>

                <div className={styles.uploadPreviewWrapper}>
                    <div className={styles.previewContainer}>
                        {previews.map((src, i) => (
                            <div key={i} className={styles.imageWrapper}>
                                <img src={src} alt="preview" />

                                <button
                                    type="button"
                                    className={styles.removeBtn}
                                    onClick={() => removeImage(i)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
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
            {toast && (
                <SuccessToast
                    message={"Complaint Sent!"}
                    onClose={() => setToast(false)}
                />
            )}
        </div >
    );
}

export default Complain;