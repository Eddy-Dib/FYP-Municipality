import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./RegisterForm.module.css";
import SuccessToast from "../UI/SuccessToast";

function RegisterForm() {
    const API_URL = process.env.REACT_APP_API_URL;

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        birthDate: "",
        email: "",
        phone: "",
        locationId: ""
    });

    const [file, setFile] = useState(null);

    const [cities, setCities] = useState([]);
    const [streets, setStreets] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [locations, setLocations] = useState([]);

    const [selectedCity, setSelectedCity] = useState("");
    const [selectedStreet, setSelectedStreet] = useState("");
    const [selectedBuilding, setSelectedBuilding] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [toast, setToast] = useState(false);

    useEffect(() => {
        const fetchCities = async () => {
            const res = await axios.get(`${API_URL}/api/locations/cities`);
            setCities(res.data.data);
        };
        fetchCities();
    }, []);

    const handleCityChange = async (e) => {
        const cityId = e.target.value;

        setSelectedCity(cityId);
        setSelectedStreet("");
        setSelectedBuilding("");
        setSelectedLocation("");

        setStreets([]);
        setBuildings([]);
        setLocations([]);

        setForm(prev => ({ ...prev, locationId: "" }));

        if (!cityId) return;

        const res = await axios.get(`${API_URL}/api/locations/streets`, {
            params: { cityId }
        });

        setStreets(res.data.data);
    };

    const handleStreetChange = async (e) => {
        const streetId = e.target.value;

        setSelectedStreet(streetId);
        setSelectedBuilding("");
        setSelectedLocation("");

        setBuildings([]);
        setLocations([]);

        setForm(prev => ({ ...prev, locationId: "" }));

        if (!streetId) return;

        const res = await axios.get(`${API_URL}/api/locations/buildings`, {
            params: { streetId }
        });

        setBuildings(res.data.data);
    };

    const handleBuildingChange = async (e) => {
        const buildingId = e.target.value;

        setSelectedBuilding(buildingId);
        setSelectedLocation("");

        setLocations([]);

        setForm(prev => ({ ...prev, locationId: "" }));

        if (!buildingId) return;

        const res = await axios.get(`${API_URL}/api/locations/locations`, {
            params: { buildingId }
        });

        setLocations(res.data.data);
    };

    const handleChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const data = new FormData();

            data.append("firstName", form.firstName);
            data.append("lastName", form.lastName);
            data.append("birthDate", form.birthDate);
            data.append("email", form.email);
            data.append("phone", form.phone);

            data.append("locationId", form.locationId);

            if (file) {
                data.append("document", file);
            }

            await axios.post(`${API_URL}/api/citizen/register`, data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setToast(true);

        } catch (err) {
            setMessage(err?.response?.data?.message || "Error submitting request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>

            <div className={styles.row}>
                <div className={styles.group}>
                    <label>First Name</label>
                    <input name="firstName" value={form.firstName} onChange={handleChange} required />
                </div>

                <div className={styles.group}>
                    <label>Last Name</label>
                    <input name="lastName" value={form.lastName} onChange={handleChange} required />
                </div>
            </div>

            <div className={styles.group}>
                <label>Birth Date</label>
                <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} required />
            </div>

            <div className={styles.group}>
                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>

            <div className={styles.group}>
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} />
            </div>

            <div className={styles.row}>
                <div className={styles.group}>
                    <label>City</label>
                    <select value={selectedCity} onChange={handleCityChange}>
                        <option value="">City</option>
                        {cities.map(c => (
                            <option key={c.City_ID} value={c.City_ID}>
                                {c.City_Name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.group}>
                    <label>Street</label>
                    <select value={selectedStreet} onChange={handleStreetChange}>
                        <option value="">Street</option>
                        {streets.map(s => (
                            <option key={s.Street_ID} value={s.Street_ID}>
                                {s.Street_Name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.group}>
                    <label>Building</label>
                    <select value={selectedBuilding} onChange={handleBuildingChange}>
                        <option value="">Building</option>
                        {buildings.map(b => (
                            <option key={b.Building_ID} value={b.Building_ID}>
                                {b.Building_Name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.group}>
                    <label>Floor (Location)</label>
                    <select
                        value={selectedLocation}
                        onChange={(e) => {
                            setSelectedLocation(e.target.value);
                            setForm(prev => ({ ...prev, locationId: e.target.value }));
                        }}
                    >
                        <option value="">Select Floor</option>
                        {locations.map(l => (
                            <option key={l.Location_ID} value={l.Location_ID}>
                                Floor {l.Floor} ({l.LocT_Type})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={styles.group}>
                <label>Verification Document</label>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
            </div>

            {message && <p className={styles.error}>{message}</p>}

            <button type="submit" disabled={loading} className={styles.button}>
                {loading ? "Submitting..." : "Send Request"}
            </button>

            {toast && (
                <SuccessToast message="Request Sent! We'll be in touch." onClose={() => setToast(false)} />
            )}
            
        </form>
    );
}

export default RegisterForm;