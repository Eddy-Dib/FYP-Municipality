import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import styles from "./EventCalendar.module.css";

function EventCalendar() {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/citizen/events`);
                setEvents(res.data.data || []);
            } catch (err) {
                console.error("Failed to load events", err);
            }
        };

        fetchEvents();
    }, []);

    const formatDate = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const getEvents = (dateObj) => {
        const selected = formatDate(dateObj);

        return events.filter(e => {
            const eventDate = formatDate(new Date(e.StartDate));
            return eventDate === selected;
        });
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
                        {selectedEvents.map((ev) => (
                            <div key={ev.Event_ID} className={styles.eventItem}>
                                <h3>{ev.Name}</h3>
                                <p>
                                    🕒 {new Date(ev.StartDate).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </p>
                                <p>{ev.Details}</p>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

export default EventCalendar;