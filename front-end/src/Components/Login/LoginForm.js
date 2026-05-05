import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";
import styles from "./LoginForm.module.css";

function LoginForm() {
    const API_URL = process.env.REACT_APP_API_URL;

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {
            const res = await axios.post(`${API_URL}/auth/login`, {
                username,
                password
            });

            const data = res.data;

            if (data.success) {
                const { token, user } = data.data;

                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));

                if (user.role === "citizen") {
                    navigate("/citizen", { replace: true });
                } else {
                    navigate("/employee", { replace: true });
                }
            }
        } catch (err) {
            setErrorMsg(
                err?.response?.data?.message || "Network error. Try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form className={styles.form} onSubmit={submitHandler}>

                <div className={styles.inputGroup}>
                    <label>Username</label>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Password</label>

                    <div className={styles.inputWrapper}>
                        <input
                            className={styles.input}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <span
                            className={styles.eye}
                            onClick={() => setShowPassword(!showPassword)}
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            {showPassword ? (
                                <AiFillEyeInvisible />
                            ) : (
                                <AiFillEye />
                            )}
                        </span>
                    </div>
                </div>

                <button
                    type="submit"
                    className={styles.button}
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            {errorMsg && <p className={styles.error}>{errorMsg}</p>}
        </>
    );
}

export default LoginForm;