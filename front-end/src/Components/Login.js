import React, { useState } from "react";
import Background from "./Background.png";
import "./Login.css"


function Login() {
    const [showPassword] = useState(false);

    return (
        <div className="container">
            <div
                className="background"
                style={{
                    backgroundImage: `url(${Background})`,
                }}></div>
            <div className="rightbox">
                <h2>Welcome</h2>
                <p>Login to your account</p>

                <form className="loginForm">
                    <div className="inputGroup">
                        <label>Username</label>
                        <input type="text" placeholder="Enter your username" />
                    </div>
                    <div className="inputGroup passwordGroup">
                        <label>Password</label>
                        <input type={showPassword ? "text" : "password"} placeholder="Enter your password" />
                    </div>
                    <button type="submit" className="loginButton">Login</button>
                </form>

                <p className="registerText">
                    Don't have an account?{" "}
                    <span className="registerLink">Register</span>
                </p>
            </div>

        </div>
    );
}
export default Login;