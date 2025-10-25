import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { View, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import AuthWrapper from "@/auth/authWrapper";
import AsyncStorage from "@react-native-async-storage/async-storage";

// SCREENS
import OnboardingScreen from "@/onBoarding/OnBoardingScreen";
import SplashScreen from "@/components/ui/SplashScreen";

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

export default function TabLayout() {
  const theme = Colors.dark;
  const dispatch = useAppDispatch();

  // 🔹 REDUX AUTH STATE
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  // 🔹 LOCAL UI STATES
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // 🔹 RUN ON APP START
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // 1️⃣ CHECK ONBOARDING STATUS
      const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");

      // 2️⃣ RESTORE USER SESSION (FROM REDUX THUNK)
      await dispatch(restoreSession());

      // 3️⃣ SIMULATE SPLASH DELAY
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setShowSplash(false);

      // 4️⃣ SHOW ONBOARDING IF FIRST TIME
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error("Error initializing app:", error);
    } finally {
      setIsChecking(false);
    }
  };

  // 🔹 WHEN USER COMPLETES ONBOARDING
  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      setShowOnboarding(false);
    } catch (error) {
      console.error("Error saving onboarding status:", error);
    }
  };

  // 🔹 SHOW SPLASH SCREEN FIRST
  if (showSplash) {
    return <SplashScreen />;
  }

  // 🔹 SHOW ONBOARDING IF FIRST TIME
  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // 🔹 SHOW AUTH SCREENS OR MAIN APP
  return (
    <React.Fragment>
      {!isAuthenticated ? (
        <AuthWrapper />
      ) : (
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarHideOnKeyboard: true,
            tabBarActiveTintColor: theme.tint,
            tabBarInactiveTintColor: theme.textSecondary,
            tabBarStyle: [
              styles.tabBar,
              { backgroundColor: "rgba(0, 0, 0, .7)" },
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
                      >
                        {name === "index" ? (
                          <Ionicons
                            name="chevron-back"
                            color={theme.background}
                            size={18}
                            style={{ marginLeft: 40 }}
                          />
                        ) : name === "bookings" ? null : (
                          <Ionicons
                            name="chevron-forward"
                            color={theme.background}
                            size={18}
                            style={{ marginLeft: 40 }}
                          />
                        )}
                      </View>
                    )}
                  </View>
                ),
              }}
            />
          ))}
        </Tabs>
      )}
    </React.Fragment>
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
