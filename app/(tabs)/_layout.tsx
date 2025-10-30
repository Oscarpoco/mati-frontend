import React, { useEffect, useRef, useState } from "react";
import { Tabs } from "expo-router";
import { View, StyleSheet, Platform, AppState, AppStateStatus } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import AuthWrapper from "@/auth/authWrapper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import * as LocalAuthentication from "expo-local-authentication";

// SCREENS
import OnboardingScreen from "@/onBoarding/OnBoardingScreen";
import SplashScreen from "@/components/ui/SplashScreen";
import BiometricLockScreen from "@/components/ui/BiometricLockScreen";

// REDUX
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { restoreSession } from "../../redux/slice/authSlice";

type TabConfig = {
  name: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
};

const TABS: TabConfig[] = [
  { name: "index", title: "Home", icon: "home", iconSize: 22 },
  { name: "bookings", title: "Bookings", icon: "calendar", iconSize: 22 },
  { name: "news", title: "News", icon: "newspaper", iconSize: 22 },
  { name: "profile", title: "Profile", icon: "person", iconSize: 22 },
] as const;

const BIOMETRIC_LOCK_DURATION = 30000; 

export default function TabLayout() {
  const theme = Colors.dark;
  const dispatch = useAppDispatch();

  // 🔹 REDUX AUTH STATE
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // 🔹 LOCAL UI STATES
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showBiometricLock, setShowBiometricLock] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>("fingerprint");

  // 🧩 Prevent double initialization (React 18 Strict Mode)
  // PREVENT DOUBLE INITIALIZATION IN REACT 18 STRICT MODE
  const hasInitialized = useRef(false);
  // TRACK CURRENT APP STATE (ACTIVE, BACKGROUND, INACTIVE)
  const appState = useRef<AppStateStatus>(AppState.currentState);
  // STORE TIMESTAMP WHEN BIOMETRIC LOCK SCREEN IS ACTIVATED
  const lockScreenTimeRef = useRef<number>(0);
  // STORE REFERENCE TO LOCK SCREEN TIMEOUT - USE ReturnType FOR PROPER TYPING
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    let timer: ReturnType<typeof setTimeout>;

    const initializeApp = async () => {
      const startTime = Date.now();

      try {
        const hasSeenOnboarding = await AsyncStorage.getItem(
          "hasSeenOnboarding"
        );
        await AsyncStorage.getItem("biometricEnabled");

        // Check biometric availability
        await checkBiometricAvailability();

        await dispatch(restoreSession());

        if (!hasSeenOnboarding) {
          setShowOnboarding(true);
          setShowSplash(false);
        }
      } catch (error) {
        console.error("Error initializing app:", error);
      } finally {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 2000 - elapsed);

        timer = setTimeout(() => {
          setShowSplash(false);
        }, remaining);
      }
    };

    initializeApp();

    return () => clearTimeout(timer);
  }, [dispatch]);

  // 🔹 CHECK BIOMETRIC AVAILABILITY
  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (compatible && enrolled) {
        setIsBiometricAvailable(true);

        // Get the type of biometric available
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType("face");
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType("fingerprint");
        }
      }
    } catch (error) {
      console.error("Error checking biometric:", error);
    }
  };

  // 🔹 APP STATE LISTENER
  useEffect(() => {
    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription.remove();
      if (lockTimerRef.current) {
        clearTimeout(lockTimerRef.current);
      }
    };
  }, [isAuthenticated, isBiometricAvailable]);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      // App has come to foreground
      if (isAuthenticated && isBiometricAvailable) {
        const isBiometricEnabled = await AsyncStorage.getItem("biometricEnabled");
        if (isBiometricEnabled === "true") {
          lockScreenTimeRef.current = Date.now();
          setShowBiometricLock(true);

          // Auto-dismiss lock screen after 30 seconds of inactivity
          lockTimerRef.current = setTimeout(() => {
            const elapsedTime = Date.now() - lockScreenTimeRef.current;
            if (elapsedTime >= BIOMETRIC_LOCK_DURATION) {
              setShowBiometricLock(false);
            }
          }, BIOMETRIC_LOCK_DURATION);
        }
      }
    } else if (nextAppState.match(/inactive|background/)) {
      // App is going to background - clear any pending lock timer
      if (lockTimerRef.current) {
        clearTimeout(lockTimerRef.current);
        lockTimerRef.current = null;
      }
    }

    appState.current = nextAppState;
  };

  // 🔹 HANDLE BIOMETRIC UNLOCK
  const handleBiometricSuccess = async () => {
    if (lockTimerRef.current) {
      clearTimeout(lockTimerRef.current);
      lockTimerRef.current = null;
    }
    lockScreenTimeRef.current = 0;
    setShowBiometricLock(false);
  };

  // 🔹 HANDLE ONBOARDING COMPLETION
  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      setShowOnboarding(false);
    } catch (error) {
      console.error("Error saving onboarding status:", error);
    }
  };

  // DEBUG: FORCE BIOMETRIC LOCK SCREEN (REMOVE IN PRODUCTION)
  const debugShowBiometricLock = () => {
    lockScreenTimeRef.current = Date.now();
    setShowBiometricLock(true);
    console.log("DEBUG: BIOMETRIC LOCK SCREEN FORCED");
  };

  // useEffect(()=>{
  //   debugShowBiometricLock()
  // }, [])

  // 🔹 SPLASH SCREEN
  if (showSplash) {
    return <SplashScreen />;
  }

  // 🔹 ONBOARDING SCREEN
  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // 🔹 BIOMETRIC LOCK SCREEN
  if (showBiometricLock && isAuthenticated) {
    return (
      <BiometricLockScreen
        onSuccess={handleBiometricSuccess}
        biometricType={biometricType}
        theme={theme}
      />
    );
  }

  // 🔹 AUTH / MAIN APP
  return (
    <>
      {!isAuthenticated ? (
        <AuthWrapper />
      ) : (
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarHideOnKeyboard: true,
            tabBarActiveTintColor: theme.tint,
            tabBarInactiveTintColor: theme.textSecondary,
            tabBarBackground: () => (
              <BlurView
                intensity={10}
                tint="dark"
                style={StyleSheet.absoluteFill}
              />
            ),
            tabBarStyle: [
              styles.tabBar,
              {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
              },
            ],
          }}
        >
          {TABS.map(({ name, icon, iconSize = 26 }) => (
            <Tabs.Screen
              key={name}
              name={name}
              options={{
                tabBarShowLabel: false,
                tabBarIcon: ({ color, focused }) => (
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor: focused ? theme.bottomNav : theme.card,
                        borderColor: theme.bottomNav,
                      },
                    ]}
                  >
                    <Ionicons
                      name={icon}
                      size={iconSize}
                      color={focused ? theme.background : theme.bottomNav}
                    />
                    {name !== "profile" && (
                      <View
                        style={[
                          styles.linkButton,
                          { backgroundColor: theme.bottomNav },
                        ]}
                      />
                    )}
                  </View>
                ),
              }}
            />
          ))}
        </Tabs>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
    height: Platform.select({ ios: 72, android: 80 }),
    borderTopWidth: 0,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    borderWidth: 1,
  },
  linkButton: {
    position: "absolute",
    right: -40,
    width: 100,
    height: 30,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    zIndex: -1,
    justifyContent: "center",
    alignItems: "center",
  },
});