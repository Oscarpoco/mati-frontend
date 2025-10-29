import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../slice/loginSlice";
import authReducer   from "../slice/authSlice";
import registerReducer from "../slice/registerSlice"
import locationSlice from "../slice/locationSlice"
import userDetailsReducer from "../slice/updateUserDetailsSlice"
import requestSlice from './../slice/requestSlice';
import customerRequestsSlice from './../slice/getAllRequests';


export const store = configureStore({
  reducer: {
    login: loginReducer,
    register: registerReducer,
    auth: authReducer,
    location: locationSlice,
    userDetails: userDetailsReducer,
    request: requestSlice,
    customerRequests: customerRequestsSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
