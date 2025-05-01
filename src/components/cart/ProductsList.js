import { useSelector } from "react-redux";
import { productSelector } from "../../redux/reducers/productReducer";
import { Link, useNavigate } from "react-router-dom";
import { useFunctions } from "../../util/useFunctions";
import HomeStyle from "../home/home.module.css";
import ProductDetailStyle from "../product-details/product-details.module.css";
import CartStyle from "./cart.module.css";
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';

export default function ProductList() {
    // Hook to navigate between routes
    const navigate = useNavigate();

    // Extract userDetails and darkMode from Redux store using productSelector
    const { userDetails, darkMode } = useSelector(productSelector);

    // Destructure cart-related functions from custom hook
    const { removeCart, handleCartQuantity } = useFunctions();


    return (
        <div className={HomeStyle.productGrid}>
            {
                userDetails?.cart.length < 1 ?
                    // Display when cart is empty
                    <h1 className="errorPage" style={darkMode ? { color: "white" } : undefined}>
                        Empty Cart
                    </h1>
                    :
                    userDetails?.cart?.map((elem, index) => {
                        return (
                            // Individual product container
                            <div key={index} className={HomeStyle.productContainer} style={darkMode ? { backgroundColor: "#d7d7d7", boxShadow: "0 2px 8px 0 #7064e5" } : undefined}>
                                <div className={HomeStyle.productImg} style={{ backgroundImage: `url(${elem?.pic})` }} onClick={() => navigate(`/product/${elem?.id}`)}>
                                </div>
                                <div className={HomeStyle.productDetails}>
                                    <Link to={`/product/${elem?.id}`} style={{ textDecoration: "none" }} >
                                        <div className={HomeStyle.productName}>
                                            {elem?.name?.substring(0, 38)}{elem?.name?.length > 38 && (<>...</>)}
                                        </div>
                                    </Link>
                                    <div className={CartStyle.buttonRow}>
                                        <div className={HomeStyle.productPrice}>
                                            ₹&nbsp;{parseInt(elem?.price)?.toFixed(2).toString().replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ",")}
                                        </div>
                                        {/* Quantity adjustment controls */}
                                        <div className={ProductDetailStyle.cartButtonRow} style={{ width: "fit-content" }}>
                                            {/* Plus button to increase quantity */}
                                            <AddCircleRoundedIcon
                                                fontSize="large"
                                                className={ProductDetailStyle.cartButton}
                                                onClick={() => {
                                                    handleCartQuantity(elem, elem?.quantity + 1);
                                                }}
                                            />
                                            {/* Display current quantity */}
                                            <div className={ProductDetailStyle.cartQuantity}>
                                                {elem?.quantity}
                                            </div>
                                            {/* Minus button to decrease quantity or remove item */}
                                            <RemoveCircleRoundedIcon
                                                fontSize="large"
                                                className={ProductDetailStyle.cartButton}
                                                onClick={() => {
                                                    if (elem?.quantity > 1) {
                                                        handleCartQuantity(elem, elem?.quantity - 1)
                                                    } else {
                                                        removeCart(elem)
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {/* Remove product button */}
                                    <div
                                        className={HomeStyle.removeProductButton}
                                        onClick={() => removeCart(elem)}
                                    >
                                        Remove from Cart
                                    </div>
                                </div>
                            </div>
                        )
                    })
            }
        </div>
    )
}