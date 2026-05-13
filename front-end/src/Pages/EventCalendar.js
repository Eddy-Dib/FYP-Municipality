import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import "react-calendar/dist/Calendar.css";
import styles from "./EventCalendar.module.css";

function EventCalendar() {
    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);

    // FETCH EVENTS
    const fetchEvents = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/secretary/events`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setEvents(res.data.data || []);
        } catch (err) {
            console.error("Failed to load events", err);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const formatDate = (d) => new Date(d).toISOString().split("T")[0];

    // GET EVENTS FOR SELECTED DAY
    const getEvents = (dateObj) => {
        const d = dateObj.toISOString().split("T")[0];

        return events.filter(ev => {
            const start = formatDate(ev.StartDate);
            const end = formatDate(ev.EndDate);
            return d >= start && d <= end;
        });
    };

    const selectedEvents = getEvents(date);

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>

                {/* CALENDAR */}
                <div className={styles.calendarBox}>
                    <Calendar
                        onChange={setDate}
                        value={date}

                        // ✅ IMPORTANT FIX: NO styles.eventDay here
                        tileClassName={({ date }) => {
                            const d = date.toISOString().split("T")[0];

                            const dayEvents = events.filter(ev => {
                                const start = formatDate(ev.StartDate);
                                const end = formatDate(ev.EndDate);
                                return d >= start && d <= end;
                            });

                            if (dayEvents.length === 0) return "";

                            const hasCancelled = dayEvents.some(ev => ev.Active_Flag === 0);
                            const hasActive = dayEvents.some(ev => ev.Active_Flag === 1);

                            if (hasCancelled && !hasActive) return "cancelledDay";
                            if (hasActive) return "eventDay";

                            return "";
                        }}
                    />
                </div>

                {/* EVENT BOX */}
                {selectedEvents.length > 0 && (
                    <div className={styles.eventBox}>
                        {selectedEvents.map((ev) => {
                            const isCancelled = ev.Active_Flag === 0;

                            return (
                                <div key={ev.Event_ID} className={styles.eventItem}>

                                    {/* HEADER ROW */}
                                    <div className={styles.eventHeader}>
                                        <h3 className={styles.title}>
                                            {ev.Name}
                                        </h3>

                                        {isCancelled && (
                                            <span className={styles.cancelLabel}>
                                                Cancelled
                                            </span>
                                        )}
                                    </div>

                                    {/* TIME */}
                                    <p className={styles.timeLine}>
                                        ⏰ <strong>Start:</strong>{" "}
                                        {new Date(ev.StartDate).toLocaleString()}
                                    </p>

                                    <p className={styles.timeLine}>
                                        ⏰ <strong>End:</strong>{" "}
                                        {new Date(ev.EndDate).toLocaleString()}
                                    </p>

                                    {/* DETAILS */}
                                    {!isCancelled && ev.Details && (
                                        <p className={styles.details}>
                                            {ev.Details.split("\n").map((line, i) => (
                                                <span key={i}>
                                                    {line}
                                                    <br />
                                                </span>
                                            ))}
                                        </p>
                                    )}

                                    {/* CANCELLED TEXT */}
                                    {isCancelled && (
                                        <p className={styles.cancelText}>
                                            This event was cancelled
                                        </p>
                                    )}

                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default EventCalendar;