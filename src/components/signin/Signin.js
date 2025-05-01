import { useRef } from "react";
import { useSelector } from "react-redux";
import { productSelector } from "../../redux/reducers/productReducer";
import { useFunctions } from "../../util/useFunctions";
import { Link } from "react-router-dom";
import SignInStyle from "./signin.module.css";
import CircularProgress from "@mui/material/CircularProgress";

export default function SignIn() {
    // Refs to access form input values
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    // Extract needed state from Redux store
    const { darkMode, loading, navHeight } = useSelector(productSelector);

    // Get signin function from custom hook
    const { signin } = useFunctions();

    return (
        <div style={darkMode ? { backgroundColor: "#3b3b3b", minHeight: `calc(100vh - ${navHeight}px)`, paddingTop: `${navHeight}px`, boxSizing: "border-box" } : undefined}>
            {
                // Conditional rendering based on loading state
                loading ?
                    // Loading spinner display
                    <div className="loadingBox" style={darkMode ? { backgroundColor: "#3b3b3b" } : undefined}>
                        <CircularProgress style={{ color: "#F54A00" }} className="loadingBoxContent" />
                    </div>
                    :
                    // Sign-in form when not loading
                    <div className={SignInStyle.siginBox}>
                        {/* Form heading with dark mode support */}
                        <div className={SignInStyle.heading} style={darkMode ? { color: "#ffffff" } : undefined}>
                            Sign In
                        </div>
                        {/* Email input field */}
                        <div>
                            <input type="text" placeholder="Enter Email" className={SignInStyle.inputField} ref={emailRef} />
                        </div>
                        {/* Password input field */}
                        <div>
                            <input type="password" placeholder="Enter Password" className={SignInStyle.inputField} ref={passwordRef} />
                        </div>
                        {/* Forgot password link */}
                        <div style={{ marginTop: "0.7rem" }}>
                            <Link to="/forgotpassword" className={SignInStyle.createAccount} style={darkMode ? { color: "#ffffff" } : undefined}>
                                Forgot Password
                            </Link>
                        </div>
                        {/* Sign-in button */}
                        <button
                            className={SignInStyle.button}
                            onClick={() => {
                                signin(emailRef.current.value?.trim(), passwordRef.current.value);
                                emailRef.current.value = "";
                                passwordRef.current.value = "";
                            }}
                        >
                            Sign In
                        </button>
                        {/* Sign-up link */}
                        <div>
                            <Link to="/signup" className={SignInStyle.createAccount} style={darkMode ? { color: "#ffffff" } : undefined}>
                                Or SignUp Instead
                            </Link>
                        </div>
                    </div>
            }
        </div>
    )
}