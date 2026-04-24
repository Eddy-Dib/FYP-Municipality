import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import RequestDetailsCard from "../../Components/Card/RequestDetailsCard";
import styles from "./RequestDetailsPage.module.css";

function RequestDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const dummyRequest = {
        requestNumber: `REQ-${id}`,
        type: "Building Permit",
        status: "Submitted",
        dueDate: "2026-05-01",
        description: JSON.stringify({
            property_address: "123 Elm St",
            building_size: "20sqm",
            contractor: "John Doe"
        }),
        citizenName: "Guest Citizen"
    };

    const dummyDocuments = [
        {
            Doc_ID: 1,
            Doc_Type: "National ID",
            DateUploaded: "2026-04-03",
            FilePath: "/files/national_id.pdf",
            IsValid: 1
        },
        {
            Doc_ID: 2,
            Doc_Type: "Proof of Residence",
            DateUploaded: "2026-04-03",
            FilePath: "/files/residence.pdf",
            IsValid: 1
        },
        {
            Doc_ID: 3,
            Doc_Type: "Property Deed",
            DateUploaded: "2026-04-02",
            FilePath: "/files/deed.pdf",
            IsValid: 0
        }
    ];

    const [request] = useState(dummyRequest);
    const [documents] = useState(dummyDocuments);

    return (
        <div className={styles.container}>

            <button className={styles.backBtn} onClick={() => navigate(-1)}>
                <FaArrowLeft /> Back
            </button>

            <RequestDetailsCard request={request} />

            <div className={styles.docsBox}>
                <h2 className={styles.sectionTitle}>Citizen Documents</h2>

                {documents.map(doc => (
                    <div key={doc.Doc_ID} className={styles.docCard}>

                        <div className={styles.docInfo}>
                            <p className={styles.docTitle}>
                                {doc.Doc_Type}
                            </p>

                            <p className={styles.meta}>
                                Uploaded: {doc.DateUploaded}
                            </p>

                            <p className={`${styles.status} ${doc.IsValid ? styles.valid : styles.invalid}`}>
                                {doc.IsValid ? "Valid" : "Invalid"}
                            </p>
                        </div>

                        <a
                            href={doc.FilePath}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.viewBtn}
                        >
                            View
                        </a>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default RequestDetails;