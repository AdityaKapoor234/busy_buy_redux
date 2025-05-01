import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { productSelector } from "./redux/reducers/productReducer";

// PrivateRoutes component definition - protects routes from unauthorized access
export default function PrivateRoutes({ children }) {
  // Get login status from Redux store
  const { login, } = useSelector(productSelector);

  // If user is not logged in, redirect to sign-in page
  if (!login) return <Navigate to="/signin" replace={true} />;

  // If user is logged in, render the protected child components
  return children;
};