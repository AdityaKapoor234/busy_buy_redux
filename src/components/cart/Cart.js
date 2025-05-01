import { useSelector } from "react-redux";
import { productSelector } from "../../redux/reducers/productReducer";
import ProductList from "./ProductsList";
import SideMenu from "./SideMenu";
import CircularProgress from "@mui/material/CircularProgress";

export default function Cart() {
    // Extract loading status darkMode, navHeight theme preference from Redux store
    const { loading, darkMode, navHeight } = useSelector(productSelector);

    return (
        <div style={darkMode ? { backgroundColor: "#3b3b3b", minHeight: `calc(100vh - ${navHeight}px)`, boxSizing: "border-box" } : undefined}>
            {
                // Conditional rendering based on loading state
                loading ?
                    // Show loading spinner when data is being fetched
                    <div className="loadingBox">
                        <CircularProgress style={{ color: "#F54A00" }} className="loadingBoxContent" />
                    </div>
                    :
                    // Main content when not loading
                    <div style={{ display: "flex", padding: "2.5rem 16px" }}>
                        {/* Sidebar component */}
                        <SideMenu />
                        {/* Main product list component */}
                        <ProductList />
                    </div>
            }
        </div>
    )
}