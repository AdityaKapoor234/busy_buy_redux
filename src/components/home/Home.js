import { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { productSelector, productActions } from "../../redux/reducers/productReducer";
import ProductList from "./ProductsList"
import HomeStyle from "./home.module.css";
import CircularProgress from "@mui/material/CircularProgress";

export default function Home() {
    // Redux hooks for dispatching actions and accessing state
    const dispatch = useDispatch();

    // Extract loading, darkMode, navHeight theme preference from Redux store
    const { loading, darkMode, navHeight } = useSelector(productSelector);

    // Local state for filter controls
    const [price, setPrice] = useState(10000);
    const [category, setCategory] = useState([]);
    const [searchWord, setSearchWord] = useState("");

    // Handler for price range changes
    const handlePrice = (e) => {
        // Update local state
        setPrice(e.target.value);
        // Update Redux filter state
        dispatch(productActions.setFilter({
            searchWord,
            categoryList: category,
            price: e.target.value
        }));
    };

    // Handler for category checkbox changes
    const handleCategory = (e) => {
        let newArray = category;
        if (category.includes(e.target.value)) {
            newArray = category.filter((elem) => elem !== e.target.value);
        } else {
            newArray = [...category, e.target.value];
        }
        // Update Redux filter state
        dispatch(productActions.setFilter({
            searchWord,
            categoryList: newArray,
            price
        }));

        setCategory([...newArray]);
    }

    // Handler for search input changes
    const handleSearch = (e) => {
        // Update Redux filter state
        dispatch(productActions.setFilter({
            searchWord: e.target.value,
            categoryList: category,
            price
        }));
        // Update local state
        setSearchWord(e.target.value);
    }

    return (
        <div style={darkMode ? { backgroundColor: "#3b3b3b", minHeight: `calc(100vh - ${navHeight}px)`, boxSizing: "border-box" } : undefined}>
            {
                // Conditional rendering based on loading state
                loading ?
                    // Loading spinner display
                    <div className="loadingBox" style={darkMode ? { backgroundColor: "#3b3b3b" } : undefined}>
                        <CircularProgress style={{ color: "#F54A00" }} className="loadingBoxContent" />
                    </div>
                    :
                    // Main content when not loading
                    <div style={darkMode ? { backgroundColor: "#3b3b3b" } : undefined}>
                        {/* Search bar section */}
                        <header>
                            <div className={HomeStyle.searchBar}>
                                <input type="text" placeholder="Search by Name" value={searchWord} onChange={handleSearch} />
                            </div>
                        </header>
                        {/* Main content area with filters and product grid */}
                        <div style={{ display: "flex", margin: "auto 16px" }}>
                            {/* Filters sidebar */}
                            <aside>
                                <div className={HomeStyle.filterBox}>
                                    <div className={HomeStyle.filterHeading}>
                                        Filters
                                    </div>
                                    {/* Price range filter */}
                                    <div>
                                        <div>
                                            Price: ₹&nbsp;{parseInt(price)?.toFixed(2).toString().replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ",")}
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="10000"
                                            value={price}
                                            onChange={handlePrice}
                                            className={HomeStyle.filterRangeBar}
                                        />
                                    </div>
                                    {/* Category filter checkboxes */}
                                    <div>
                                        <div className={HomeStyle.filterHeading}>
                                            Category
                                        </div>
                                        <div className={HomeStyle.filterCheckBoxDiv}>
                                            <div>
                                                <input type="checkbox" value="men" onChange={handleCategory} /> Men's Clothing
                                            </div>
                                            <div>
                                                <input type="checkbox" value="women" onChange={handleCategory} /> Women's Clothing
                                            </div>
                                            <div>
                                                <input type="checkbox" value="jewelery" onChange={handleCategory} /> Jewelery
                                            </div>
                                            <div>
                                                <input type="checkbox" value="electronics" onChange={handleCategory} /> Electronics
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                            {/* Main product grid area */}
                            <main className={HomeStyle.productGrid}>
                                <ProductList />
                            </main>
                        </div>
                    </div>
            }
        </div>
    )
}