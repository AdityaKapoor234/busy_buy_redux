// Import necessary hooks, Redux utilities, and Firebase services
import { useNavigate } from "react-router-dom"; // For programmatic navigation
import { useSelector, useDispatch } from "react-redux"; // Redux hooks
import { productSelector, productActions, getInitialStateAsync } from "../redux/reducers/productReducer"; // Redux selectors and actions

// Firebase imports for Firestore and Authentication
import { doc, getDoc, setDoc, updateDoc, } from "firebase/firestore"; // Firestore operations
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut as firebaseSignOut,
    sendEmailVerification
} from "firebase/auth"; // Auth operations
import { auth, db } from "../firebaseinit"; // Firebase initialization

// Toast notifications
import { toast } from "react-toastify";


// Custom hook containing all application functions
export const useFunctions = () => {
    // Hook to navigate between routes
    const navigate = useNavigate();

    // Redux hooks for dispatching actions and accessing state
    const dispatch = useDispatch();

    // Extract userDetails state from Redux store
    const { userDetails } = useSelector(productSelector);


    // Email validation regex
    const ValidateEmail = (mail) => {
        // eslint-disable-next-line no-useless-escape
        return /^[a-zA-Z]{1}\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,100})+$/.test(
            mail
        );
    };

    // Password validation regex (requires uppercase, lowercase, number, and special char)
    const ValidatePassword = (pass) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/.test(
            pass
        );
    };

    // User registration function
    async function signup(name, email, password) {
        try {
            // Input validation
            if (!name) {
                toast.error("Please enter your name");
                return;
            }
            if (!ValidateEmail(email)) {
                toast.error("Please enter valid email address");
                return;
            }
            if (!ValidatePassword(password)) {
                toast.error("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
                return;
            }

            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;


            // Prepare user data for Firestore
            const userData = {
                name: name,
                email: email,
                password: password,
                cartTotal: 0,
                cart: [],
                orders: [],

                createdAt: new Date().toISOString(),
                emailVerified: user.emailVerified,
                lastLogin: null,
            };

            // Save user data to Firestore
            await setDoc(doc(db, "customers", user.uid), userData);

            // Send email verification
            await sendEmailVerification(user);

            // Update state and navigate
            dispatch(getInitialStateAsync());
            navigate("/signin");

            toast.success("Account created successfully! Please check your email for verification.");
        } catch (error) {
            console.error("Signup error:", error);

            // Handle specific Firebase errors
            if (error.code) {
                switch (error.code) {
                    case "auth/email-already-in-use":
                        toast.error("This email is already registered");
                        break;
                    case "auth/weak-password":
                        toast.error("Password should be at least 6 characters");
                        break;
                    case "auth/invalid-email":
                        toast.error("Please enter a valid email address");
                        break;
                    case "auth/operation-not-allowed":
                        toast.error("Account creation is currently disabled");
                        break;
                    case "auth/network-request-failed":
                        toast.error("Network error. Please check your connection.");
                        break;
                    case "auth/configuration-not-found":
                        toast.error("Authentication service not configured properly. Please contact support.");
                        console.error("Firebase configuration error:", error);
                        break;
                    default:
                        toast.error("Account creation failed: " + error.message);
                }
            } else {
                toast.error("Account creation failed. Please try again.");
            }
        }
    }

    // User login function
    async function signin(email, password) {
        dispatch(productActions.setLoading(true));
        try {
            // Input validation
            if (!ValidateEmail(email?.toLowerCase())) {
                toast.error("Please enter a valid email address");
                return;
            }

            // Note: Firebase only requires 6+ characters, adjust if needed
            if (!ValidatePassword(password)) {
                toast.error("Please enter your password");
                return;
            }

            // Firebase authentication
            const userCredential = await signInWithEmailAndPassword(auth, email?.toLowerCase(), password);
            const user = userCredential.user;

            // Update user's last login time in Firestore
            await updateDoc(doc(db, "customers", user.uid), {
                lastLogin: new Date().toISOString()
            });

            // Get user data from Firestore
            const userDoc = await getDoc(doc(db, "customers", user.uid));
            if (!userDoc.exists()) {
                throw new Error("User data not found");
            }

            // Update Redux state with user data
            dispatch(productActions.login({
                userData: {
                    id: user.uid,
                    ...userDoc.data()
                },
            }));
            dispatch(getInitialStateAsync());

            navigate("/");
            toast.success(`Welcome back, ${userDoc.data().name || userDoc.data().email}!`);

        } catch (error) {
            console.error("Login error:", error);

            // Handle specific Firebase errors
            switch (error.code) {
                case "auth/user-not-found":
                case "auth/wrong-password":
                    toast.error("Invalid email or password");
                    break;
                case "auth/too-many-requests":
                    toast.error("Account temporarily locked due to too many attempts");
                    break;
                case "auth/user-disabled":
                    toast.error("This account has been disabled");
                    break;
                case "auth/invalid-email":
                    toast.error("Please enter a valid email address");
                    break;
                case "auth/network-request-failed":
                    toast.error("Network error. Please check your connection");
                    break;
                case "auth/invalid-credential":
                    toast.error("Invalid Credentials");
                    break;
                default:
                    toast.error("Login failed. Please try again");
            }
        } finally {
            dispatch(productActions.setLoading(false));
        }
    }

    // User logout function
    async function signOut() {
        dispatch(productActions.setLoading(true));

        // Firebase sign out
        await firebaseSignOut(auth);

        // Clear Redux state
        dispatch(productActions.logOut());

        // Redirect to home page
        navigate("/");

        // Show success message
        toast.success("You have been signed out successfully");

        dispatch(productActions.setLoading(false));
    }

    // Password reset function
    async function forgotPassword(email) {
        try {
            // Input validation
            if (!ValidateEmail(email)) {
                toast.error("Please enter a valid email address");
                return;
            }

            // Send password reset email
            await sendPasswordResetEmail(auth, email);

            toast.success("Password reset email sent! Please check your inbox.");
            navigate("/signin");

        } catch (error) {
            console.error("Password reset error:", error);

            // Handle specific Firebase errors
            switch (error.code) {
                case "auth/user-not-found":
                    toast.error("No account found with this email");
                    break;
                case "auth/invalid-email":
                    toast.error("Please enter a valid email address");
                    break;
                case "auth/too-many-requests":
                    toast.error("Too many attempts. Please try again later");
                    break;
                case "auth/network-request-failed":
                    toast.error("Network error. Please check your connection");
                    break;
                default:
                    toast.error("Failed to send reset email. Please try again.");
            }
        }
    }

    // Calculate total items in cart
    function totalItemsInCart() {
        let result = 0;

        // eslint-disable-next-line array-callback-return
        userDetails?.cart?.map((elem) => {
            result += elem?.quantity
        })

        return result;
    }

    // Add item to cart
    async function addCart(elem, quant) {
        try {
            // Check if item already in cart
            const index = userDetails?.cart?.findIndex((item) => item?.id === elem?.id);

            // If not in cart
            if (index === -1) {
                // Create new cart array with added item
                let newCart = [
                    ...userDetails?.cart,
                    {
                        ...elem,
                        quantity: quant,
                        inCart: true,
                    }
                ];

                // Calculate new total
                let total = handleCartTotal(newCart);

                // Prepare update object
                let obj = {
                    "cart": newCart,
                    "cartTotal": total,
                    "email": userDetails?.email,
                    "password": userDetails?.password,
                    "name": userDetails?.name,
                    "orders": userDetails?.orders,
                };

                // Update product inCart status in Redux
                dispatch(productActions.updateProduct({
                    prodId: elem?.id,
                    inCart: true,
                }));

                // Update Firestore
                const docRef = doc(db, "customers", userDetails?.id);
                await updateDoc(docRef, obj);

                toast.success("Product added to cart");
            }
        } catch (e) {
            console.log("Cart Error: ", e);
        }
    }

    // Remove item from cart
    async function removeCart(elem) {
        try {
            const index = userDetails?.cart?.findIndex((item) => item?.id === elem?.id);

            if (index !== -1) {
                // Filter out the removed item
                let newCart = [...userDetails?.cart?.filter((item) => item?.id !== elem?.id)];

                // Calculate new total
                let total = handleCartTotal(newCart);

                // Prepare update object
                let obj = {
                    "cart": newCart,
                    "cartTotal": total,
                    "email": userDetails?.email,
                    "password": userDetails?.password,
                    "name": userDetails?.name,
                    "orders": userDetails?.orders,
                };

                // Update Redux and Firestore
                dispatch(productActions.updateProduct({
                    prodId: elem?.id,
                    inCart: false,
                }));


                const docRef = doc(db, "customers", userDetails?.id);
                await updateDoc(docRef, obj);

                toast.success("Product removed from cart");
            }
        } catch (e) {
            console.log("Remove Cart Error: ", e);
        }
    }

    // Handle cart item quantity changes
    async function handleCartQuantity(elem, quant) {
        const index = userDetails?.cart?.findIndex((item) => item?.id === elem?.id);

        if (index !== -1) {
            // Map through cart to update quantity
            let newCart = userDetails?.cart?.map((item) => {
                if (item?.id === elem?.id) {
                    return {
                        ...item,
                        quantity: quant
                    };
                }
                return item;
            });

            // Calculate new total
            let total = handleCartTotal(newCart);

            // Prepare update object
            let obj = {
                "cart": newCart,
                "cartTotal": total,
                "email": userDetails?.email,
                "password": userDetails?.password,
                "name": userDetails?.name,
                "orders": userDetails?.orders,
            };

            // Update Redux
            dispatch(productActions.updateProduct({
                prodId: elem?.id,
                inCart: true,
            }));

            // Update Firestore
            const docRef = doc(db, "customers", userDetails?.id);
            await updateDoc(docRef, obj);
        }
    }

    // Calculate cart total
    function handleCartTotal(newCart) {
        let total = 0;

        newCart?.map((elem) => {
            total += (elem?.quantity * parseInt(elem?.price));
            return elem;
        })

        // Update user details in Redux
        dispatch(productActions.updateUserDetail({
            ...userDetails,
            cart: newCart,
            cartTotal: total,
        }));

        return total;
    }

    // Complete purchase/checkout
    async function purchase() {
        dispatch(productActions.setLoading(true));

        // Calculate final total
        let total = handleCartTotal(userDetails?.cart);

        // Prepare order items
        let items = userDetails?.cart?.map((elem) => {
            return {
                name: elem?.name,
                price: elem?.price,
                quantity: elem?.quantity,
                totalPrice: elem?.quantity * parseInt(elem?.price),
            }
        })

        // Create order object
        let purchaseOrder = {
            orderDate: convertDateStringToDate(new Date()),
            items,
            totalPrice: total,
        };

        // Update Redux state
        dispatch(productActions.updateUserDetail({
            ...userDetails,
            orders: [...userDetails?.orders, purchaseOrder],
            cart: [],
            cartTotal: null,
        }));

        // Prepare Firestore update
        let obj = {
            "cart": [],
            "cartTotal": null,
            "email": userDetails?.email,
            "password": userDetails?.password,
            "name": userDetails?.name,
            "orders": [...userDetails?.orders, purchaseOrder],
        };

        // Update Firestore
        const docRef = doc(db, "customers", userDetails?.id);
        await updateDoc(docRef, obj);

        // Clear cart in Redux
        dispatch(productActions.removeAllProductsFromCart());

        toast.success("Your order has been made!");

        navigate(`/myorders`);
        dispatch(productActions.setLoading(false));
    }

    // Format date to string (DD/MM/YYYY)
    const convertDateStringToDate = (dateStr) => {
        let months = [
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
        ];

        let date = new Date(dateStr);
        let str =
            (date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()) + "/" + months[date.getMonth()] + "/" + date.getFullYear();
        return str;
    };

    // Expose all functions to components
    return { signup, signin, signOut, forgotPassword, totalItemsInCart, addCart, removeCart, handleCartQuantity, purchase, convertDateStringToDate }
}
