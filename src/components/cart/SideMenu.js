import { useSelector } from 'react-redux';
import { productSelector } from '../../redux/reducers/productReducer';
import { useFunctions } from '../../util/useFunctions';
import HomeStyle from "../home/home.module.css";
import CartStyle from "./cart.module.css";

export default function SideMenu() {
    // Extract userDetails from Redux store using productSelector
    const { userDetails } = useSelector(productSelector);

    // Destructure purchase function from custom useFunctions hook
    const { purchase } = useFunctions();

    return (
        <>
            <div className={HomeStyle.filterBox}>
                {/* Display section for total cart price */}
                <div className={HomeStyle.filterHeading}>
                    {/* 
                        Formatted total price display:
                        1. Check if cartTotal exists, otherwise default to 0
                        2. Convert to integer (parseInt)
                        3. Format to 2 decimal places (toFixed(2))
                        4. Add thousand separators using regex
                        5. Add currency symbol (₹) and slash
                    */}
                    Total Price: ₹&nbsp;{userDetails?.cartTotal ? parseInt(userDetails?.cartTotal)?.toFixed(2).toString().replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ",") : 0}/-
                </div>
                {/* Purchase button with click handler */}
                <div className={CartStyle.purchaseButton} onClick={() => purchase()}>
                    Purchase
                </div>
            </div>
        </>
    )
}