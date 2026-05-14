import React, { useState } from "react";
import Card from "./Card";
import styles from "./OperationsChainCard.module.css";
import { FaFilePdf, FaChevronDown, FaChevronUp, FaFileAlt } from "react-icons/fa";
import { PriorityBadge, StatusBadge } from "../UI/Badge";

function OperationsChainCard({ data, onSelect }) {
    const [open, setOpen] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL;
    if (!data) return null;

    const {
        requestNumber,
        requestTitle,
        type,
        status,
        citizen,
        date,
        task,
        report,
        issuedDocument
    } = data;

    return (
        <Card className={styles.card} onClick={() => onSelect && onSelect(data)}>

            <div className={styles.middle}>

                <div className={styles.header}>
                    <h3 className={styles.title}>
                        {requestNumber}: {requestTitle}
                    </h3>

                    <button
                        className={styles.toggle}
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen(!open);
                        }}
                    >
                        {open ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                </div>

                <p>
                    <strong>Type:</strong> {type}
                </p>

                <p>
                    <strong>Citizen:</strong>{" "}
                    {typeof citizen === "string"
                        ? citizen
                        : JSON.stringify(citizen)}
                </p>

                <p>
                    <strong>Date:</strong> {date?.split("T")[0]}
                </p>

                {task?.priority !== undefined && (
                    <p>
                        <strong>Priority:</strong>{" "}
                        <PriorityBadge value={task.priority} />
                    </p>
                )}

                {status && (
                    <p>
                        <strong>Status:</strong>{" "}
                        <StatusBadge value={status} />
                    </p>
                )}

                {open && (
                    <div className={styles.expanded}>

                        <div className={styles.block}>
                            <h3 className={styles.blockTitle}>Task</h3>

                            {task ? (
                                <>
                                    <p>
                                        Assigned to{" "}
                                        <strong>{task.assignedTo}</strong>
                                    </p>
                                    <p>
                                        Status:{" "}
                                        <StatusBadge value={task.status} />
                                    </p>
                                </>
                            ) : (
                                <p>No task assigned</p>
                            )}
                        </div>

                        <div className={styles.block}>
                            <h3 className={styles.blockTitle}>Report</h3>

                            {report ? (
                                typeof report === "string" ? (
                                    <p>{report}</p>
                                ) : (
                                    <div>
                                        <p>
                                            <strong>Title:</strong> {report.title}
                                        </p>
                                        <p>{report.text}</p>
                                    </div>
                                )
                            ) : (
                                <p>No report available</p>
                            )}
                        </div>

                        <div className={styles.block}>
                            <p className={styles.blockTitle}>Issued Document</p>

                            <p>
                                {issuedDocument?.exists ? "YES" : "NO"}
                            </p>

                            {issuedDocument?.exists && issuedDocument?.url && (
                                <a
                                    href={API_URL + issuedDocument.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={styles.pdf}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <FaFilePdf /> View PDF
                                </a>
                            )}
                        </div>

                    </div>
                )}
            </div>

            <div className={styles.right}>
                <FaFileAlt />
            </div>

        </Card>
    );
}

export default OperationsChainCard;