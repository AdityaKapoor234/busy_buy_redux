import { useRef } from "react";
import { useSelector } from "react-redux";
import { productSelector } from "../../redux/reducers/productReducer";
import { useFunctions } from "../../util/useFunctions";
import SignInStyle from "../signin/signin.module.css";

export default function SignUp() {
    // Create refs to access form input values
    const nameRef = useRef(null);
    const passwordRef = useRef(null);
    const emailRef = useRef(null);

     // Get darkMode setting from Redux store
    const { darkMode, navHeight } = useSelector(productSelector);

    // Get signup function from custom hook
    const { signup } = useFunctions();

    return (
        <div style={darkMode ? { backgroundColor: "#3b3b3b", minHeight: `calc(100vh - ${navHeight}px)`, paddingTop: `${navHeight}px`, boxSizing: "border-box" } : undefined}>
            {/* Sign-up form container */}
            <div className={SignInStyle.siginBox}>
                {/* Form heading with dark mode text color */}
                <div className={SignInStyle.heading} style={darkMode ? { color: "#ffffff" } : undefined}>
                    Sign Up
                </div>
                {/* Name input field */}
                <div>
                    <input type="text" placeholder="Enter Name" className={SignInStyle.inputField} ref={nameRef} />
                </div>

                {/* Email input field */}
                <div>
                    <input type="text" placeholder="Enter Email" className={SignInStyle.inputField} ref={emailRef} />
                </div>

                {/* Password input field */}
                <div>
                    <input type="password" placeholder="Enter Password" className={SignInStyle.inputField} ref={passwordRef} />
                </div>

                {/* Sign-up button */}
                <div
                    className={SignInStyle.button}
                    onClick={() => signup(nameRef.current.value?.trim(), emailRef.current.value?.trim(), passwordRef.current.value)}
                >
                    Sign Up
                </div>
            </div>
        </div>
    )
}