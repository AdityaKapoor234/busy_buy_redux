import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { productSelector, productActions } from "../../redux/reducers/productReducer";
import { useParams, useNavigate } from "react-router-dom";
import { useFunctions } from "../../util/useFunctions";
import ProductDetailStyle from "./product-details.module.css";
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';

export default function ProductDetails() {
    // Redux hooks for state management
    const dispatch = useDispatch()

    // Hook to navigate between routes
    const navigate = useNavigate();

    // Get product ID from URL params
    const { itemId } = useParams();

    // Extract needed state from Redux store
    const { products, userDetails, login, darkMode, navHeight } = useSelector(productSelector);

    // Local state for product details and quantity
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(1);

    // Get cart-related functions from custom hook
    const { addCart, removeCart, handleCartQuantity } = useFunctions();

    // Effect to load product data when component mounts or dependencies change
    useEffect(() => {
        dispatch(productActions.setLoading(true));

        // Find the product matching the ID from URL params
        let p = products.filter((elem) => elem.id === itemId)[0];

        // Check if product is already in cart to set initial quantity
        let q = userDetails?.cart?.find((elem) => elem?.id === p?.id);

        setQuantity(q ? q.quantity : 1);

        setProduct(p);
        dispatch(productActions.setLoading(false));
    }, [dispatch, itemId, products, userDetails]);

    return (
        <div style={darkMode ? { backgroundColor: "#3b3b3b", minHeight: `calc(100vh - ${navHeight}px)`, boxSizing: "border-box" } : undefined}>
            {/* Product detail container */}
            <div className={ProductDetailStyle.productDetailContainer}>
                {/* Product image */}
                <div className={ProductDetailStyle.img} style={{ backgroundImage: `url(${product?.pic})` }}>
                </div>
                {/* Product information section */}
                <div>
                    {/* Product name with dark mode support */}
                    <div className={ProductDetailStyle.name} style={darkMode ? { color: "white" } : undefined}>
                        {product?.name}
                    </div>
                    {/* Product price and category */}
                    <div className={ProductDetailStyle.price}>
                        Price:&nbsp;<span style={darkMode ? { color: "white" } : undefined}>₹&nbsp;{parseInt(product?.price)?.toFixed(2).toString().replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ",")}</span>&nbsp;&nbsp;|&nbsp;&nbsp;Category:&nbsp;<span style={darkMode ? { color: "white" } : undefined}>{product?.category}</span>
                    </div>

                    {/* Action buttons row */}
                    <div className={ProductDetailStyle.buttonRow}>
                        {/* Add/Remove from Cart button */}
                        <button
                            className={product?.inCart ? ProductDetailStyle.removeButton : ProductDetailStyle.button}
                            onClick={() =>
                                login ?
                                    product?.inCart ? removeCart(product) : addCart(product, quantity) :
                                    navigate("/signin")
                            }
                        >
                            {product.inCart ? "Remove from Cart" : "Add To Cart"}
                        </button>

                        {/* Quantity controls */}
                        <div className={ProductDetailStyle.cartButtonRow}>
                            {/* Increase quantity button */}
                            <AddCircleRoundedIcon
                                fontSize="large"
                                className={ProductDetailStyle.cartButton}
                                onClick={() => {
                                    if (login) {
                                        setQuantity(quantity + 1);
                                        handleCartQuantity(product, quantity + 1);
                                    } else {
                                        setQuantity(quantity + 1);
                                    }
                                }}
                            />

                            {/* Current quantity display */}
                            <div className={ProductDetailStyle.cartQuantity}>
                                {quantity}
                            </div>

                            {/* Decrease quantity button */}
                            <RemoveCircleRoundedIcon
                                fontSize="large"
                                className={ProductDetailStyle.cartButton}
                                onClick={() => {
                                    if (login) {
                                        if (quantity > 1) {
                                            setQuantity(quantity - 1);
                                            handleCartQuantity(product, quantity - 1)
                                        } else {
                                            removeCart(product)
                                        }
                                    } else {
                                        if (quantity > 1) {
                                            setQuantity(quantity - 1);
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}