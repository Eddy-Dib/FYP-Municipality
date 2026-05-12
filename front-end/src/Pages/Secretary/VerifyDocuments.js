import { useState, useEffect } from "react";
import axios from "axios";
import DocumentCard from "../../Components/Card/DocumentCard";
import styles from "./VerifyDocuments.module.css";

function VerifyDocuments() {
    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");
    const [documents, setDocuments] = useState([]);
    const [filteredDocs, setFilteredDocs] = useState([]);

    const [documentTypes, setDocumentTypes] = useState([{ id: 0, name: "All" }]);
    const [selectedType, setSelectedType] = useState("All");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [docRes, typeRes] = await Promise.all([
                    axios.get(`${API_URL}/secretary/documents`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }),

                    axios.get(`${API_URL}/api/documents/types`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                ]);

                const docs = docRes.data.data || [];
                const types = typeRes.data.data || [];

                setDocuments(docs);
                setFilteredDocs(docs);

                setDocumentTypes([
                    { id: 0, name: "All" },
                    ...types.map(t => ({
                        id: t.Doc_Type_ID,
                        name: t.Doc_Type_Name
                    }))
                ]);

            } catch (err) {
                console.error(err);
                setError(
                    err.response?.data?.message ||
                    "Failed to load documents"
                );

            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (selectedType === "All") {
            setFilteredDocs(documents);
        } else {
            setFilteredDocs(
                documents.filter(doc => doc.Doc_Type_Name === selectedType)
            );
        }
    }, [selectedType, documents]);

    const handleOpenDocument = (filePath) => {
        window.open(`${API_URL.replace(/\/$/, "")}${filePath}`, "_blank");
    };

    const handleValidate = async (docId) => {
        try {
            await axios.patch(
                `${API_URL}/secretary/documents/${docId}/validate`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setDocuments(prev =>
                prev.filter(doc => doc.Doc_ID !== docId)
            );

        } catch (err) {
            console.error(err);
        }
    };

    const handleReject = async (docId) => {
        try {
            await axios.patch(
                `${API_URL}/secretary/documents/${docId}/reject`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setDocuments(prev =>
                prev.filter(doc => doc.Doc_ID !== docId)
            );

        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <p className={styles.message}>Loading documents...</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <div className={styles.page}>

            <div className={styles.header}>
                <h2>Document Validation</h2>

                <select
                    className={styles.dropdown}
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                >
                    {documentTypes.map(type => (
                        <option key={type.id} value={type.name}>
                            {type.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.grid}>
                {filteredDocs.map(doc => (
                    <DocumentCard
                        key={doc.Doc_ID}

                        thumbnail={`${API_URL}${doc.FilePath}`}

                        citizenName={`${doc.First_Name} ${doc.Last_Name}`}

                        docType={doc.Doc_Type_Name}

                        onValidate={() => handleValidate(doc.Doc_ID)}
                        onReject={() => handleReject(doc.Doc_ID)}
                        onClick={() => handleOpenDocument(doc.FilePath)}
                    />
                ))}
            </div>

        </div>
    );
}

export default VerifyDocuments;