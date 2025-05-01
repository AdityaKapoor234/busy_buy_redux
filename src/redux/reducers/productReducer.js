// Import Redux Toolkit
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Import Firebase/firestore utilities
import { db } from "../../firebaseinit";
import { collection, query, getDocs } from "firebase/firestore";

// Toast notification library
import { toast } from "react-toastify";

// Initial state for the product slice
const initialState = {
    actualProducts: [], // Master list of all products (never filtered)
    products: [], // Filtered list of products (what's displayed)
    login: false, // Authentication status
    loading: false, // Loading state flag
    userDetails: {}, // Current user details
    darkMode: false, // Theme preference
    navHeight: 0, // Navbar height for dark theme css
}

// Async thunk for fetching initial product data from Firestore
export const getInitialStateAsync = createAsyncThunk(
    "product/getInitialState",
    async (arg, thunkAPI) => {
        try {
            // Create query for products collection
            const q = query(collection(db, "products"));

            // Execute query and process results
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data(),
                }
            });

            // Dispatch action to update state with fetched products
            thunkAPI.dispatch(productActions.setProducts(data));
        } catch (error) {
            console.error("Error fetching initial state:", error);
            toast.error("Failed to load initial data");
            throw error;
        }
    }
);

// Create product slice with reducers and actions
export const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        // Reducer to set products list
        setProducts: (state, action) => {
            state.products = [...action.payload];
            state.actualProducts = [...action.payload];
        },
        // Reducer to toggle dark/light theme
        changeTheme: (state, action) => {
            state.darkMode = !state.darkMode;
        },
        // Reducer to set navHeight
        setNavHeight: (state, action) => {
            state.navHeight = action.payload;
        },
        // Reducer to set loading state
        setLoading: (state, action) => {
            state.loading = action?.payload;
        },


        // Reducer for user login
        login: (state, action) => {
            const { userData } = action.payload;

            // Update user details and login status
            state.userDetails = userData;
            state.login = true;

            // Update product inCart status based on user's cart
            state.products = state.products.map(product => ({
                ...product,
                inCart: userData?.cart?.some(cartItem => cartItem?.id === product?.id) || false
            }));

            state.actualProducts = state.actualProducts.map(product => ({
                ...product,
                inCart: userData?.cart?.some(cartItem => cartItem?.id === product?.id) || false
            }));
        },
        // Reducer for user logout
        logOut: (state, action) => {
            // Reset all products' inCart status
            const resetInCartStatus = state.actualProducts.map((elem) => {
                elem.inCart = false;
                return elem;
            });

            // Reset state to initial values
            state.products = resetInCartStatus;
            state.actualProducts = resetInCartStatus;
            state.login = false;
            state.userDetails = {};
        },
        // Reducer for product filtering
        setFilter: (state, action) => {
            const { searchWord, categoryList, price } = action.payload;

            // Start with all products
            state.products = state.actualProducts;

            // Apply search filter if search term exists
            if (searchWord) {
                state.products = state.actualProducts.filter((elem) => {
                    return elem?.name?.toLowerCase().includes(searchWord.toLowerCase());
                });
            }

            // Apply price filter (products <= selected price)
            state.products = state.products.filter((elem) => {
                return parseInt(elem?.price) <= parseInt(price);
            });

            // Apply category filter if categories selected
            if (categoryList.length > 0) {
                state.products = state?.products.filter((elem) => {
                    let matchingElem = categoryList?.find((item) => item?.toLowerCase() === elem?.category?.toLowerCase());
                    return matchingElem;
                });
            }
        },
        // Reducer to update user details
        updateUserDetail: (state, action) => {
            state.userDetails = action.payload;
        },
        // Reducer to update product's cart status
        updateProduct: (state, action) => {
            const { prodId, inCart } = action.payload;

            // Find product in both product lists
            const aIndex = state.actualProducts.findIndex((elem) => elem?.id === prodId);
            const pIndex = state.products.findIndex((elem) => elem?.id === prodId);

            // Update inCart status if product found
            if (aIndex !== -1) {
                state.actualProducts[aIndex].inCart = inCart;
            }
            if (pIndex !== -1) {
                state.products[pIndex].inCart = inCart;
            }
        },
        // Reducer to clear all products from cart
        removeAllProductsFromCart: (state, action) => {
            // Set inCart to false for all products
            state.products = state.products.map((product) => {
                return {
                    ...product,
                    inCart: false,
                };
            });
            state.actualProducts = state.actualProducts.map(product => {
                return {
                    ...product,
                    inCart: false,
                };
            });
        },
    },
    // Handle async thunk lifecycle actions
    extraReducers: (builder) => {
        builder
            // Set loading state when async call starts
            .addCase(getInitialStateAsync.pending, (state, action) => {
                state.loading = true;
            })
            // Clear loading state when async call succeeds
            .addCase(getInitialStateAsync.fulfilled, (state, action) => {
                state.loading = false;
            })
            // Clear loading state when async call fails
            .addCase(getInitialStateAsync.rejected, (state) => {
                state.loading = false;
            });
    }

});

// Export reducer and actions
export const productReducer = productSlice?.reducer;
export const productActions = productSlice?.actions;

// Export selector function to access product state
export const productSelector = (state) => state?.productReducer;