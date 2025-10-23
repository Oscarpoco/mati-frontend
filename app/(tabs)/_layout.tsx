import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { View, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import AuthWrapper from "@/auth/authWrapper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnboardingScreen from "@/onBoarding/OnBoardingScreen";
import SplashScreen from "@/components/ui/SplashScreen";

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
  const [isAuthenticated, setIsAuthenticaed] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");
     
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setShowSplash(false);

      // If user hasn't seen onboarding, show it
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error("Error checking app state:", error);
      setShowSplash(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      setShowOnboarding(false);
    } catch (error) {
      console.error("Error saving onboarding status:", error);
      setShowOnboarding(false);
    }
  };

  // Splash Screen
  if (showSplash) {
    return <SplashScreen />;
  }

  // Onboarding Screen
  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <React.Fragment>
      {isAuthenticated ? (
        <AuthWrapper />
      ) : (
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarHideOnKeyboard: true,
            tabBarActiveTintColor: theme.tint,
            tabBarInactiveTintColor: theme.textSecondary,
            tabBarStyle: [styles.tabBar, { backgroundColor: "transparent" }],
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
                        backgroundColor: focused ? theme.tint : theme.card,
                      },
                    ]}
                  >
                    <Ionicons
                      name={icon}
                      size={iconSize}
                      color={focused ? theme.background : color}
                    />
                    {name !== "profile" && (
                      <View
                        style={[
                          styles.linkButton,
                          {
                            backgroundColor: focused ? theme.tint : theme.card,
                          },
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
    marginHorizontal: 10,
  },

  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
    marginTop: 35,
  },

  linkButton: {
    position: "absolute",
    right: -25,
    width: 50,
    height: 30,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    zIndex: -1,
  },
});