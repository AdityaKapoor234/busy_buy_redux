import { useSelector } from "react-redux";
import { productSelector } from "../../redux/reducers/productReducer";
import { Link, useNavigate } from "react-router-dom";
import HomeStyle from "./home.module.css";
import { useFunctions } from "../../util/useFunctions";

export default function ProductList() {
    // Hook for programmatic navigation
    const navigate = useNavigate();

    // Extract needed state from Redux store
    const { products, login, darkMode } = useSelector(productSelector);

    // Get cart-related functions from custom hook
    const { addCart, removeCart } = useFunctions();

    return (
        <>
            {
                // Map through products array to render each product
                products?.map((elem, index) => {
                    return (
                        <div key={index} className={HomeStyle.productContainer} style={darkMode ? { backgroundColor: "#d7d7d7", boxShadow: "0 2px 8px 0 #7064e5" } : undefined}>
                            {/* Product image with click handler to navigate to product detail page */}
                            <div className={HomeStyle.productImg} style={{ backgroundImage: `url(${elem?.pic})` }} onClick={() => navigate(`/product/${elem?.id}`)}>
                            </div>
                            {/* Container for product details */}
                            <div className={HomeStyle.productDetails}>
                                {/* Link to product detail page */}
                                <Link to={`/product/${elem?.id}`} style={{ textDecoration: "none" }} >
                                    <div className={HomeStyle.productName}>
                                        {elem?.name?.substring(0, 38)}{elem?.name?.length > 38 && (<>...</>)}
                                    </div>
                                    <div className={HomeStyle.productPrice}>
                                        ₹&nbsp;{parseInt(elem?.price)?.toFixed(2).toString().replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ",")}
                                    </div>
                                </Link>
                                {/* Dynamic Add/Remove from Cart button */}
                                <div
                                    className={elem?.inCart ? HomeStyle.removeProductButton : HomeStyle.productButton}
                                    onClick={() => {
                                        login ?
                                            elem?.inCart ? removeCart(elem) : addCart(elem, 1) :
                                            navigate("/signin")
                                    }}>
                                    {elem?.inCart ? "Remove from Cart" : "Add to Cart"}
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </>
    )
}