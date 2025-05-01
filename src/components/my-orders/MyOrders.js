import { useSelector } from "react-redux";
import { productSelector } from "../../redux/reducers/productReducer";
import OrderStyle from "./my-orders.module.css"
import CircularProgress from "@mui/material/CircularProgress";

export default function MyOrders() {
    // Extract needed state from Redux store
    const { loading, userDetails, darkMode, navHeight } = useSelector(productSelector);

    return (
        <div style={darkMode ? { backgroundColor: "#3b3b3b", margin: 0, padding: 0, minHeight: `calc(100vh - ${navHeight}px)`, boxSizing: "border-box" } : undefined}>
            {
                // Conditional rendering based on loading state
                loading ?
                    // Loading spinner display
                    <div className="loadingBox">
                        <CircularProgress style={{ color: "#F54A00" }} className="loadingBoxContent" />
                    </div>
                    :
                    // Main content when not loading
                    <div style={{ padding: "2.5rem 0" }}>
                        {/* Page heading with dynamic text (singular/plural) */}
                        <h1 className={OrderStyle?.heading} style={darkMode ? { color: "#ffffff", margin: 0, marginBottom: "0.67em" } : undefined}>
                            {
                                userDetails?.orders?.length === 1 ?
                                    "Your Order:"
                                    :
                                    "Your Orders:"
                            }
                        </h1>
                        {
                            // Conditional rendering based on orders existence
                            userDetails?.orders?.length < 1 ?
                                // Empty state message
                                <div className={OrderStyle?.orderBoxHead} style={darkMode ? { color: "#ffffff" } : undefined}>
                                    No Order Found
                                </div>
                                :
                                // Map through orders array to render each order
                                userDetails?.orders?.map((elem) => {
                                    return (
                                        <div>
                                            {/* Order container box */}
                                            <div className={OrderStyle?.orderBox}>
                                                {/* Order date header */}
                                                <div className={OrderStyle?.orderBoxHead} style={darkMode ? { color: "#ffffff" } : undefined}>
                                                    Ordered On: {elem?.orderDate}
                                                </div>
                                                {/* Order items table */}
                                                <table>
                                                    <tr>
                                                        <th className={OrderStyle?.orderBoxHeadRow} style={darkMode ? { backgroundColor: "#d7d7d7" } : undefined}>
                                                            Title
                                                        </th>
                                                        <th className={OrderStyle?.orderBoxHeadRow} style={darkMode ? { backgroundColor: "#d7d7d7" } : undefined}>
                                                            Price
                                                        </th>
                                                        <th className={OrderStyle?.orderBoxHeadRow} style={darkMode ? { backgroundColor: "#d7d7d7" } : undefined}>
                                                            Quantity
                                                        </th>
                                                        <th className={OrderStyle?.orderBoxHeadRow} style={darkMode ? { backgroundColor: "#d7d7d7" } : undefined}>
                                                            Total Price
                                                        </th>
                                                    </tr>
                                                    {/* Map through items in each order */}
                                                    {
                                                        elem?.items?.map((item, i) => {
                                                            return (
                                                                <tr>
                                                                    <td className={OrderStyle?.orderBoxHeadCol} style={darkMode ? { backgroundColor: "#d7d7d7" } : undefined}>
                                                                        {item?.name}
                                                                    </td>
                                                                    <td className={OrderStyle?.orderBoxHeadCol} style={darkMode ? { backgroundColor: "#d7d7d7" } : undefined}>
                                                                        ₹&nbsp;{parseInt(item?.price)?.toFixed(2).toString().replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ",")}
                                                                    </td>
                                                                    <td className={OrderStyle?.orderBoxHeadCol} style={darkMode ? { backgroundColor: "#d7d7d7" } : undefined}>
                                                                        {item?.quantity}
                                                                    </td>
                                                                    <td className={OrderStyle?.orderBoxHeadCol} style={darkMode ? { backgroundColor: "#d7d7d7" } : undefined}>
                                                                        ₹&nbsp;{parseInt(item?.totalPrice)?.toFixed(2).toString().replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ",")}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                    {/* Order total row */}
                                                    <tr>
                                                        <td className={OrderStyle?.orderBoxHeadCol} colSpan={3} style={darkMode ? { backgroundColor: "#d7d7d7" } : undefined}>

                                                        </td>
                                                        {/* Formatted order total price */}
                                                        <td className={OrderStyle?.orderBoxHeadCol} style={darkMode ? { backgroundColor: "#d7d7d7" } : undefined}>
                                                            ₹&nbsp;{parseInt(elem?.totalPrice)?.toFixed(2).toString().replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ",")}
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                    )
                                })
                        }
                    </div>
            }

        </div>
    )
}