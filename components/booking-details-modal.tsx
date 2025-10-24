import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  StatusBar,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Colors, Fonts } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";

const { height: screenHeight } = Dimensions.get("window");

interface Booking {
  id: string;
  bookingId: string;
  litres: number;
  bookedDate: string;
  bookedTime: string;
  expectedDelivery: string;
  provider: {
    name: string;
    phone: string;
    email: string;
    rating: number;
    reviews: number;
    avatar: string;
  };
  status: "active" | "completed" | "cancelled";
  location: string;
  fromLocation: string;
  toLocation: string;
  mapCoords: { lat: number; lng: number };
}

interface BookingDetailsModalProps {
  selectedBooking: Booking | null;
  slideAnim: Animated.Value;
  onClose: () => void;
}

export function BookingDetailsModal({
  selectedBooking,
  slideAnim,
  onClose,
}: BookingDetailsModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];

  if (!selectedBooking) return null;

  return (
    <Modal
      transparent
      animationType="none"
      visible={true}
      onRequestClose={onClose}
    >
      <StatusBar hidden={true} />

      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={0.7}
        onPress={onClose}
      />

      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [{ translateY: slideAnim }],
            backgroundColor: colors.background,
          },
        ]}
      >
        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
          <TouchableOpacity
            onPress={onClose}
            style={{
              width: 50,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 18,
              backgroundColor: colors.tint,
            }}
          >
            <Ionicons
              name="chevron-back"
              size={28}
              color={colors.background}
            />
          </TouchableOpacity>
          <ThemedText
            style={[
              {
                color: colors.text,
                textAlign: "center",
                fontSize: 22,
                fontWeight: "600",
              },
            ]}
          >
            Booking Details
          </ThemedText>
          <TouchableOpacity
            onPress={onClose}
            style={{
              width: 50,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 18,
              backgroundColor: colors.tint,
            }}
          >
            <Ionicons name="scan" size={28} color={colors.background} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.modalContent}
        >
          {/* Booking ID and Status */}
          <View style={styles.modalTopSection}>
            <ThemedText
              style={[
                styles.modalBookingId,
                { color: colors.tint, fontFamily: Fonts.sans },
              ]}
            >
              {selectedBooking.bookingId}
            </ThemedText>
            <View
              style={[
                styles.modalStatusBadge,
                {
                  backgroundColor:
                    selectedBooking.status === "active"
                      ? colors.tint
                      : colors.textSecondary,
                },
              ]}
            >
              <ThemedText
                style={{
                  color: colors.background,
                  fontWeight: "700",
                  fontSize: 11,
                  textTransform: "uppercase",
                }}
              >
                {selectedBooking.status}
              </ThemedText>
            </View>
          </View>

          {/* Map Placeholder */}
          <View
            style={[
              styles.mapPlaceholder,
              { backgroundColor: colors.card, opacity: 0.6 },
            ]}
          >
            <Ionicons name="map" size={60} color={colors.tint} />
            <ThemedText
              style={{
                marginTop: 12,
                color: colors.textSecondary,
                fontWeight: "500",
              }}
            >
              Live Tracking
            </ThemedText>
          </View>

          {/* Provider Card */}
          <View
            style={[
              styles.modalSection,
              { backgroundColor: colors.card, opacity: 0.6 },
            ]}
          >
            <View style={styles.providerHeader}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 18,
                  backgroundColor: colors.tint,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ThemedText
                  style={{
                    fontWeight: "800",
                    fontSize: 16,
                    color: colors.background,
                  }}
                >
                  {selectedBooking.provider.avatar}
                </ThemedText>
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <ThemedText
                  style={[
                    styles.providerName,
                    { fontFamily: Fonts.sans },
                  ]}
                >
                  {selectedBooking.provider.name}
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: 11,
                    color: colors.textSecondary,
                    marginTop: 2,
                  }}
                >
                  Customer Service
                </ThemedText>
              </View>
              <TouchableOpacity
                style={[styles.callButton, { backgroundColor: colors.tint }]}
              >
                <Ionicons
                  name="call"
                  size={20}
                  color={colors.background}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tracking Info */}
          <View style={styles.modalSection}>
            <View style={styles.infoRow}>
              <View style={{ width: "60%" }}>
                <ThemedText
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  Tracking ID
                </ThemedText>
                <ThemedText
                  style={[styles.infoValue, { color: colors.text }]}
                >
                  {selectedBooking.bookingId}
                </ThemedText>
              </View>
              <View style={{ width: "40%" }}>
                <ThemedText
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  Customer
                </ThemedText>
                <ThemedText
                  style={[styles.infoValue, { color: colors.text }]}
                >
                  Ryan Lubin
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Location Details */}
          <View style={styles.modalSection}>
            <View style={styles.infoRow}>
              <View style={{ width: "60%" }}>
                <ThemedText
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  From
                </ThemedText>
                <ThemedText
                  style={[styles.infoValue, { color: colors.text }]}
                  numberOfLines={2}
                >
                  {selectedBooking.fromLocation}
                </ThemedText>
              </View>
              <View style={{ width: "40%" }}>
                <ThemedText
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  To
                </ThemedText>
                <ThemedText
                  style={[styles.infoValue, { color: colors.text }]}
                  numberOfLines={2}
                >
                  {selectedBooking.toLocation}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Dates */}
          <View style={styles.modalSection}>
            <View style={styles.infoRow}>
              <View style={{ width: "60%" }}>
                <ThemedText
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  Date
                </ThemedText>
                <ThemedText
                  style={[styles.infoValue, { color: colors.text }]}
                >
                  {selectedBooking.bookedDate}
                </ThemedText>
              </View>
              <View style={{ width: "40%" }}>
                <ThemedText
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  Estimated
                </ThemedText>
                <ThemedText
                  style={[styles.infoValue, { color: colors.text }]}
                >
                  {selectedBooking.expectedDelivery}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Live Tracking Button */}
          <TouchableOpacity
            style={[
              styles.liveTrackingButton,
              { backgroundColor: colors.tint },
            ]}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 35,
                backgroundColor: colors.background,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="location" size={24} color={colors.tint} />
            </View>

            <ThemedText
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: colors.background,
                textTransform: "uppercase",
              }}
            >
              Live Tracking
            </ThemedText>

            <View style={{ flexDirection: "row", gap: 0 }}>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={colors.background}
                style={{ marginTop: 4 }}
              />
              <Ionicons
                name="chevron-forward"
                size={16}
                color={colors.background}
                style={{ marginTop: 4 }}
              />
              <Ionicons
                name="chevron-forward"
                size={16}
                color={colors.background}
                style={{ marginTop: 4 }}
              />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000000",
    opacity: 0.5,
  },

  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: screenHeight * 1,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    paddingTop: 70,
  },

  modalContent: {
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 0,
  },

  modalTopSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  modalBookingId: {
    fontSize: 20,
    fontWeight: "800",
  },

  modalStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
  },

  mapPlaceholder: {
    height: 220,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  modalSection: {
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 28,
  },

  providerHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  providerName: {
    fontSize: 14,
    fontWeight: "700",
  },

  callButton: {
    width: 50,
    height: 50,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  infoLabel: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 13,
    fontWeight: "700",
  },

  liveTrackingButton: {
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 32,
    flexDirection: "row",
    padding: 4,
    paddingRight: 20,
    marginBottom: 40,
  },
});