import React from "react";

// HOME SCREENS FOR BOTH USER TYPES
import CustomerHomeScreen from "@/screens/customer/CustomerHome";
import ProviderHomeScreen from "@/screens/provider/ProviderHome";
import SellerrHome from "@/screens/seller/SellerHome";

// REDUX
import { useAppSelector } from "@/redux/store/hooks";

export default function HomeScreen() {
  const { user } = useAppSelector((state) => state.auth);

  const userType = user?.role;

  return (
    <React.Fragment>
      {userType === "customer" ? (
        <React.Fragment>
          <CustomerHomeScreen />
        </React.Fragment>
      ) : userType === "provider" ? (
        <React.Fragment>
          <ProviderHomeScreen />
        </React.Fragment>
      ) : userType === "seller" ? (
        <React.Fragment>
          <SellerrHome />
        </React.Fragment>
      ) : (
        <React.Fragment>{/* RENDER YOU ARE LOST SCREEN */}</React.Fragment>
      )}
    </React.Fragment>
  );
}
