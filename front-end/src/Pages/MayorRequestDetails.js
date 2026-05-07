import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";

import RequestDetailsCard from "../Components/Card/RequestDetailsCard";
import ReportDetailsCard from "../Components/Card/ReportDetailsCard";
import RejectionReason from "../Components/Form/RejectionReason";

import styles from "./MayorRequestDetails.module.css";

function MayorRequestDetails() {
    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const { id } = useParams();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [approving, setApproving] = useState(false);
    const [rejecting, setRejecting] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const res = await axios.get(
                    `${API_URL}/api/mayor/requests/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setData(res.data.data);
            } catch (err) {
                setError(err?.response?.data?.message || "Failed to load request details");
            } finally {
                setLoading(false);
            }
        };

        fetchRequest();
    }, [API_URL, id]);

    const handleApprove = async () => {
        try {
            setApproving(true);

            const res = await axios.post(
                `${API_URL}/api/mayor/requests/${id}/approve`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (res.data.success) {
                setData(prev => ({
                    ...prev,
                    request: {
                        ...prev.request,
                        status: "Completed"
                    }
                }));

                //alert("Document issued successfully");
                const fileURL = res.data.data.fileURL;
                window.open(fileURL, "_blank")
                return;
            }

            setError(res.data.message || "Approval failed");

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

            const res = await axios.post(`${API_URL}/secretary/requests/${id}/reject`,
                {
                    rejTitle: title,
                    rejText: text
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (res.data.success) {
                setData(prev => ({
                    ...prev,
                    request: {
                        ...prev.request,
                        status: "Rejected"
                    }
                }));

                return true;
            }

            setError(res.data.message);
            return false;

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to reject request"
            );

            return false;

        } finally {
            setRejecting(false);
        }
    };

    if (loading) return <h2>Loading...</h2>;
    if (error) return <h2>{error}</h2>;
    if (!data) return <h2>No data found</h2>;

    return (
        <div className={styles.container}>

            <button className={styles.backBtn} onClick={() => navigate(-1)}>
                <FaArrowLeft /> Back
            </button>

            <h1 className={styles.title}>
                Request Review #{id}
            </h1>

            <div className={styles.cardContainer}>
                <RequestDetailsCard request={data.request} />
                <ReportDetailsCard report={data.report} />
            </div>

            <div className={styles.actions}>
                <button
                    className={styles.approveBtn}
                    onClick={handleApprove}
                    disabled={approving}
                >
                    {approving ? "Processing..." : "Approve & Issue Document"}
                </button>

                <button
                    className={styles.rejectBtn}
                    onClick={() => setShowRejectModal(true)}
                >
                    {rejecting ? "Rejecting..." : "Reject Request"}
                </button>
            </div>

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
        </div>
    );
}

export default MayorRequestDetails;