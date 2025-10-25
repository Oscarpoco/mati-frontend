import React from "react";

// HOME SCREENS FOR BOTH USER TYPES
import CustomerHomeScreen from "@/screens/customer/CustomerHome";

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
      ) : (
        <React.Fragment></React.Fragment>
      )}
    </React.Fragment>
  );
}
