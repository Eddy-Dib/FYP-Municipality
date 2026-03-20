import React, { useState } from "react";
import styles from "./Register.module.css";
import bg from "../assets/bg.jpeg"; // ✅ IMPORT

function Register({ goBack }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    birthdate: "",
  });

  const handleSubmit = () => {
    console.log("User request:", form);
    alert("✅ Request sent to secretary!");
    goBack();
  };

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url(${bg})`, // ✅ HERE
      }}
    >
      <div className={styles.formCenter}>
        <h2 className={styles.title}>Register</h2>

        <input
          placeholder="First Name"
          className={styles.input}
          onChange={(e) =>
            setForm({ ...form, firstName: e.target.value })
          }
        />

        <input
          placeholder="Last Name"
          className={styles.input}
          onChange={(e) =>
            setForm({ ...form, lastName: e.target.value })
          }
        />

        <input
          placeholder="Age"
          className={styles.input}
          onChange={(e) =>
            setForm({ ...form, age: e.target.value })
          }
        />

        <input
          type="date"
          className={styles.input}
          onChange={(e) =>
            setForm({ ...form, birthdate: e.target.value })
          }
        />

        <button className={styles.button} onClick={handleSubmit}>
          Confirm
        </button>

        <p className={styles.link} onClick={goBack}>
          Back to Login
        </p>
      </div>
    </div>
  );
}

export default Register;