import styles from "./Documents.module.css";
import { useState, useEffect } from "react";
import axios from "axios";

import {
    FiUploadCloud,
    FiFileText,
    FiImage,
    FiX
} from "react-icons/fi";
import SuccessToast from "../Components/UI/SuccessToast";

function Documents() {

    const API_URL = process.env.REACT_APP_API_URL;

    const [documents, setDocuments] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [types, setTypes] = useState([]);
    const [previewModal, setPreviewModal] = useState(null);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const [form, setForm] = useState({
        docType: "",
        description: ""
    });

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const res = await axios.get(
                    `${API_URL}/api/documents/types`
                );

                const data = res.data?.data;

                if (Array.isArray(data)) {
                    setTypes(data);
                } else {
                    console.warn("Invalid document types response:", res.data);
                    setTypes([]);
                }

            } catch (err) {
                console.log(err);
                setTypes([]);
            }
        };

        fetchTypes();
    }, [API_URL]);


    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (documents.length >= 5) {
            setError("Maximum 5 documents allowed");
            return;
        }

        setSelectedFile(file);
    };

    const addDocument = () => {
        if (!selectedFile) return;

        if (!form.docType) {
            setError("Please select document type");
            return;
        }

        const selectedType = types.find(
            t => Number(t.Doc_Type_ID) === Number(form.docType)
        );

        const newDocument = {
            file: selectedFile,
            docType: form.docType,
            docTypeName: selectedType?.Doc_Type_Name || "Unknown",
            validFor: selectedType?.Valid_for || 0,
            description: form.description,
            preview: URL.createObjectURL(selectedFile),
            type: selectedFile.type,
            size: (selectedFile.size / 1024 / 1024).toFixed(2)
        };

        setDocuments(prev => [...prev, newDocument]);

        setSelectedFile(null);
        setForm({ docType: "", description: "" });
    };

    const removeDocument = (index) => {
        setDocuments(prev => prev.filter((_, i) => i !== index));
    };

    const isImage = (type) => type?.startsWith("image/");

    const handleSubmit = async () => {
        try {
            setSuccessMsg("");

            if (documents.length === 0) {
                setError("No documents to upload");
                return;
            }

            const formData = new FormData();

            documents.forEach((doc, index) => {
                formData.append("files", doc.file);
            });
            
            const docTypes = documents.map(doc => doc.docType);
            const descriptions = documents.map(doc => doc.description || "");

            formData.append("docTypes", JSON.stringify(docTypes));
            formData.append("descriptions", JSON.stringify(descriptions));

            const res = await axios.post(
                `${API_URL}/api/documents/upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            if (res.data.success) {
                setSuccessMsg("Documents uploaded successfully");
                setDocuments([]);
                setError("");
            }

        } catch (err) {
            console.log(err);

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Upload failed"
            );
        }
    };

    return (
        <div className={styles.documentsPage}>

            {/* HEADER */}
            <div className={styles.topSection}>
                <h1>Upload Supporting Documents</h1>
                <p>Attach files related to your municipality request or complaint</p>
            </div>

            {/* MAIN */}
            <div className={styles.mainCard}>

                {/* UPLOAD AREA */}
                <div className={styles.uploadArea}>
                    <FiUploadCloud className={styles.uploadIcon} />
                    <h3>Upload Files</h3>
                    <p>Drag & drop or browse</p>
                    <span>PDF, Images, Word, Excel (Max 5 files)</span>

                    <input
                        type="file"
                        onChange={handleFileSelect}
                    />
                </div>

                {/* FORM */}
                {selectedFile && (
                    <div className={styles.detailsBox}>

                        <select
                            value={form.docType || ""}
                            onChange={(e) =>
                                setForm(prev => ({
                                    ...prev,
                                    docType: e.target.value
                                }))
                            }
                        >
                            <option value="">
                                Select document type
                            </option>

                            {types.map(type => (
                                <option
                                    key={type.Doc_Type_ID}
                                    value={type.Doc_Type_ID}
                                >
                                    {type.Doc_Type_Name}
                                </option>
                            ))}
                        </select>

                        <textarea
                            placeholder="Describe this document..."
                            value={form.description}
                            onChange={(e) =>
                                setForm(prev => ({
                                    ...prev,
                                    description: e.target.value
                                }))
                            }
                        />

                        <button
                            className={styles.saveBtn}
                            onClick={addDocument}
                        >
                            Save Document
                        </button>

                    </div>
                )}

                {/* LIST */}
                <div className={styles.uploadsSection}>
                    <h4>Uploaded Documents</h4>

                    <div className={styles.documentsList}>

                        {documents.map((doc, index) => (
                            <div
                                key={index}
                                className={styles.documentCard}
                                onClick={() => setPreviewModal(doc)}
                            >

                                <div className={styles.leftSide}>
                                    {isImage(doc.type) ? (
                                        <div className={styles.imageBox}>
                                            <FiImage />
                                        </div>
                                    ) : (
                                        <div className={styles.pdfBox}>
                                            <FiFileText />
                                        </div>
                                    )}
                                </div>

                                <div className={styles.middleSide}>
                                    <h5>{doc.docTypeName}</h5>
                                    <p>{doc.description}</p>
                                    <span>
                                        {doc.file.name} • {doc.size} MB
                                    </span>

                                    <div className={styles.validity}>
                                        {doc.validFor > 0
                                            ? `Valid for ${doc.validFor} months`
                                            : "Permanent document"}
                                    </div>
                                </div>

                                <button
                                    className={styles.removeBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeDocument(index);
                                    }}
                                >
                                    <FiX />
                                </button>

                            </div>
                        ))}

                    </div>
                </div>

                <p className={styles.error}>{error}</p>

                {/* SUBMIT */}
                <button
                    className={styles.submitBtn}
                    onClick={handleSubmit}
                >
                    Submit Documents
                </button>

            </div>

            {/* PREVIEW MODAL */}
            {previewModal && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setPreviewModal(null)}
                >
                    <div
                        className={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className={styles.closeBtn}
                            onClick={() => setPreviewModal(null)}
                        >
                            <FiX />
                        </button>

                        {previewModal.type.startsWith("image/") ? (
                            <img
                                src={previewModal.preview}
                                alt=""
                                className={styles.modalImage}
                            />
                        ) : (
                            <iframe
                                src={previewModal.preview}
                                title="preview"
                                className={styles.pdfViewer}
                            />
                        )}
                    </div>
                </div>
            )}

            {successMsg && (<SuccessToast message={successMsg} onClose={() => setSuccessMsg("")}/>)}

        </div>
    );
}

export default Documents;