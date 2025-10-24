import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  Modal,
  StatusBar,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Fonts } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

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

const mockBookings: Booking[] = [
  {
    id: "1",
    bookingId: "E-F4RH996N",
    litres: 20,
    bookedDate: "Jun 30, 2024",
    bookedTime: "2:30 PM",
    expectedDelivery: "Jul 2, 2024",
    provider: {
      name: "Tianga Schleifer",
      phone: "+1 234 567 8900",
      email: "tianga@waterpro.com",
      rating: 4.8,
      reviews: 245,
      avatar: "TS",
    },
    status: "active",
    location: "Yogyakarta, 9876+HN",
    fromLocation: "Yogyakarta, 9876+HN",
    toLocation: "Jakarta, 6889YER",
    mapCoords: { lat: -7.797068, lng: 110.370529 },
  },
  {
    id: "2",
    bookingId: "E-F4RH997M",
    litres: 50,
    bookedDate: "Jun 28, 2024",
    bookedTime: "10:15 AM",
    expectedDelivery: "Jun 30, 2024",
    provider: {
      name: "John Aqua",
      phone: "+1 234 567 8901",
      email: "john@waterpro.com",
      rating: 4.6,
      reviews: 189,
      avatar: "JA",
    },
    status: "active",
    location: "Jakarta, 6889YER",
    fromLocation: "Jakarta, 6889YER",
    toLocation: "Bandung, 4055KL",
    mapCoords: { lat: -6.2088, lng: 106.8456 },
  },
  {
    id: "3",
    bookingId: "E-F4RH995K",
    litres: 30,
    bookedDate: "Jun 20, 2024",
    bookedTime: "5:00 PM",
    expectedDelivery: "Jun 22, 2024",
    provider: {
      name: "Sarah Water",
      phone: "+1 234 567 8902",
      email: "sarah@waterpro.com",
      rating: 4.9,
      reviews: 312,
      avatar: "SW",
    },
    status: "completed",
    location: "Bandung, 4055KL",
    fromLocation: "Bandung, 4055KL",
    toLocation: "Yogyakarta, 9876+HN",
    mapCoords: { lat: -6.9175, lng: 107.6123 },
  },
];

export default function BookingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  const showDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const hideDetails = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSelectedBooking(null);
    });
  };

  const activeBookings = mockBookings.filter((b) => b.status === "active");
  const pastBookings = mockBookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  const displayBookings =
    activeTab === "active" ? activeBookings : pastBookings;

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <TouchableOpacity
      onPress={() => showDetails(booking)}
      style={[
        styles.bookingCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      activeOpacity={0.7}
    >
      {/* Status Badge */}
      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor:
              booking.status === "active" ? colors.tint : colors.textSecondary,
          },
        ]}
      >
        <ThemedText
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: colors.background,
            textTransform: "uppercase",
          }}
        >
          {booking.status}
        </ThemedText>
      </View>

      {/* Booking ID */}
      <ThemedText
        style={[
          styles.bookingId,
          { color: colors.tint, fontFamily: Fonts.sans },
        ]}
      >
        {booking.bookingId}
      </ThemedText>

      {/* Timeline Tracker */}
      <View style={styles.timelineTracker}>
        <View style={styles.timelineStep}>
          <View
            style={[
              styles.timelineCircle,
              { backgroundColor: colors.successGreen, borderColor: colors.successGreen },
            ]}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: colors.background,
              }}
            />
          </View>
          <ThemedText
            style={[styles.timelineLabel, { color: colors.textSecondary }]}
          >
            Picked
          </ThemedText>
        </View>

        {/* Dashed Line */}
       <View
          style={{
            flex: 1,
            height: 2,
            borderStyle: "dashed",
            borderWidth: 1,
            borderColor: colors.tint + "20",
            marginTop: 6,
          }}
        />

        <View style={styles.timelineStep}>
          <View
            style={[
              styles.timelineCircle,
              { backgroundColor: colors.tint + "30", borderColor: colors.tint },
            ]}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: colors.tint + "60",
              }}
            />
          </View>
          <ThemedText
            style={[styles.timelineLabel, { color: colors.textSecondary }]}
          >
            Delivery
          </ThemedText>
        </View>

        {/* Dashed Line */}
        <View
          style={{
            flex: 1,
            height: 2,
            borderStyle: "dashed",
            borderWidth: 1,
            borderColor: colors.tint + "20",
            marginTop: 6,
          }}
        />

        <View style={styles.timelineStep}>
          <View
            style={[
              styles.timelineCircle,
              {
                backgroundColor: colors.tint + "15",
                borderColor: colors.tint + "40",
              },
            ]}
          />
          <ThemedText
            style={[styles.timelineLabel, { color: colors.textSecondary }]}
          >
            Delivered
          </ThemedText>
        </View>
      </View>

      {/* Location Info */}
      <View style={styles.locationSection}>
        <View style={styles.locationItem}>
          <Ionicons name="location" size={16} color={colors.textSecondary} />
          <ThemedText
            style={[styles.locationText, { color: colors.textSecondary }]}
          >
            {booking.fromLocation}
          </ThemedText>
        </View>
       
        <View style={styles.locationItem}>
          <Ionicons name="location" size={16} color={colors.warningRed} />
          <ThemedText
            style={[styles.locationText, { color: colors.textSecondary }]}
          >
            {booking.toLocation}
          </ThemedText>
        </View>
      </View>

      {/* Footer with Date and Provider */}
      <View style={styles.cardFooter}>
        <View>
          <ThemedText
            style={[styles.footerLabel, { color: colors.textSecondary }]}
          >
            From
          </ThemedText>
          <ThemedText style={[styles.footerValue, { color: colors.text }]}>
            {booking.bookedDate}
          </ThemedText>
        </View>
        <View style={{ marginLeft: "auto" }}>
          <ThemedText
            style={[styles.footerLabel, { color: colors.textSecondary }]}
          >
            To
          </ThemedText>
          <ThemedText style={[styles.footerValue, { color: colors.text }]}>
            {booking.expectedDelivery}
          </ThemedText>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.tint + "20" }]}
        >
          <Ionicons name="call" size={20} color={colors.tint} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: colors.warningRed + "20",
              borderWidth: 1,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons name="close" size={20} color={colors.tint} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons name="chatbox" size={20} color={colors.tint} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={[styles.title, { fontFamily: Fonts.sans }]}>
          Recently
        </ThemedText>
        <ThemedText style={[styles.title, { fontFamily: Fonts.sans }]}>
          Deliveries
        </ThemedText>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchBar,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons name="search" size={24} color={colors.textSecondary} />
          <ThemedText
            style={[
              styles.searchPlaceholder,
              { color: colors.textSecondary, marginLeft: 8 },
            ]}
          >
            Search
          </ThemedText>
        </View>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons name="funnel" size={20} color={colors.tint} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab("active")}
          style={[
            styles.tab,
            {
              backgroundColor:
                activeTab === "active" ? colors.tint : "transparent",
              borderColor: colors.border,
            },
          ]}
        >
          <ThemedText
            style={{
              color:
                activeTab === "active"
                  ? colors.background
                  : colors.textSecondary,
              fontWeight: "500",
              fontSize: 14,
            }}
          >
            Active Bookings
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("past")}
          style={[
            styles.tab,
            {
              backgroundColor:
                activeTab === "past" ? colors.tint : "transparent",
              borderColor: colors.border,
            },
          ]}
        >
          <ThemedText
            style={{
              color:
                activeTab === "past" ? colors.background : colors.textSecondary,
              fontWeight: "600",
              fontSize: 14,
            }}
          >
            Past Bookings
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {displayBookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </ScrollView>

      {/* Details Popup */}
      {selectedBooking && (
        <Modal
          transparent
          animationType="none"
          visible={true}
          onRequestClose={hideDetails} 
        >
          
          <StatusBar hidden={true} />

          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={0.7}
            onPress={hideDetails}
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
                onPress={hideDetails}
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
                onPress={hideDetails}
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
                  name="scan"
                  size={28}
                  color={colors.background}
                />
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
                      style={[styles.providerName, { fontFamily: Fonts.sans }]}
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
                    style={[
                      styles.callButton,
                      { backgroundColor: colors.tint },
                    ]}
                  >
                    <Ionicons name="call" size={20} color={colors.background} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Tracking Info */}
              <View style={styles.modalSection}>
                <View style={styles.infoRow}>
                  <View style={{ width: "60%" }}>
                    <ThemedText
                      style={[
                        styles.infoLabel,
                        { color: colors.textSecondary },
                      ]}
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
                      style={[
                        styles.infoLabel,
                        { color: colors.textSecondary },
                      ]}
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
                      style={[
                        styles.infoLabel,
                        { color: colors.textSecondary },
                      ]}
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
                      style={[
                        styles.infoLabel,
                        { color: colors.textSecondary },
                      ]}
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
                      style={[
                        styles.infoLabel,
                        { color: colors.textSecondary },
                      ]}
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
                      style={[
                        styles.infoLabel,
                        { color: colors.textSecondary },
                      ]}
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
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 70,
  },

  header: {
    marginBottom: 16,
  },

  title: {
    fontSize: 48,
    fontWeight: "600",
    marginBottom: 4,
    lineHeight: 60,
  },

  searchContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    alignItems: "center",
  },

  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    height: 60,
    borderRadius: 28,
    borderWidth: 1,
  },

  searchPlaceholder: {
    fontSize: 18,
    fontWeight: "400",
  },

  filterButton: {
    width: 60,
    height: 60,
    borderRadius: 26,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  tabsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    justifyContent: "center",
    paddingHorizontal: 5,
  },

  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    width: "50%",
    alignItems: "center",
  },

  scrollContent: {
    paddingBottom: 100,
  },

  bookingCard: {
    borderRadius: 38,
    borderWidth: 1,
    marginBottom: 12,
    padding: 26,
  },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    marginBottom: 12,
  },

  bookingId: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 12,
  },

  timelineTracker: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    justifyContent: "space-between",
  },

  timelineStep: {
    alignItems: "center",
  },

  timelineCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },

  timelineLabel: {
    fontSize: 10,
    fontWeight: "600",
  },

  locationSection: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  locationText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 6,
  },

  locationDivider: {
    textAlign: "center",
    fontSize: 12,
    marginVertical: 4,
  },

  cardFooter: {
    flexDirection: "row",
    marginBottom: 12,
  },

  footerLabel: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4,
  },

  footerValue: {
    fontSize: 12,
    fontWeight: "700",
  },

  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },

  actionButton: {
    flex: 1,
    height: 44,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

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
