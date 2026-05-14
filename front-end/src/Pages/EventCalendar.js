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
    const [announcements, setAnnouncements] = useState([]);

    // SAFE DATE FORMAT (NO UTC SHIFT)
    const formatDateOnly = (d) => {
        const date = new Date(d);
        return (
            date.getFullYear() +
            "-" +
            String(date.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(date.getDate()).padStart(2, "0")
        );
    };

    // FETCH EVENTS
    const fetchEvents = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/secretary/events`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents(res.data.data || []);
        } catch (err) {
            console.error("Failed to load events", err);
        }
    };

    // FETCH ANNOUNCEMENTS
    const fetchAnnouncements = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/secretary/announcements`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnnouncements(res.data.data || []);
        } catch (err) {
            console.error("Failed to load announcements", err);
        }
    };

    useEffect(() => {
        fetchEvents();
        fetchAnnouncements();
    }, []);

    const selectedDate = formatDateOnly(date);

    // EVENTS FOR SELECTED DAY
    const selectedEvents = events.filter(ev => {
        const start = formatDateOnly(ev.StartDate);
        const end = formatDateOnly(ev.EndDate);
        return selectedDate >= start && selectedDate <= end;
    });

    // ANNOUNCEMENTS FOR SELECTED DAY
    const selectedAnnouncements = announcements.filter(a =>
        formatDateOnly(a.Created_Date) === selectedDate && Number(a.Active_Flag) !== 0
    );

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>

                {/* CALENDAR */}
                <div className={styles.calendarBox}>
                    <Calendar
                        onChange={setDate}
                        value={date}
                        tileClassName={({ date }) => {
                            const d = formatDateOnly(date);

                            const dayEvents = events.filter(ev => {
                                const start = formatDateOnly(ev.StartDate);
                                const end = formatDateOnly(ev.EndDate);
                                return d >= start && d <= end;
                            });

                            const dayAnnouncements = announcements.filter(a =>
                                formatDateOnly(a.Created_Date) === d
                            );

                            const hasEvent = dayEvents.length > 0;
                            const hasAnn = dayAnnouncements.length > 0;

                            const hasCancelledEvent = dayEvents.some(e => e.Active_Flag === 0);

                            const hasActiveEvent = dayEvents.some(e => e.Active_Flag === 1);
                            const hasActiveAnn = dayAnnouncements.some(a => Number(a.Active_Flag) === 1);

                            const classes = [];

                            if (hasActiveEvent) {
                                classes.push("eventDay");
                            }

                            if (hasActiveAnn) {
                                classes.push("announcementDay");
                            }

                            if (
                                (hasCancelledEvent) &&
                                !(hasActiveEvent || hasActiveAnn)
                            ) {
                                classes.push("cancelledDay");
                            }

                            return classes.join(" ");
                        }}
                    />
                </div>

                {/* EVENTS */}
                {selectedEvents.length > 0 && (
                    <div className={styles.eventBox}>
                        {selectedEvents.map(ev => {
                            const isCancelled = ev.Active_Flag === 0;

                            return (
                                <div key={ev.Event_ID} className={styles.eventItem}>

                                    <div className={styles.eventHeader}>
                                        <h3 className={styles.title}>{ev.Name}</h3>

                                        {isCancelled && (
                                            <span className={styles.cancelLabel}>
                                                Cancelled
                                            </span>
                                        )}
                                    </div>

                                    <p className={styles.timeLine}>
                                        ⏰ <strong>Start:</strong>{" "}
                                        {new Date(ev.StartDate).toLocaleString()}
                                    </p>

                                    <p className={styles.timeLine}>
                                        ⏰ <strong>End:</strong>{" "}
                                        {new Date(ev.EndDate).toLocaleString()}
                                    </p>

                                    {!isCancelled && ev.Details && (
                                        <p className={styles.details}>
                                            {ev.Details}
                                        </p>
                                    )}

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

                {/* ANNOUNCEMENTS */}
                
                {selectedAnnouncements.length > 0 && (
                    <div className={styles.announcementBox}>
                        {selectedAnnouncements.map(a => {
                            return (
                                <div key={a.Anc_ID} className={styles.announcementItem}>

                                    <h3 className={styles.announcementTitle}>{a.Name}</h3>

                                    <p className={styles.announcementDate}>
                                         {new Date(a.Created_Date).toLocaleString()}
                                    </p>

                                    <p className={styles.announcementDetails}>
                                        {a.Details}
                                    </p>
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