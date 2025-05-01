import { useRef } from "react";
import { useSelector } from "react-redux";
import { productSelector } from "../../redux/reducers/productReducer";
import { useFunctions } from "../../util/useFunctions";
import SignInStyle from "../signin/signin.module.css";

export default function ForgotPassword() {
    // Create a ref to access the email input DOM element
    const emailRef = useRef(null);

    // Extract darkMode, navHeight theme preference from Redux store
    const { darkMode, navHeight } = useSelector(productSelector);

    // Destructure forgotPassword function from custom hook
    const { forgotPassword } = useFunctions();

    return (
        <div style={darkMode ? { backgroundColor: "#3b3b3b", minHeight: `calc(100vh - ${navHeight}px)`, paddingTop: `${navHeight}px`, boxSizing: "border-box" } : undefined}>
            {/* Sign-in styled box container for consistent look */}
            <div className={SignInStyle.siginBox}>
                {/* Heading with conditional dark mode text color */}
                <div className={SignInStyle.heading} style={darkMode ? { color: "#ffffff" } : undefined}>
                    Forgot Password
                </div>
                {/* Email input field */}
                <div>
                    <input type="text" placeholder="Enter Email ID" className={SignInStyle.inputField} ref={emailRef} />
                </div>
                {/* Submit button */}
                <div
                    className={SignInStyle.button}
                    onClick={() => forgotPassword(emailRef.current.value?.trim())}
                >
                    Submit
                </div>
            </div>
        </div>
    )
}