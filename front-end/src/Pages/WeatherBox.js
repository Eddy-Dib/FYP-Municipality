import React, { useEffect, useState } from "react";
import styles from "./WeatherBox.module.css";

const WeatherBox = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=Beirut&units=metric&appid=32a5ec5e465332db1ef33e2c1739c70b"
    )
      .then((res) => res.json())
      .then((data) => setWeather(data));
  }, []);

  if (!weather) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.card}>
      <div className={styles.overlay}></div>

      {/* 🌄 PUT YOUR IMAGE HERE */}
      <div className={styles.bg}></div>

      <div className={styles.content}>
        <div className={styles.top}>
          <p className={styles.date}>
            {new Date().toLocaleString("en-US", {
              weekday: "long",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          <h1 className={styles.temp}>{Math.round(weather.main.temp)}°C</h1>

          <p className={styles.desc}>{weather.weather[0].description}</p>
          <p className={styles.city}>{weather.name}</p>
        </div>

        <div className={styles.bottom}>
          <div>💧 {weather.main.humidity}%</div>
          <div>🌬 {weather.wind.speed} km/h</div>
        </div>
      </div>
    </div>
  );
};

export default WeatherBox;