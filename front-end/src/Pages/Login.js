import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Background from "../Assets/Background.png";
import styles from  "./Login.module.css";

import RegisterForm from "../Components/Login/RegisterForm";
import LoginForm from "../Components/Login/LoginForm";

function Login() {
    const [isRegister, setIsRegister] = useState(false);
    const navigate = useNavigate();

    // to stay logged in
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (user) {
            if (user.role === "citizen") {
                navigate("/citizen", { replace: true });
            } else {
                navigate("/employee", { replace: true });
            }
        }
    }, []);

    return (
        <div className={styles.container}>

            <div className={styles.background} style={{ backgroundImage: `url(${Background})` }}/>

            <div className={`${styles.rightBox} ${isRegister ? styles.register : ""}`}>

                {!isRegister && (
                    <>
                        <h2> Welcome </h2>
                        <p> Login to your account </p>
                    </>
                )}

                {isRegister && (
                    <>
                        <h3> Request </h3>
                        <p> Send your information to the municipality </p>

                    </>
                )}

                {!isRegister ? <LoginForm/> : <RegisterForm/>}

                {!isRegister && (
                    <p className={styles.registerText}>
                        Don't have an account?{""}
                        <span className={styles.registerLink} onClick={() => setIsRegister(true)}> Register </span>
                    </p>
                )}

                {isRegister && (
                    <p className={styles.registerLink} onClick={() => setIsRegister(false)}> &lt; Back to Login  </p>
                )}

            </div>
        </div>
    );
}
export default Login;