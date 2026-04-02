import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import styles from "./Login.module.css";

function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form className={styles.loginForm}>
            {/* Username */}
            <div className={styles.inputGroup}>
                <label>Username</label>
                <input type="text" placeholder="Enter your UserName" />
            </div>

            {/* Password */}
            <div className={`${styles.inputGroup} ${styles.passwordGroup}`}>
                <label>Password</label>
                <div className={styles.inputWrapper}>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your Password"
                    />
                    <span
                        className={styles.eye}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </span>
                </div>
            </div>

            <button type="submit" className={styles.loginButton}>
                Login
            </button>
        </form>
    );
}

export default LoginForm;