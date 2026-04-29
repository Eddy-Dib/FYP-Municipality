import { useState } from "react";
import styles from "./Admin.module.css";

function ServicesConfig() {
    const [services, setServices] = useState([
        { id: 1, name: "Complaints Service", enabled: true },
        { id: 2, name: "Citizen Requests", enabled: true },
        { id: 3, name: "Permit Applications", enabled: true },
        { id: 4, name: "Reports System", enabled: false },
        { id: 5, name: "Fee Payments", enabled: true }
    ]);

    const toggleService = (id) => {
        setServices(
            services.map(service =>
                service.id === id
                    ? { ...service, enabled: !service.enabled }
                    : service
            )
        );
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1>Services Config</h1>
                <p>Enable or disable municipality services</p>
            </div>

            <div className={styles.cards}>
                <div className={styles.card}>
                    <div className={styles.cardTitle}>Total Services</div>
                    <div className={styles.cardValue}>{services.length}</div>
                    <div className={styles.cardSub}>Available in system</div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardTitle}>Enabled</div>
                    <div className={styles.cardValue}>
                        {services.filter(s => s.enabled).length}
                    </div>
                    <div className={styles.cardSub}>Currently active</div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardTitle}>Disabled</div>
                    <div className={styles.cardValue}>
                        {services.filter(s => !s.enabled).length}
                    </div>
                    <div className={styles.cardSub}>Not available</div>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>System Services</h2>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Service Name</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {services.map(service => (
                                <tr key={service.id}>
                                    <td>#{service.id}</td>
                                    <td>{service.name}</td>
                                    <td>
                                        {service.enabled ? "Enabled" : "Disabled"}
                                    </td>
                                    <td>
                                        <button
                                            className={
                                                service.enabled
                                                    ? styles.redBtn
                                                    : styles.greenBtn
                                            }
                                            onClick={() => toggleService(service.id)}
                                        >
                                            {service.enabled ? "Disable" : "Enable"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ServicesConfig;