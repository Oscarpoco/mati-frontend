import React from "react";
import { Tabs } from "expo-router";
import { View, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";

type TabConfig = {
  name: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
};

// TAB CONFIGURATION - HOME, BOOKINGS, NEWS, PROFILE
const TABS: TabConfig[] = [
  { name: "index", title: "Home", icon: "home", iconSize: 22 },
  { name: "bookings", title: "Bookings", icon: "calendar", iconSize: 22 },
  { name: "news", title: "News", icon: "newspaper", iconSize: 22 },
  { name: "profile", title: "Profile", icon: "person", iconSize: 22 },
] as const;

export default function TabLayout() {
  // USE DARK THEME DIRECTLY - NO HOOK
  const theme = Colors.dark;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: [
          styles.tabBar,
          { backgroundColor: "transparent" },
        ],
      }}
    >
      {TABS.map(({ name, icon, iconSize = 26 }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            // TAB LABEL TEXT
            tabBarShowLabel: false,
            // CIRCULAR ICON CONTAINER - ACTIVE/INACTIVE STATES
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
  );
}

const styles = StyleSheet.create({
  // TAB BAR CONTAINER WITH BLUR AND SHADOW
  tabBar: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
    height: Platform.select({ ios: 72, android: 80 }),
    borderTopWidth: 0,
    marginHorizontal: 10,
  },

  // CIRCULAR ICON BUTTON CONTAINER
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
    width: 30,
    height: 30,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    zIndex: -1,
  },
});
