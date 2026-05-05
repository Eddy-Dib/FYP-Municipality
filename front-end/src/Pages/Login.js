import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Background from "../Assets/Background.png";
import styles from "./Login.module.css";

import RegisterForm from "../Components/Login/RegisterForm";
import LoginForm from "../Components/Login/LoginForm";

function Login() {
    const [isRegister, setIsRegister] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (user) {
            if (user.role === "citizen") {
                navigate("/citizen", { replace: true });
            } else {
                navigate("/employee", { replace: true });
            }
        }
    }, [navigate]);

    return (
        <div className={styles.container}>

            <div
                className={styles.background}
                style={{ backgroundImage: `url(${Background})` }}
            />

            <div className={styles.rightBox}>

                {!isRegister ? (
                    <>
                        <h2>Welcome</h2>
                        <p>Login to your account</p>
                    </>
                ) : (
                    <>
                        <h2>Request Access</h2>
                        <p>Send your information to the municipality</p>
                    </>
                )}

                <div className={styles.formContainer}>
                    {!isRegister ? <LoginForm /> : <RegisterForm />}
                </div>

                {!isRegister ? (
                    <p className={styles.switchText}>
                        Don't have an account?
                        <span
                            className={styles.link}
                            onClick={() => setIsRegister(true)}
                        >
                            {" "}Register
                        </span>
                    </p>
                ) : (
                    <p className={styles.link} onClick={() => setIsRegister(false)}>
                        ← Back to Login
                    </p>
                )}

            </div>
        </div>
    );
}

export default Login;