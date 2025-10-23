import React from "react";
import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { LoginScreen } from "./Login";
import { RegisterScreen } from "./Register";
import { ResetPasswordScreen } from "./ResetPassword";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ResetPassword: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthWrapper() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        animation: "fade",
        animationDuration: 500,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}