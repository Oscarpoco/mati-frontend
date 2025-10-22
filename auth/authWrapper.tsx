import React, { useState } from "react";
import { LoginScreen } from "./Login";
import { RegisterScreen } from "./Register";
import { ResetPasswordScreen } from "./ResetPassword";

type AuthScreenType = "login" | "register" | "reset";

export default function AuthWrapper() {
  const [currentScreen, setCurrentScreen] = useState<AuthScreenType>("login");

  // NAVIGATION HANDLERS
  const handleNavigateToLogin = () => setCurrentScreen("login");
  const handleNavigateToRegister = () => setCurrentScreen("register");
  const handleNavigateToReset = () => setCurrentScreen("reset");

  return (
    <React.Fragment>
      {/* LOGIN SCREEN */}
      {currentScreen === "login" && (
        <LoginScreen
          onNavigateToRegister={handleNavigateToRegister}
          onNavigateToReset={handleNavigateToReset}
        />
      )}

      {/* REGISTER SCREEN */}
      {currentScreen === "register" && (
        <RegisterScreen onNavigateToLogin={handleNavigateToLogin} />
      )}

      {/* RESET PASSWORD SCREEN */}
      {currentScreen === "reset" && (
        <ResetPasswordScreen onNavigateToLogin={handleNavigateToLogin} />
      )}
    </React.Fragment>
  );
}