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

interface Provider {
  name: string;
  phone: string;
  email: string;
  rating: number;
  reviews: number;
  avatar: string;
}

interface Booking {
  id: string;
  bookingId: string;
  litres: number;
  bookedDate: string;
  bookedTime: string;
  expectedDelivery: string;
  provider: Provider | null;
  status: "pending" | "delivery" | "delivered" | "cancelled";
  location: string;
  fromLocation: string;
  toLocation: string;
  mapCoords: { lat: number; lng: number };
  distance?: number;
  price?: number;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return colors.textSecondary;
      case "delivery":
        return colors.tint;
      case "delivered":
        return "#4CAF50";
      case "cancelled":
        return "#FF6B6B";
      default:
        return colors.textSecondary;
    }
  };

  const getTimelineSteps = (status: string) => {
    if (status === "pending") {
      return [
        { label: "Requested", completed: true },
        { label: "Awaiting Provider", completed: false },
        { label: "Delivery", completed: false },
      ];
    } else if (status === "delivery") {
      return [
        { label: "Picked", completed: true },
        { label: "In Transit", completed: true },
        { label: "Delivery", completed: false },
      ];
    } else if (status === "delivered") {
      return [
        { label: "Picked", completed: true },
        { label: "Delivered", completed: true },
        { label: "Completed", completed: true },
      ];
    } else {
      return [
        { label: "Cancelled", completed: false },
        { label: "", completed: false },
        { label: "", completed: false },
      ];
    }
  };

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
        <View
          style={[styles.modalHeader, { borderBottomColor: colors.border }]}
        >
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
            <Ionicons name="chevron-back" size={28} color={colors.background} />
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
                  backgroundColor: getStatusColor(selectedBooking.status),
                },
              ]}
            >
              <ThemedText
                style={{
                  color: colors.background,
                  fontWeight: "700",
                  fontSize: 11,
                  textTransform: "capitalize",
                }}
              >
                {selectedBooking.status}
              </ThemedText>
            </View>
          </View>

          {/* Timeline Progress */}
          <View
            style={[styles.timelineSection, { backgroundColor: colors.card }]}
          >
            <View style={styles.timelineContainer}>
              {getTimelineSteps(selectedBooking.status).map((step, index) => (
                <View key={index} style={styles.timelineItem}>
                  <View
                    style={[
                      styles.timelineCircle,
                      {
                        backgroundColor: step.completed
                          ? colors.tint
                          : colors.border,
                        borderColor: step.completed
                          ? colors.tint
                          : colors.border,
                      },
                    ]}
                  >
                    {step.completed && (
                      <Ionicons
                        name="checkmark"
                        size={12}
                        color={colors.background}
                      />
                    )}
                  </View>
                 
                </View>
              ))}
            </View>
            <View style={styles.timelineLabels}>
              {getTimelineSteps(selectedBooking.status).map(
                (step, index) =>
                  step.label && (
                    <ThemedText
                      key={index}
                      style={[
                        styles.timelineLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {step.label}
                    </ThemedText>
                  )
              )}
            </View>
          </View>

          {/* Map Placeholder */}
          <View
            style={[styles.mapPlaceholder, { backgroundColor: colors.card }]}
          >
            <Ionicons name="map" size={60} color={colors.tint} />
            <ThemedText
              style={{
                marginTop: 12,
                color: colors.textSecondary,
                fontWeight: "500",
              }}
            >
              {selectedBooking.status === "pending"
                ? "Waiting for Provider"
                : "Live Tracking"}
            </ThemedText>
          </View>

          {/* Provider Card or Pending Message */}
          {selectedBooking.provider ? (
            <View
              style={[
                styles.modalSection,
                { backgroundColor: colors.card, borderColor: colors.tint },
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
                    style={[styles.providerName, { fontFamily: Fonts.sans }]}
                  >
                    {selectedBooking.provider.name}
                  </ThemedText>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={11} color="#FFD700" />
                    <ThemedText
                      style={{
                        fontSize: 10,
                        color: colors.textSecondary,
                        marginLeft: 4,
                      }}
                    >
                      {selectedBooking.provider.rating} (
                      {selectedBooking.provider.reviews} reviews)
                    </ThemedText>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.callButton, { backgroundColor: colors.tint }]}
                >
                  <Ionicons name="call" size={20} color={colors.background} />
                </TouchableOpacity>
              </View>
            </View>
          ) : selectedBooking.status === "pending" ? (
            <View
              style={[
                styles.modalSection,
                { backgroundColor: colors.card, borderColor: colors.button },
              ]}
            >
              <View style={styles.pendingMessageContainer}>
                <Ionicons name="time" size={24} color={colors.tint} />
                <ThemedText
                  style={[
                    styles.pendingMessage,
                    { color: colors.textSecondary },
                  ]}
                >
                  Waiting for a provider to accept your water delivery request
                </ThemedText>
              </View>
            </View>
          ) : null}

          {/* Tracking Info */}
          <View
            style={[
              styles.modalSection,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.infoRow}>
              <View style={{ width: "60%" }}>
                <ThemedText
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  Tracking ID
                </ThemedText>
                <ThemedText style={[styles.infoValue, { color: colors.text }]}>
                  {selectedBooking.bookingId}
                </ThemedText>
              </View>
              <View style={{ width: "40%" }}>
                <ThemedText
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  Litres
                </ThemedText>
                <ThemedText style={[styles.infoValue, { color: colors.text }]}>
                  {selectedBooking.litres}L
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Location Details */}
          <View
            style={[
              styles.modalSection,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.infoRow}>
              <View style={{ width: "100%" }}>
                <ThemedText
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  Delivery Location
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
          <View
            style={[
              styles.modalSection,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.infoRow}>
              <View style={{ width: "60%" }}>
                <ThemedText
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  Booked Date
                </ThemedText>
                <ThemedText style={[styles.infoValue, { color: colors.text }]}>
                  {selectedBooking.bookedDate}
                </ThemedText>
              </View>
              <View style={{ width: "40%" }}>
                <ThemedText
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  Estimated Delivery
                </ThemedText>
                <ThemedText style={[styles.infoValue, { color: colors.text }]}>
                  {selectedBooking.expectedDelivery}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Price Info */}
          {selectedBooking.price && (
            <View
              style={[styles.modalSection, { backgroundColor: colors.card }]}
            >
              <View style={styles.infoRow}>
                <View style={{ width: "60%" }}>
                  <ThemedText
                    style={[styles.infoLabel, { color: colors.textSecondary }]}
                  >
                    Distance
                  </ThemedText>
                  <ThemedText
                    style={[styles.infoValue, { color: colors.text }]}
                  >
                    {selectedBooking.distance?.toFixed(2) || "0"} km
                  </ThemedText>
                </View>
                <View style={{ width: "40%" }}>
                  <ThemedText
                    style={[styles.infoLabel, { color: colors.textSecondary }]}
                  >
                    Price
                  </ThemedText>
                  <ThemedText
                    style={[styles.infoValue, { color: colors.text }]}
                  >
                    R {selectedBooking.price?.toFixed(2) || "0"}
                  </ThemedText>
                </View>
              </View>
            </View>
          )}

          {selectedBooking.provider && (
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
          )}
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
    borderRadius: 16,
  },

  timelineSection: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 28,
    marginBottom: 16,
  },

  timelineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    justifyContent: "space-between",
  },

  timelineItem: {
    alignItems: "center",
    flex: 1,
  },

  timelineCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  timelineLine: {
    position: "absolute",
    height: 2,
    width: "33.33%",
    top: 11,
    left: "33.33%",
  },

  timelineLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  timelineLabel: {
    fontSize: 10,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },

  mapPlaceholder: {
    height: 200,
    borderRadius: 38,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  modalSection: {
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
  },

  providerHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  providerName: {
    fontSize: 14,
    fontWeight: "700",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  callButton: {
    width: 50,
    height: 50,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  pendingMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 12,
  },

  pendingMessage: {
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
    textTransform: "uppercase",
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
