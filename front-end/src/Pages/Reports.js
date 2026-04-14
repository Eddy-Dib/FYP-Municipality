import ReportCard from "../Components/Card/ReportCard";
import styles from "./Reports.module.css";

function Reports() {

    const reports = [
        {
            title: "Water Pipeline Inspection Report",
            type: "Inspection",
            requestId: "REQ-5532",
            taskId: "TASK-101",
            date: "2026-04-15"
        },
        {
            title: "Building Permit Approval Report",
            type: "Approval",
            requestId: "REQ-5511",
            taskId: "TASK-102",
            date: "2026-04-18"
        },
        {
            title: "Road Damage Analysis",
            type: "Analysis",
            requestId: "REQ-5499",
            taskId: "TASK-103",
            date: "2026-04-10"
        }
    ];

    return (
        <>
            <h1 className={styles.title}>Reports</h1>

            {/* FOR LATER: might need to filter reports by type or something
            <div className={styles.ribbon}>
                {["All", "Inspection", "Approval", "Analysis"].map(tab => (
                    <button
                        key={tab}
                        className={`${styles.tab} ${styles.active}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            */}

            <div className={styles.list}>
                {reports.map((report, index) => (
                    <ReportCard
                        key={index}
                        title={report.title}
                        type={report.type}
                        requestId={report.requestId}
                        taskId={report.taskId}
                        date={report.date}
                        onView={() => console.log("View report", report.title)}
                        onDownload={() => console.log("Download report", report.title)}
                    />
                ))}
            </div>
        </>
    );
}

export default Reports;