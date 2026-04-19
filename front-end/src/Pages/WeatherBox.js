import React, { useEffect, useState } from "react";
import styles from "./WeatherBox.module.css";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";

const WeatherBox = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=Beirut&units=metric&appid=32a5ec5e465332db1ef33e2c1739c70b"
    )
      .then((res) => res.json())
      .then((data) => setWeather(data));
  }, []);

  const getWeatherIcon = () => {
    const main = weather.weather[0].main.toLowerCase();

    if (main.includes("cloud")) return "☁️";
    if (main.includes("rain")) return "🌧";
    if (main.includes("clear")) return "☀️";
    if (main.includes("storm")) return "⛈";
    if (main.includes("snow")) return "❄️";
    if (main.includes("mist")) return "🌫";

    return "🌤";
  };

  const getBackground = () => {
    const main = weather.weather[0].main.toLowerCase();

    if (main.includes("cloud")) return require("../Assets/cloud.jpg");
    if (main.includes("rain")) return require("../Assets/Rain.jpg");
    if (main.includes("clear")) return require("../Assets/clear.jpg");
    if (main.includes("storm")) return require("../Assets/Storm.jpg");
    if (main.includes("snow")) return require("../Assets/Snow.jpg");

    return require("../Assets/default.jpg");
  };

  if (!weather) return <div className={styles.loading}>Loading...</div>;

  const forecastData = [
    { day: "Mon", temp: 18 },
    { day: "Tue", temp: 21 },
    { day: "Wed", temp: 17 },
    { day: "Thu", temp: 23 },
    { day: "Fri", temp: 20 },
  ];

  return (
    <div className={styles.card}>
      <div
        className={styles.bg}
        style={{ backgroundImage: `url(${getBackground()})` }}
      ></div>

      <div className={styles.overlay}></div>

      {/* LEFT */}
      <div className={styles.left}>
        <h1 className={styles.title}>Weather in {weather.name}</h1>
        <p className={styles.subtitle}>
          Stay updated with real-time weather conditions in your municipality.
        </p>

        <div className={styles.graph}>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={forecastData}>

              {/* gradient */}
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="day"
                stroke="rgba(255,255,255,0.7)"
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                contentStyle={{
                  background: "rgba(0,0,0,0.6)",
                  border: "none",
                  borderRadius: "10px",
                  color: "white"
                }}
              />

              {/* smooth curve */}
              <Area
                type="monotone"
                dataKey="temp"
                stroke="#ffffff"
                strokeWidth={3}
                fill="url(#colorTemp)"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RIGHT */}
      <div className={styles.right}>
        <p className={styles.date}>
          {new Date().toLocaleString("en-US", {
            weekday: "long",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        <h1 className={styles.temp}>
          {getWeatherIcon()} {Math.round(weather.main.temp)}°C
        </h1>

        <p className={styles.desc}>{weather.weather[0].description}</p>

        <div className={styles.bottom}>
          <div>💧 {weather.main.humidity}%</div>
          <div>🌬 {weather.wind.speed} km/h</div>
        </div>

        {/* small cities (fake for now) */}
        <div className={styles.cities}>
          <div className={styles.cityCard}>Tripoli 20°C</div>
          <div className={styles.cityCard}>Sidon 19°C</div>
          <div className={styles.cityCard}>Byblos 18°C</div>
        </div>
      </div>
    </div>
  );
};

export default WeatherBox;