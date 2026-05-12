import styles from "./Request.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import SuccessToast from "../Components/UI/SuccessToast";

function Request() {
    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    const [step, setStep] = useState(1);
    const [requestTypes, setRequestTypes] = useState([]);
    const [documentTypes, setDocumentTypes] = useState([]);
    const [cities, setCities] = useState([]);
    const [streets, setStreets] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [locations, setLocations] = useState([]);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");

    const [toast, setToast] = useState(false);

    const validateStep1 = () => {
        if (!data.title) return "Request title is required";
        if (!data.fullName) return "Full name is required";
        if (!data.phones[0]) return "Primary phone number is required";
        if (!data.email) return "Email is required";
        if (!data.type) return "Request type is required";
        if (!data.cityId) return "City is required";
        if (!data.streetId) return "Street is required";
        if (!data.buildingId) return "Building is required";
        if (!data.locationId) return "Location is required";
        
        for (let i = 0; i < data.files.length; i++) {
            if (!data.files[i].docType) {
                return `Please select a document type for uploaded file ${i + 1}`;
            }
        }

        return "";
    };

    const [data, setData] = useState({
        title: "",
        type: "",
        fullName: "",
        phones: ["", ""],
        email: "",
        cityId: "",
        streetId: "",
        buildingId: "",
        locationId: "",
        description: "",
        urgency: "",
        files: []
    });

    const [previews, setPreviews] = useState([]);

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

        const fetchDocumentTypes = async () => {
            try {

                const res = await axios.get(
                    `${API_URL}/api/documents/types`
                );

                if (res.data.success) {
                    setDocumentTypes(res.data.data || []);
                }

            } catch (err) {
                console.log("Error fetching document types:", err);
            }
        };

        const fetchCities = async () => {
            try {

                const res = await axios.get(
                    `${API_URL}/api/locations/cities`
                );

                if (res.data.success) {
                    setCities(res.data.data);
                }

            } catch (err) {
                console.log(err);
            }
        };

        fetchTypes();
        fetchCities();
        fetchDocumentTypes();
    }, []);

    useEffect(() => {
        const fetchStreets = async () => {
            if (!data.cityId) return;

            try {
                const res = await axios.get(
                    `${API_URL}/api/locations/streets?cityId=${data.cityId}`
                );

                if (res.data.success) {
                    setStreets(res.data.data);
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchStreets();
    }, [data.cityId]);

    useEffect(() => {
        const fetchBuildings = async () => {
            if (!data.streetId) return;

            try {
                const res = await axios.get(
                    `${API_URL}/api/locations/buildings?streetId=${data.streetId}`
                );

                if (res.data.success) {
                    setBuildings(res.data.data);
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchBuildings();
    }, [data.streetId]);

    useEffect(() => {
        const fetchLocations = async () => {
            if (!data.buildingId) return;

            try {
                const res = await axios.get(
                    `${API_URL}/api/locations/locations?buildingId=${data.buildingId}`
                );

                if (res.data.success) {
                    setLocations(res.data.data);
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchLocations();
    }, [data.buildingId]);

    const handleDocumentTypeChange = (index, value) => {

        setData(prev => ({
            ...prev,

            files: prev.files.map((item, i) =>
                i === index
                    ? { ...item, docType: value }
                    : item
            )
        }));
    };

    const handleChange = (e, index = null) => {
        const { name, value, files } = e.target;

        setError("");

        if (files) {
            const newFiles = Array.from(files);

            const mappedFiles = newFiles.map(file => ({
                file, docType: ""
            }));

            setData(prev => {
                const combined = [...prev.files, ...mappedFiles].slice(0, 3);
                return { ...prev, files: combined };
            });

            setPreviews(prev => {
                const newPreviews = newFiles.map(file => URL.createObjectURL(file));
                return [...prev, ...newPreviews].slice(0, 3);
            });

            return;
        }

        if (name === "phones") {
            const updated = [...data.phones];
            updated[index] = value;

            setData(prev => ({
                ...prev,
                phones: updated
            }));

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
                        fullName: p.FullName || prev.fullName,
                        email: p.Email || prev.email,
                        phones: p.Phone_Num ? [p.Phone_Num, ""] : prev.phones,

                        cityId: p.City_ID || "",
                        streetId: p.Street_ID || "",
                        buildingId: p.Building_ID || "",
                        locationId: p.Location_ID || ""
                    }));
                }
            } catch (err) {
                console.log("Profile fetch error:", err);
            }
        };

        fetchProfile();
    }, []);

    const resetForm = () => {
        setData({
            title: "",
            type: "",
            fullName: profile?.FullName || "",
            phones: [profile?.Phone_Num || "", ""],
            email: profile?.Email || "",
            cityId: profile?.City_ID || "",
            streetId: profile?.Street_ID || "",
            buildingId: profile?.Building_ID || "",
            locationId: profile?.Location_ID || "",
            description: "",
            urgency: "",
            files: []
        });

        setPreviews([]);
        setError("");
    };

    const handleSubmit = async () => {
        console.log(data);
        try {
            const cityName =
                cities.find(c => c.City_ID == data.cityId)?.City_Name;

            const streetName =
                streets.find(s => s.Street_ID == data.streetId)?.Street_Name;

            const buildingName =
                buildings.find(b => b.Building_ID == data.buildingId)?.Building_Name;

            const locationObj =
                locations.find(l => l.Location_ID == data.locationId);

            const floorText = `floor ${locationObj.Floor}`;

            const address =
                `${cityName} - ${streetName} - ${buildingName} - ${floorText}`;

            const payload = {
                title: data.title,
                type: data.type,
                fullName: data.fullName,
                phones: data.phones,
                email: data.email,
                address: address,
                description: data.description,
                urgency: data.urgency
            };

            console.log("PAYLOAD:", payload);

            const res = await axios.post(
                `${API_URL}/api/requests`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const requestId = res.data.data.insertId;

            if (data.files.length > 0) {
                const formData = new FormData();

                data.files.forEach((item) => {
                    formData.append("files", item.file);
                });

                const docTypes = data.files.map(item => item.docType);
                formData.append("docTypes", JSON.stringify(docTypes));

                await axios.post(
                    `${API_URL}/api/documents/request/${requestId}/upload`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );
            }

            setToast(true);
            setStep(1);
            resetForm();
            setError("");

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
            {toast && (
                <SuccessToast message="Request Sent!" onClose={() => setToast(false)}/>
            )}

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
                            <label>City *</label>

                            <select
                                name="cityId"
                                value={data.cityId || ""}
                                onChange={handleChange}
                            >
                                <option value="">Select city</option>

                                {cities.map(city => (
                                    <option
                                        key={city.City_ID}
                                        value={city.City_ID}
                                    >
                                        {city.City_Name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Street *</label>

                            <select
                                name="streetId"
                                value={data.streetId || ""}
                                onChange={handleChange}
                            >
                                <option value="">Select street</option>

                                {streets.map(street => (
                                    <option
                                        key={street.Street_ID}
                                        value={street.Street_ID}
                                    >
                                        {street.Street_Name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Building *</label>

                            <select
                                name="buildingId"
                                value={data.buildingId || ""}
                                onChange={handleChange}
                            >
                                <option value="">Select building</option>

                                {buildings.map(building => (
                                    <option
                                        key={building.Building_ID}
                                        value={building.Building_ID}
                                    >
                                        {building.Building_Name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Location *</label>

                            <select
                                name="locationId"
                                value={data.locationId || ""}
                                onChange={handleChange}
                            >
                                <option value="">Select location</option>

                                {locations.map(location => (
                                    <option
                                        key={location.Location_ID}
                                        value={location.Location_ID}
                                    >
                                        Floor {location.Floor} - {location.LocT_Type}
                                    </option>
                                ))}
                            </select>
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
                                        <input type="radio" name="urgency" value={level} onChange={handleChange} checked={data.urgency === level} />
                                        {level}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Upload Documents </label>
                            <input type="file" multiple accept="image/*" onChange={handleChange} />
                        </div>

                        <div className={styles.previewContainer}>
                            {previews.map((src, i) => (
                                <div key={i} className={styles.imageWrapper}>
                                    <img src={src} className={styles.preview} />
                                    <select 
                                        value={data.files[i]?.docType || ""}
                                        onChange={(e) => handleDocumentTypeChange(i, e.target.value)}
                                    >
                                        <option value="">
                                            Select document type
                                        </option>

                                        {documentTypes.map(type => (

                                            <option
                                                key={type.Doc_Type_ID}
                                                value={type.Doc_Type_ID}
                                            >
                                                {type.Doc_Type_Name}
                                            </option>

                                        ))}
                                    </select>
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
                            <p>
                                <b>Address:</b>{" "}
                                {
                                    cities.find(c => c.City_ID == data.cityId)?.City_Name
                                }
                                {" - "}
                                {
                                    streets.find(s => s.Street_ID == data.streetId)?.Street_Name
                                }
                                {" - "}
                                {
                                    buildings.find(b => b.Building_ID == data.buildingId)?.Building_Name
                                }
                            </p>
                            <p><b>Urgency:</b> {data.urgency}</p>
                            <p><b>Description:</b> {data.description}</p>

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
                                <p>
                                    <b>Address:</b>{" "}
                                    {
                                        cities.find(c => c.City_ID == data.cityId)?.City_Name
                                    }
                                    {" - "}
                                    {
                                        streets.find(s => s.Street_ID == data.streetId)?.Street_Name
                                    }
                                    {" - "}
                                    {
                                        buildings.find(b => b.Building_ID == data.buildingId)?.Building_Name
                                    }
                                </p>
                                <p><b>Urgency:</b> {data.urgency}</p>
                                <p><b>Description:</b> {data.description}</p>

                                <div className={styles.voucherImages}>
                                    {previews.map((src, i) => (
                                        <img key={i} src={src} />
                                    ))}
                                </div>

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

                {step === 2 && (
                    <button
                        type="button"
                        onClick={() => setStep(1)}
                    >
                        Back
                    </button>
                )}

                {step === 1 && (
                    <button
                        type="button"
                        onClick={() => {
                            const err = validateStep1();

                            if (err) {
                                setError(err);
                                return;
                            }

                            setError("");
                            setStep(2);
                        }}
                    >
                        Next
                    </button>
                )}

            </div>

        </div>
    );
}

export default Request;