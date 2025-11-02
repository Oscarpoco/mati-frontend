import React from "react";

// HOME SCREENS FOR BOTH USER TYPES
import WaterSalesScreen from "@/screens/customer/Marketplace";
import EarningsScreen from "@/screens/provider/Earnings";

// REDUX
import { useAppSelector } from "@/redux/store/hooks";

export default function ShopScreen() {
  const { user } = useAppSelector((state) => state.auth);

  const userType = user?.role;

  return (
    <React.Fragment>
      {userType === "customer" ? (
        <React.Fragment>
          <WaterSalesScreen />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <EarningsScreen />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
