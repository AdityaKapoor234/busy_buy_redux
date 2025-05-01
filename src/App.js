// Import routing and state management libraries
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from "react-router-dom";

// Import Redux components
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "./redux/store";

// Component for protected routes
import PrivateRoutes from "./PrivateRoutes";

// Import application components
import Navbar from "./components/navbar/Navbar";
import ErrorPage from "./components/error-page/ErrorPage";
import Home from "./components/home/Home";
import SignIn from "./components/signin/Signin";
import SignUp from "./components/signup/SignUp";
import ForgotPassword from "./components/forgot-password/ForgotPassword";
import Cart from "./components/cart/Cart";
import MyOrders from "./components/my-orders/MyOrders";
import ProductDetails from "./components/product-details/ProductDetails";

// Toast notification container
import { ToastContainer } from 'react-toastify';

function App() {
  // Define application routes using JSX syntax
  const routes = createRoutesFromElements(
    <Route path="/" element={<Navbar />} errorElement={<ErrorPage />}>
      <Route index element={<Home />} />
      <Route path="signin" element={<SignIn />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="forgotpassword" element={<ForgotPassword />} />
      <Route path="cart" element={<PrivateRoutes><Cart /></PrivateRoutes>} />
      <Route path="myorders" element={<PrivateRoutes><MyOrders /></PrivateRoutes>} />
      <Route path="product/:itemId" element={<ProductDetails />} />
    </Route>
  );

  // Create browser router instance
  const router = createBrowserRouter(routes);

  return (
    <>
      {/* Redux Provider to make store available to all components */}
      <Provider store={store}>
        {/* PersistGate delays rendering until persisted state is retrieved */}
        <PersistGate loading={null} persistor={persistor}>
          {/* RouterProvider makes the router available to the app */}
          <RouterProvider router={router} />

          {/* ToastContainer for displaying notifications */}
          <ToastContainer />
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
