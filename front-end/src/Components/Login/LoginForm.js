import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import styles from "../../Pages/Login.module.css"; 
import axios from "axios";

function LoginForm() {
    const API_URL = process.env.REACT_APP_API_URL;

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {
            const res = await axios.post(`${API_URL}/auth/login`, { username, password });

            const data = res.data;

            if (data.success) {
                const {token, user} = data.data;
                localStorage.setItem("token", token); // stores token to remember login

                // stores role and name for easy access when needed
                localStorage.setItem("role", user.role);
                localStorage.setItem("name", user.name);

                alert(`Welcome, ${data.data.user.name}! Your role is: ${data.data.user.role}`);
                
                // Redirect happens her
                // Welcome message and post-login actions can be defined later

            }
        } catch (err) {
            if(err.response){  // the server responded with our error message
                setErrorMsg(err.response.data.message);
            } else { // unexpected error
                setErrorMsg("Network error. Try again later.");
            }
            //console.table(err.response.data);

        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <form className={styles.loginForm} onSubmit={submitHandler}>
                <div className={styles.inputGroup}>
                    <label>Username</label>
                    <input
                        type="text"
                        placeholder="Enter your UserName"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} />
                </div>

                <div className={`${styles.inputGroup} ${styles.passwordGroup}`}>
                    <label>Password</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                            className={styles.eye}
                            onClick={() => setShowPassword(!showPassword)}
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                        </span>
                    </div>
                </div>

                <button type="submit" className={styles.loginButton} disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            {errorMsg && <p className={styles.error}>{errorMsg}</p>}
        </>
    );
}

export default LoginForm;