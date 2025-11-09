import React, { useEffect, useRef } from "react";
import { View, TouchableOpacity, Animated } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";

export default function SellerHome() {
  const colors = {
    background: "#000", // black background
    tint: "#7FFFD4", // aquamarine color
    text: "#FFFFFF", // white text
    textSecondary: "#B0B0B0", // subtle grey secondary text
  };

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <ThemedView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
        backgroundColor: colors.background,
      }}
    >
      {/* Animated Icon */}
      <Animated.View
        style={{
          transform: [{ scale: pulseAnim }],
          marginBottom: 30,
        }}
      >
        <Ionicons name="time-outline" size={80} color={colors.tint} />
      </Animated.View>

      {/* Title */}
      <ThemedText
        style={{
          fontSize: 28,
          fontFamily: "poppinsSemiBold",
          color: colors.tint,
          textAlign: "center",
          marginBottom: 10,
          letterSpacing: 1,
          lineHeight: 40,
        }}
      >
        Coming Soon
      </ThemedText>

      {/* Subtitle */}
      <ThemedText
        style={{
          fontSize: 16,
          fontFamily: "poppinsLight",
          color: colors.textSecondary,
          textAlign: "center",
          marginBottom: 40,
          lineHeight: 22,
        }}
      >
        We're building something exciting for our sellers.{"\n"}
        Stay tuned for updates!
      </ThemedText>

      {/* Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          backgroundColor: colors.tint,
          paddingVertical: 12,
          paddingHorizontal: 30,
          borderRadius: 30,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          shadowColor: colors.tint,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.4,
          shadowRadius: 6,
        }}
      >
        <Ionicons name="notifications-outline" size={20} color="black" />
        <ThemedText
          style={{
            color: "#000",
            fontFamily: "poppinsMedium",
            fontSize: 16,
          }}
        >
          Notify Me
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
