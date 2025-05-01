import { useSelector } from "react-redux";
import { productSelector } from "../../redux/reducers/productReducer";
import Navbar from "../navbar/Navbar"

export default function ErrorPage() {
    // Extract darkMode theme preference from Redux store
    const { darkMode } = useSelector(productSelector);

    return (
        <div style={darkMode ? { backgroundColor: "#3b3b3b", color: "white", minHeight: `100vh`, boxSizing: "border-box" } : undefined}>
            {/* Include the navigation bar at the top */}
            <Navbar />
            {/* Error message heading */}
            <h1 className="errorPage">
                Page Not Found
            </h1>
        </div>
    )
}