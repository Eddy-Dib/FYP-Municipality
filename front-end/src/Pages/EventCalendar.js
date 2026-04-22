import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./EventCalendar.module.css";

function EventCalendar() {

    const [date, setDate] = useState(new Date());

    const events = [

        {
            date: "2026-04-20",
            title: "Trash Collection",
            time: "08:00 AM",
            type: "waste",
            details: "Full municipal waste and recycling pickup."
        },
        {
            date: "2026-04-23",
            title: "Trash Collection",
            time: "08:00 AM",
            type: "waste",
            details: "Standard waste collection for all sectors."
        },
        {
            date: "2026-04-27",
            title: "Trash Collection",
            time: "08:00 AM",
            type: "waste",
            details: "Standard waste collection for all sectors."
        },
        {
            date: "2026-04-30",
            title: "Trash Collection",
            time: "08:00 AM",
            type: "waste",
            details: "Standard waste collection for all sectors."
        },

        {
            date: "2026-04-20",
            title: "Road Maintenance Briefing",
            time: "09:00 AM",
            type: "meeting",
            details: "Public session regarding infrastructure upgrades on Main St."
        },
        {
            date: "2026-05-05",
            title: "Urban Planning Committee",
            time: "10:00 AM",
            type: "meeting",
            details: "Review of new construction permits and zoning laws."
        },

        {
            date: "2026-05-12",
            title: "Scheduled Water Maintenance",
            time: "08:00 AM",
            type: "utility",
            details: "Network maintenance. Possible low pressure in Northern Districts."
        },
        {
            date: "2026-05-20",
            title: "Grid Optimization Work",
            time: "09:00 AM",
            type: "utility",
            details: "Electrical grid upgrades to improve local power stability."
        },

        {
            date: "2026-06-15",
            title: "Annual Summer Festival",
            time: "06:00 PM",
            type: "festival",
            details: "Live music, local vendors, and family activities in City Square."
        },
        {
            date: "2026-07-10",
            title: "Heritage & Cultural Night",
            time: "07:30 PM",
            type: "festival",
            details: "Celebrating local history through art and performance."
        },
        {
            date: "2026-08-05",
            title: "Regional Gastronomy Fair",
            time: "05:00 PM",
            type: "festival",
            details: "Showcasing traditional cuisine and artisanal food products."
        }
    ];

    const getEvents = (dateObj) => {
        const d = dateObj.toISOString().split("T")[0];
        return events.filter(e => e.date === d);
    };

    const selectedEvents = getEvents(date);

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>

                <div className={styles.calendarBox}>
                    <Calendar
                        onChange={setDate}
                        value={date}
                        tileClassName={({ date }) =>
                            getEvents(date).length > 0 ? styles.eventDay : ""
                        }
                    />
                </div>

                {selectedEvents.length > 0 && (
                    <div className={styles.eventBox}>
                        {selectedEvents.map((ev, i) => (
                            <div key={i} className={styles.eventItem}>
                                <h3>{ev.title}</h3>
                                <p>🕒 {ev.time}</p>
                                <p>{ev.details}</p>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

export default EventCalendar;