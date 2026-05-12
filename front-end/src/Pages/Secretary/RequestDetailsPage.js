import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import RejectionReason from "../../Components/Form/RejectionReason";
import RequestDetailsCard from "../../Components/Card/RequestDetailsCard";
import styles from "./RequestDetailsPage.module.css";

function RequestDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    const [request, setRequest] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [approving, setApproving] = useState(false);
    const [rejecting, setRejecting] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [reqRes, docRes] = await Promise.all([
                    axios.get(`${API_URL}/secretary/requests/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),

                    axios.get(`${API_URL}/secretary/requests/${id}/documents`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                if (reqRes.data.success) {
                    setRequest(reqRes.data.data);
                } else {
                    setError(reqRes.data.message);
                }

                if (docRes.data.success) {
                    setDocuments(docRes.data.data);
                } else {
                    setError(docRes.data.message);
                }

            } catch (err) {
                console.error(err);
                setError(
                    err.response?.data?.message ||
                    "Failed to load request details"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleApprove = async () => {
        try {
            setApproving(true);

            const res = await axios.post(
                `${API_URL}/secretary/requests/${id}/approve`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (res.data.success) {
                setRequest(prev => ({
                    ...prev,
                    status: "Assigned"
                }));
            } else {
                setError(res.data.message);
            }

        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Failed to approve request"
            );
        } finally {
            setApproving(false);
        }
    };

    const handleReject = async (title, text) => {
        try {
            setRejecting(true);

            const res = await axios.post(
                `${API_URL}/secretary/requests/${id}/reject`,
                {rejTitle: title, rejText: text},
                
                {headers: { Authorization: `Bearer ${token}` }}
            );

            if (res.data.success) {
                setRequest(prev => ({
                    ...prev,
                    status: "Rejected"
                }));
                return true;
            } else {
                setError(res.data.message);
                return false;
            }

        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Failed to reject request"
            );
        } finally {
            setRejecting(false);
        }
    };

    if (error) {
        return <h1 className={styles.error}>{error}</h1>;
    }

    if (loading || !request) {
        return <h1 className={styles.loading}>Loading...</h1>;
    }

    return (
        <div className={styles.container}>

            <button className={styles.backBtn} onClick={() => navigate(-1)}>
                <FaArrowLeft /> Back
            </button>

            <RequestDetailsCard request={request} />

            {request.status === "Submitted" || request.status === "Under Review" ? (
                <div className={styles.btnContainer}>
                    <button
                        className={styles.approveBtn}
                        onClick={handleApprove}
                        disabled={approving}
                    >
                        {approving ? "Approving..." : "Approve Request"}
                    </button>

                    <button
                        className={styles.rejectBtn}
                        onClick={() => setShowRejectModal(true)}
                    >
                        {rejecting ? "Rejecting..." : "Reject Request"}
                    </button>
                </div>
            ) : null}

            {showRejectModal && (
                <RejectionReason
                    loading={rejecting}
                    onCancel={() => setShowRejectModal(false)}
                    onSubmit={async ({ title, text }) => {
                        const success = await handleReject(title, text);
                        if (success) {
                            setShowRejectModal(false);
                        }
                    }}
                />
            )}

            <div className={styles.docsBox}>
                <h2 className={styles.sectionTitle}>Citizen Documents</h2>

                {documents.length === 0 ? (
                    <p>No documents found</p>
                ) : (
                    documents.map(doc => (
                        <div key={doc.id} className={styles.docCard}>

                            <div className={styles.docInfo}>
                                <p className={styles.docTitle}>
                                    {doc.type}
                                </p>

                                <p className={styles.meta}>
                                    Uploaded: {doc.uploadedAt}
                                </p>

                                <p className={`${styles.status} ${doc.isValid ? styles.valid : styles.invalid}`}>
                                    {doc.isValid ? "Valid" : "Invalid"}
                                </p>
                            </div>

                            <a
                                href={`${API_URL}${doc.filePath}`}
                                target="_blank"
                                rel="noreferrer"
                                className={styles.viewBtn}
                            >
                                View
                            </a>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}

export default RequestDetails;