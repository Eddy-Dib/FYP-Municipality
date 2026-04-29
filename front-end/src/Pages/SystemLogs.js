import styles from "./Admin.module.css";

function SystemLogs() {
    const logs = [
        {
            id: 1,
            title: "New employee approved",
            meta: "Admin approved Maya Elias • 2 minutes ago"
        },
        {
            id: 2,
            title: "Role updated",
            meta: "Karim Raad changed from Staff to Engineer • 15 minutes ago"
        },
        {
            id: 3,
            title: "Service disabled",
            meta: "Reports System disabled by Admin • 1 hour ago"
        },
        {
            id: 4,
            title: "User rejected",
            meta: "Ali Hassan registration rejected • 2 hours ago"
        },
        {
            id: 5,
            title: "Service enabled",
            meta: "Permit Applications enabled • Today"
        }
    ];

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1>System Logs</h1>
                <p>Track every important action in the municipality system</p>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Recent Activity</h2>

                <div className={styles.logBox}>
                    {logs.map(log => (
                        <div key={log.id} className={styles.logItem}>
                            <div className={styles.logTitle}>{log.title}</div>
                            <div className={styles.logMeta}>{log.meta}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SystemLogs;