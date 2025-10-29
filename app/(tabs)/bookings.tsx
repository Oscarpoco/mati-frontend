import React from "react";

// HOME SCREENS FOR BOTH USER TYPES
import ProviderBookingsScreen from "@/screens/provider/ProviderBookings";
import CustomerBookingsScreen from "@/screens/customer/CustomerBookings";

// REDUX
import { useAppSelector } from "@/redux/store/hooks";

export default function   BookingsScreen() {
  const { user } = useAppSelector((state) => state.auth);

  const userType = user?.role;

  return (
    <React.Fragment>
      {userType === "customer" ? (
        <React.Fragment>
          <CustomerBookingsScreen />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <ProviderBookingsScreen />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
