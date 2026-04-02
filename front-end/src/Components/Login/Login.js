import { useState } from "react";
import Background from "../../Assets/Background.png";
import styles from  "./Login.module.css";

import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";

function Login() {
    const [isRegister, setIsRegister] = useState(false);
    return (
        <div className={styles.container}>

            <div className={styles.background} style={{ backgroundImage: `url(${Background})` }}></div>

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

            </div>
        </div>
    );
}
export default Login;