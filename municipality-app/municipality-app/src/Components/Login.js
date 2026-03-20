import React, { useState } from "react";
import styles from "./Login.module.css";
import Register from "./Register";
import bg from "../assets/bg.jpeg"; // ✅ IMPORT IMAGE

function Login() {
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = () => {
    const users = [
      { username: "citizen1", password: "123", role: "citizen" },
      { username: "secretary1", password: "456", role: "secretary" },
    ];

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      setMessage(`✅ Welcome ${user.role}`);
    } else {
      setMessage("❌ Incorrect username or password");
    }
  };

  if (showRegister) return <Register goBack={() => setShowRegister(false)} />;

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url(${bg})`, // ✅ HERE
      }}
    >
      <div className={styles.formCenter}>
        <input
          type="text"
          placeholder="Email"
          className={styles.input}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className={styles.button} onClick={handleLogin}>
          Log in
        </button>

        <p className={styles.link}>Forget password?</p>

        <p
          className={styles.register}
          onClick={() => setShowRegister(true)}
        >
          Don't have an account? Register
        </p>

        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
}

export default Login;