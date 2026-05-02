import { useState } from "react";
import styles from "./RejectionReason.module.css";

function RejectionReason({ onSubmit, onCancel, loading = false }) {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [error, setError] = useState("");


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim() || !text.trim()){
            setError("All fields are required");
            return;
        };

        setError("");

        onSubmit({
            title,
            text
        });
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>

                <h2 className={styles.heading}>Add Rejection Reason</h2>

                <form onSubmit={handleSubmit} className={styles.form}>

                    <div className={styles.field}>
                        <label>Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter title..."
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Message</label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Explain why the request is rejected..."
                            rows={4}
                        />
                    </div>

                    {error && (
                        <p className={styles.errorText}>{error}</p>
                    )}

                    <div className={styles.actions}>
                        <button
                            type="button"
                            onClick={onCancel}
                            className={styles.cancelBtn}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className={styles.submitBtn}
                        >
                            {loading ? "Sending..." : "Send"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default RejectionReason;