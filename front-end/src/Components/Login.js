import { useState } from "react";
import Background from "./Background.png";
import "./Login.css";

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    return (
        <div className="container">

            <div className="background" style={{ backgroundImage: `url(${Background})` }}></div>

            <div className={`rightBox ${isRegister ? "register" : ""}`}>

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

                {!isRegister ? (

                    <form className="loginForm">

                        <div className="inputGroup">
                            <label> Username </label>
                            <input type="text" placeholder="Enter your UserName " />
                        </div>

                        <div className="inputGroup passwordGroup">
                            <label> Password </label>
                            <input type={showPassword ? "text" : "password"} placeholder="Enter your Password" />
                            <span className="eye" onClick={() => setShowPassword(!showPassword)}></span>
                        </div>

                        <button type="submit" className="loginButton"> Login </button>

                    </form>

                ) : (

                    <form className="loginForm">

                        <div className="inputGroup">
                            <label> Full Name </label>
                            <input type="text" placeholder="Enter your Full Name" />
                        </div>

                        <div className="inputGroup">
                            <label> ID Number </label>
                            <input type="text" placeholder="Enter your ID number " />
                        </div>

                        <div className="inputGroup">
                            <label> Phone Number </label>
                            <input type="text" placeholder="Enter your Phone number " />
                        </div>

                        <div className="inputGroup">
                            <label> Email </label>
                            <input type="email" placeholder="Enter your Email" />
                        </div>

                        <button type="submit" className="loginButton"> Send Request </button>

                        <p className="registerText" onClick={() => isRegister(false)}> </p>


                    </form>

                )}

                {!isRegister && (
                    <p className="registerText">
                        Don't have an account?{""}
                        <span className="registerLink" onClick={() => setIsRegister(true)}> Register </span>
                    </p>
                )}

            </div>
        </div>
    );
}
export default Login;