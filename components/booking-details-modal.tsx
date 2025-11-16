import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

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
  provider?: Provider | null;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  location: string;
  fromLocation: string;
  toLocation: string;
  mapCoords: { lat: number; lng: number };
  distance?: number;
  price?: number;
}

interface RawBooking {
  id: string;
  date: string;
  litres: number;
  location: any;
  provider?: {
    name: string;
    phoneNumber: string;
    email: string;
    rating: number;
    totalReviews: number;
  };
  name?: string;
  phoneNumber?: string;
  email?: string;
  rating?: number;
  totalReviews?: number;
  providerId?: string;
  price?: number;
  distance?: number;
  status: string;
}

interface BookingDetailsModalProps {
  selectedBooking: Booking | null;
  slideAnim: Animated.Value;
  onClose: () => void;
}

export function transformBooking(rawBooking: RawBooking): Booking {
  let provider: Provider | null = null;

  if (rawBooking.provider) {
    provider = {
      name: rawBooking.provider.name,
      phone: rawBooking.provider.phoneNumber,
      email: rawBooking.provider.email,
      rating: rawBooking.provider.rating || 0,
      reviews: rawBooking.provider.totalReviews || 0,
      avatar: rawBooking.provider.name?.charAt(0).toUpperCase() || "?",
    };
  } else if (rawBooking.name && rawBooking.phoneNumber && rawBooking.email) {
    provider = {
      name: rawBooking.name,
      phone: rawBooking.phoneNumber,
      email: rawBooking.email,
      rating: rawBooking.rating || 0,
      reviews: rawBooking.totalReviews || 0,
      avatar: rawBooking.name?.charAt(0).toUpperCase() || "?",
    };
  }

  return {
    id: rawBooking.id,
    bookingId: rawBooking.id,
    litres: rawBooking.litres,
    bookedDate: rawBooking.date,
    bookedTime: "N/A",
    expectedDelivery: "N/A",
    provider,
    status: (rawBooking.status as any) || "pending",
    location: rawBooking.location?.address || "",
    fromLocation: "Your Location",
    toLocation: rawBooking.location?.address || "",
    mapCoords: {
      lat: rawBooking.location?.latitude || 0,
      lng: rawBooking.location?.longitude || 0,
    },
    distance: rawBooking.distance,
    price: rawBooking.price,
  };
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
        return "#FF9500";
      case "confirmed":
        return "#3B82F6";
      case "delivered":
        return "#10B981";
      case "cancelled":
        return "#EF4444";
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
    } else if (status === "confirmed") {
      return [
        { label: "Confirmed", completed: true },
        { label: "In Transit", completed: true },
        { label: "Delivery", completed: false },
      ];
    } else if (status === "delivered") {
      return [
        { label: "Confirmed", completed: true },
        { label: "In Transit", completed: true },
        { label: "Delivered", completed: true },
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
        <View style={styles.modalHeader}>
          
          <ThemedText style={styles.headerTitle}>Order Details</ThemedText>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.headerButton, { backgroundColor: colors.card }]}
          >
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.modalContent}
        >
          {/* Status Card */}
          <View
            style={[
              styles.statusCard,
              { backgroundColor: getStatusColor(selectedBooking.status) + "15" }
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(selectedBooking.status) }
              ]}
            />
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.statusLabel}>Order Status</ThemedText>
              <ThemedText
                style={[
                  styles.statusValue,
                  { color: getStatusColor(selectedBooking.status) }
                ]}
              >
                {selectedBooking.status.charAt(0).toUpperCase() +
                  selectedBooking.status.slice(1)}
              </ThemedText>
            </View>
            <ThemedText style={styles.bookingIdLabel}>
              {selectedBooking.bookingId}
            </ThemedText>
          </View>

          {/* Modern Timeline */}
          <View style={[styles.timelineCard, { backgroundColor: colors.card }]}>
            <View style={styles.timelineTrack}>
              {getTimelineSteps(selectedBooking.status).map((step, index) => (
                <React.Fragment key={index}>
                  <View
                    style={[
                      styles.timelineCircle,
                      {
                        backgroundColor: step.completed
                          ? getStatusColor(selectedBooking.status)
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
                  {index < 2 && (
                    <View
                      style={[
                        styles.timelineLine,
                        {
                          backgroundColor: step.completed
                            ? getStatusColor(selectedBooking.status)
                            : colors.border,
                        },
                      ]}
                    />
                  )}
                </React.Fragment>
              ))}
            </View>
            <View style={styles.timelineLabelsRow}>
              {getTimelineSteps(selectedBooking.status).map(
                (step, index) =>
                  step.label && (
                    <ThemedText
                      key={index}
                      style={[
                        styles.timelineTextLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {step.label}
                    </ThemedText>
                  )
              )}
            </View>
          </View>

          {/* Live Map Placeholder */}
          <View
            style={[styles.mapSection, { backgroundColor: colors.card }]}
          >
            <View style={styles.mapGradient}>
              <Ionicons name="map" size={80} color={colors.tint} />
              <ThemedText style={styles.mapText}>
                {selectedBooking.status === "pending"
                  ? "Waiting for Provider"
                  : "Live Tracking Available"}
              </ThemedText>
            </View>
          </View>

          {/* Provider Card or Pending */}
          {selectedBooking.provider && selectedBooking.provider !== null ? (
            <View
              style={[
                styles.providerCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.button,
                },
              ]}
            >
              <View style={styles.providerContent}>
                <View
                  style={[
                    styles.providerAvatar,
                    { backgroundColor: colors.button},
                  ]}
                >
                  <ThemedText
                    style={{
                      fontSize: 18,
                      color: colors.tint,
                    }}
                  >
                    {selectedBooking.provider.avatar}
                  </ThemedText>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <ThemedText style={styles.providerName}>
                    {selectedBooking.provider.name}
                  </ThemedText>
                  <View style={styles.ratingRow}>
                    <View style={styles.ratingBadge}>
                      <Ionicons name="star" size={11} color="#FFD700" />
                      <ThemedText style={styles.ratingText}>
                        {selectedBooking.provider.rating}
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.reviewsText}>
                      {selectedBooking.provider.reviews} reviews
                    </ThemedText>
                  </View>
                </View>
                <TouchableOpacity
                  style={[
                    styles.callButtonSmall,
                    { backgroundColor: colors.button},
                  ]}
                >
                  <Ionicons name="call" size={18} color={colors.tint} />
                </TouchableOpacity>
              </View>
            </View>
          ) : selectedBooking.status === "pending" ? (
            <View
              style={[
                styles.pendingCard,
                { backgroundColor: colors.card, borderColor: colors.button },
              ]}
            >
              <View style={{ alignItems: "center", paddingVertical: 8 }}>
                <View
                  style={[
                    styles.pendingIcon,
                    { backgroundColor: colors.button },
                  ]}
                >
                  <Ionicons name="hourglass" size={20} color={colors.tint} />
                </View>
                <ThemedText style={styles.pendingText}>
                  Waiting for a provider to accept your request
                </ThemedText>
              </View>
            </View>
          ) : null}

          {/* Info Grid */}
          <View style={styles.infoGrid}>
            <View
              style={[styles.infoCard, { backgroundColor: colors.card }]}
            >
              <View
                style={[
                  styles.infoBadge,
                  { backgroundColor: colors.button },
                ]}
              >
                <Ionicons name="water" size={18} color={colors.tint} />
              </View>
              <ThemedText style={styles.infoCardLabel}>Quantity</ThemedText>
              <ThemedText style={styles.infoCardValue}>
                {selectedBooking.litres}L
              </ThemedText>
            </View>

            <View
              style={[styles.infoCard, { backgroundColor: colors.card }]}
            >
              <View
                style={[
                  styles.infoBadge,
                  { backgroundColor: colors.button },
                ]}
              >
                <Ionicons name="document-text" size={18} color={colors.tint} />
              </View>
              <ThemedText style={styles.infoCardLabel}>Tracking ID</ThemedText>
              <ThemedText style={styles.infoCardValue}>
                {selectedBooking.bookingId}
              </ThemedText>
            </View>
          </View>

          {/* Location Section */}
          <View
            style={[styles.detailSection, { backgroundColor: colors.card }]}
          >
            <View style={styles.detailHeader}>
              <Ionicons name="location" size={20} color={colors.tint} />
              <ThemedText style={styles.detailTitle}>
                Delivery Location
              </ThemedText>
            </View>
            <ThemedText style={styles.detailValue} numberOfLines={2}>
              {selectedBooking.toLocation}
            </ThemedText>
          </View>

          {/* Date Section */}
          <View
            style={[styles.detailSection, { backgroundColor: colors.card }]}
          >
            <View style={styles.detailHeader}>
              <Ionicons name="calendar" size={20} color={colors.tint} />
              <ThemedText style={styles.detailTitle}>Timeline</ThemedText>
            </View>
            <View style={styles.dateRow}>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.dateLabel}>Booked</ThemedText>
                <ThemedText style={styles.dateValue}>
                  {selectedBooking.bookedDate}
                </ThemedText>
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.dateLabel}>Est. Delivery</ThemedText>
                <ThemedText style={styles.dateValue}>
                  {selectedBooking.expectedDelivery === "N/A" 
                    ? "TBD" 
                    : selectedBooking.expectedDelivery}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Price Section */}
          {selectedBooking.price && (
            <View
              style={[styles.detailSection, { backgroundColor: colors.card }]}
            >
              <View style={styles.detailHeader}>
                <Ionicons name="pricetag" size={20} color={colors.tint} />
                <ThemedText style={styles.detailTitle}>Pricing</ThemedText>
              </View>
              <View style={styles.priceRow}>
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.dateLabel}>Distance</ThemedText>
                  <ThemedText style={styles.dateValue}>
                    {selectedBooking.distance?.toFixed(2) || "0"} km
                  </ThemedText>
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.dateLabel}>Total Price</ThemedText>
                  <ThemedText
                    style={[
                      styles.dateValue,
                      { color: colors.tint, fontWeight: "800" },
                    ]}
                  >
                    R {selectedBooking.price?.toFixed(2) || "0"}
                  </ThemedText>
                </View>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          {selectedBooking.status === "delivered" && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.tint },
              ]}
              activeOpacity={0.8}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: colors.background,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="star" size={24} color={colors.tint} />
              </View>
              <ThemedText
                style={{
                  fontSize: 16,
                  fontFamily: "poppinsBold",
                  color: colors.background,
                  textTransform: "uppercase",
                  flex: 1,
                  marginLeft: 12,
                }}
              >
                Review Provider
              </ThemedText>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.background}
              />
            </TouchableOpacity>
          )}

          {selectedBooking.status === "confirmed" && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.tint },
              ]}
              activeOpacity={0.8}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: colors.background,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="location" size={24} color={colors.tint} />
              </View>
              <ThemedText
                style={{
                  fontSize: 16,
                  fontFamily: "poppinsBold",
                  color: colors.background,
                  textTransform: "uppercase",
                  flex: 1,
                  marginLeft: 12,
                }}
              >
                Track Delivery
              </ThemedText>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.background}
              />
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
    maxHeight: screenHeight * .9,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 12,
  },

  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 24,
    fontFamily: "poppinsBold",
  },

  modalContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },

  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    marginBottom: 20,
    gap: 12,
  },

  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  statusLabel: {
    fontSize: 11,
    fontFamily: "poppinsBold",
    opacity: 0.7,
    textTransform: "uppercase",
  },

  statusValue: {
    fontSize: 14,
    fontFamily: "poppinsMedium",
    marginTop: 2,
  },

  bookingIdLabel: {
    fontSize: 14,
    fontFamily: "poppinsBold",
    opacity: 0.6,
  },

  timelineCard: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 24,
    marginBottom: 20,
  },

  timelineTrack: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "space-between",
  },

  timelineCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  timelineLine: {
    height: 3,
    flex: 1,
    marginHorizontal: 4,
  },

  timelineLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  timelineTextLabel: {
    fontSize: 12,
    fontFamily: "poppinsMedium",
    flex: 1,
    textAlign: "center",
  },

  mapSection: {
    height: 220,
    borderRadius: 28,
    marginBottom: 20,
    overflow: "hidden",
  },

  mapGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  mapText: {
    marginTop: 16,
    fontSize: 14,
    fontFamily: "poppinsBold",
    opacity: 0.7,
  },

  providerCard: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
  },

  providerContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  providerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  providerName: {
    fontSize: 16,
    fontFamily: "poppinsBold",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 8,
  },

  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },

  ratingText: {
    fontSize: 11,
    fontFamily: "poppinsLight",
    color: "#FFD700",
  },

  reviewsText: {
    fontSize: 11,
    fontFamily: "poppinsLight",
    opacity: 0.6,
  },

  callButtonSmall: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },

  pendingCard: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
  },

  pendingIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  pendingText: {
    fontSize: 12,
    fontFamily: "poppinsMedium",
    textAlign: "center",
    opacity: 0.8,
    marginTop: 4,
  },

  infoGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },

  infoCard: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
  },

  infoBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  infoCardLabel: {
    fontSize: 10,
    fontFamily: "poppinsMedium",
    opacity: 0.6,
    textTransform: "uppercase",
    marginBottom: 4,
  },

  infoCardValue: {
    fontSize: 14,
    fontFamily: "poppinsBold",
  },

  detailSection: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    marginBottom: 16,
  },

  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },

  detailTitle: {
    fontSize: 16,
    fontFamily: "poppinsBold",
  },

  detailValue: {
    fontSize: 13,
    fontFamily: "poppinsMedium",
    opacity: 0.8,
    marginLeft: 30,
  },

  dateRow: {
    flexDirection: "row",
    gap: 16,
    marginLeft: 30,
  },

  priceRow: {
    flexDirection: "row",
    gap: 16,
    marginLeft: 30,
  },

  dateLabel: {
    fontSize: 10,
    fontFamily: "poppinsMedium",
    opacity: 0.6,
    textTransform: "uppercase",
    marginBottom: 4,
  },

  dateValue: {
    fontSize: 14,
    fontFamily: "poppinsBold",
  },

  actionButton: {
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 28,
    flexDirection: "row",
    padding: 8,
    paddingRight: 20,
    paddingLeft: 8,
    marginBottom: 40,
    minHeight: 72,
  },
});