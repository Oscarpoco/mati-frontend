// components/profile/UserInfoCard.tsx
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

interface UserInfoCardProps {
  user: any;
  colors: any;
}

export default function UserInfoCard({ user, colors }: UserInfoCardProps) {
  const isVerified = user?.isVerified ?? true;

  return (
    <View
      style={[
        styles.infoCard,
        { backgroundColor: colors.background, borderColor: colors.border },
      ]}
    >
      {/* STYLING DOTS */}
      <View style={[styles.stylingDotOne, { backgroundColor: colors.tint }]} />
      <View style={[styles.stylingDotTwo, { backgroundColor: colors.tint }]} />
      <View style={[styles.stylingDotThree, { backgroundColor: colors.tint }]} />
      <View style={[styles.stylingDotFour, { backgroundColor: colors.tint }]} />

      {/* NAME */}
      <View style={styles.userInfoRow}>
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
      <View style={styles.userInfoRow}>
        <ThemedText style={styles.userInfoLabel}>Verification</ThemedText>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    borderRadius: 0,
    padding: 26,
    paddingHorizontal: 30,
    marginHorizontal: -25,
    marginBottom: 24
  },
  userInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  userInfoLabel: {
    fontSize: 14,
    fontWeight: "200",
    opacity: 0.7,
    letterSpacing: 1,
  },
  userInfoValue: {
    fontSize: 14,
    fontWeight: "200",
    letterSpacing: 1,
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
    right: 0,
    width: 30,
    height: 20
  },
  stylingDotThree: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 30,
    height: 20
  },
  stylingDotFour: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 30,
    height: 20
  },
});