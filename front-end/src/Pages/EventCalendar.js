import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./EventCalendar.module.css";

function EventCalendar() {

    const [date, setDate] = useState(new Date());
    //const [expanded, setExpanded] = useState(false);

    const events = [

    /* 🗑️ WEEKLY TRASH (EVERY WEEK) */
    { date: "2026-04-20", title: "Trash Collection", time: "8:00 AM", details: "All waste types collection" },
    { date: "2026-04-23", title: "Trash Collection", time: "8:00 AM", details: "All waste types collection" },

    { date: "2026-04-27", title: "Trash Collection", time: "8:00 AM", details: "All waste types collection" },
    { date: "2026-04-30", title: "Trash Collection", time: "8:00 AM", details: "All waste types collection" },

    /* 🏗️ MUNICIPALITY MEETINGS */
    { date: "2026-04-20", title: "Road Repair Meeting", time: "9:00 AM", details: "Planning road maintenance in main streets" },
    { date: "2026-05-05", title: "Urban Planning Meeting", time: "10:00 AM", details: "Discussing new construction permits" },

    /* 🎉 FESTIVALS (SUMMER) */
    { date: "2026-06-15", title: "Summer Festival", time: "6:00 PM", details: "Music, food, and activities in the main square" },
    { date: "2026-07-10", title: "Cultural Night", time: "7:30 PM", details: "Local artists and performances" },
    { date: "2026-08-05", title: "Food Festival", time: "5:00 PM", details: "Traditional food and family activities" },

    /* 🚧 INFRASTRUCTURE EVENTS */
    { date: "2026-05-12", title: "Water Maintenance", time: "8:00 AM", details: "Temporary water interruption in some areas" },
    { date: "2026-05-20", title: "Electricity Upgrade", time: "9:00 AM", details: "Power system improvement work" },

    /* 📅 NEXT MONTH TRASH (MAY) */
    { date: "2026-05-04", title: "Trash Collection", time: "8:00 AM", details: "All waste types collection" },
    { date: "2026-05-07", title: "Trash Collection", time: "8:00 AM", details: "All waste types collection" },
    { date: "2026-05-11", title: "Trash Collection", time: "8:00 AM", details: "All waste types collection" },
    { date: "2026-05-14", title: "Trash Collection", time: "8:00 AM", details: "All waste types collection" }

    ];

    const getEvents = (dateObj) => {
    const d = dateObj.toISOString().split("T")[0];
    return events.filter(e => e.date === d); // ✅ ALWAYS ARRAY
};

    //const handleDateChange = (selectedDate) => {
        //setDate(selectedDate);

        //const event = getEvent(selectedDate);
       // if (event) {
            //setExpanded(true); // 🔥 expand ONLY if event exists
        //}
    //};

    const selectedEvents = getEvents(date);

    return (
       <div className={styles.wrapper}>
            <div className={styles.container}>

                {/* 📅 CALENDAR */}
                <div className={styles.calendarBox}>
                    <Calendar
                        onChange={setDate}
                        value={date}
                        tileClassName={({ date }) =>
                            getEvents(date).length > 0 ? styles.eventDay : ""
                        }
                    />
                </div>

                {/* 📌 EVENT BOX (NOW BELOW) */}
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