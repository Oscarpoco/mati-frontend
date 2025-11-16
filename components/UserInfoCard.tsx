import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Animated,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useRef, useEffect } from "react";

interface UserInfoCardProps {
  user: any;
  colors: any;
}

export default function UserInfoCard({ user, colors }: UserInfoCardProps) {
  const isVerified = user?.isVerified ?? true;
  const [expanded, expand] = useState(false);
  const animHeight = useRef(new Animated.Value(0)).current;
  const animOpacity = useRef(new Animated.Value(0)).current;

  const userType = user?.role;

  useEffect(() => {
    if (expanded) {
      Animated.parallel([
        Animated.timing(animHeight, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(animOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(animHeight, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(animOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [expanded, animHeight, animOpacity]);

  const chevronRotate = animHeight.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View
      style={[
        styles.infoCard,
        { backgroundColor: colors.background, borderColor: colors.border },
      ]}
    >
      <TouchableOpacity
        style={{
          backgroundColor: colors.border,
          paddingHorizontal: 16,
          paddingVertical: 6,
          flexDirection: "row",
          gap: 12,
          alignItems: "center",
          borderLeftWidth: 5,
          borderRightWidth: 5,
          borderColor: colors.button,
          marginHorizontal: -5,
        }}
        onPress={() => {
          expand(!expanded);
        }}
        activeOpacity={0.7}
      >
        <Animated.View
          style={{
            transform: [{ rotate: chevronRotate }],
          }}
        >
          <Ionicons
            name="chevron-down"
            size={28}
            color={expanded ? colors.bottomNav : colors.tint}
          />
        </Animated.View>
        <Text
          style={{
            color: colors.textSecondary,
            fontFamily: "poppinsMedium",
            fontSize: 16,
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          {expanded ? "Hide Profile Details" : "View Profile Details"}
        </Text>
      </TouchableOpacity>

      <Animated.View
        style={{
          opacity: animOpacity,
          height: animHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, userType === "provider"? 210 : 180],
          }),
          overflow: "hidden",
        }}
      >
        {/* STYLING DOTS */}
        <View
          style={[styles.stylingDotTwo, { backgroundColor: colors.tint }]}
        />
        <View
          style={[styles.stylingDotFour, { backgroundColor: colors.tint }]}
        />

        {/* NAME */}
        <View
          style={[
            styles.userInfoRow,
            { borderTopWidth: 1, borderColor: colors.border },
          ]}
        >
          <ThemedText style={styles.userInfoLabel}>Name</ThemedText>
          <ThemedText style={styles.userInfoValue}>
            {user?.name || "N/A"}
          </ThemedText>
        </View>
        <View style={styles.divider} />

        {/* PHONE */}
        <View style={styles.userInfoRow}>
          <ThemedText style={styles.userInfoLabel}>Phone</ThemedText>
          <ThemedText style={styles.userInfoValue}>
            {user?.phoneNumber || "N/A"}
          </ThemedText>
        </View>
        <View style={styles.divider} />

        {/* EMAIL */}
        <View style={styles.userInfoRow}>
          <ThemedText style={styles.userInfoLabel}>Email</ThemedText>
          <ThemedText style={styles.userInfoValue}>
            {user?.email || "N/A"}
          </ThemedText>
        </View>
        <View style={styles.divider} />

        {/* VERIFICATION */}
        {userType === "provider" && (
          <View style={styles.userInfoRow}>
            <ThemedText style={styles.userInfoLabel}>Verification</ThemedText>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Ionicons
                name={isVerified ? "checkmark-circle" : "close-circle"}
                size={18}
                color={isVerified ? "#10B981" : "#EF4444"}
              />
              <ThemedText
                style={{
                  color: isVerified ? "#10B981" : "#EF4444",
                  fontWeight: "400",
                }}
              >
                {isVerified ? "VERIFIED" : "NOT VERIFIED"}
              </ThemedText>
            </View>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    borderRadius: 0,
    padding: 26,
    paddingHorizontal: 30,
    marginHorizontal: -25,
    marginBottom: 0,
  },
  userInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  userInfoLabel: {
    fontSize: 12,
    fontFamily: "poppinsBold",
    opacity: 0.7,
    textTransform: "uppercase",
    textAlign: "left",
  },
  userInfoValue: {
    fontSize: 12,
    fontWeight: "200",
    textTransform: "uppercase",
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  stylingDotOne: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 30,
    height: 20,
  },
  stylingDotTwo: {
    position: "absolute",
    bottom: 0,
    right: -25,
    width: 30,
    height: 20,
  },
  stylingDotThree: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 30,
    height: 20,
  },
  stylingDotFour: {
    position: "absolute",
    bottom: 0,
    left: -25,
    width: 30,
    height: 20,
  },
});
