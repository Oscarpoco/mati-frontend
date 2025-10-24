import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Fonts } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { BookingDetailsModal } from "@/components/booking-details-modal";
import { TimelineTracker } from "@/components/timeline-tracker";

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
      <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'space-between' }}>

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
      </View>

      {/* Timeline Tracker */}
      <TimelineTracker
        steps={[
          { label: "Picked", icon: "checkmark-circle", status: booking.status === "completed" ? "completed" : "completed" },
          { label: "Delivery", icon: "car", status: booking.status === "active" ? "in-progress" : "completed" },
          { label: "Delivered", icon: "home", status: booking.status === "completed" ? "completed" : "pending" },
        ]}
        currentStep={booking.status === "completed" ? 2 : 1}
      />

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
        <View style={{width: "60%"}}>
          <ThemedText
            style={[styles.footerLabel, { color: colors.textSecondary }]}
          >
            From
          </ThemedText>
          <ThemedText style={[styles.footerValue, { color: colors.text }]}>
            {booking.bookedDate}
          </ThemedText>
        </View>
        <View style={{width: "40%"}}>
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
          style={[styles.actionButton, { backgroundColor: colors.bottomNav }]}
        >
          <Ionicons name="call" size={20} color={colors.background} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: colors.warningRed,
              borderWidth: 1,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons name="close" size={20} color={colors.background} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: colors.background,
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

      {/* Details Modal */}
      <BookingDetailsModal
        selectedBooking={selectedBooking}
        slideAnim={slideAnim}
        onClose={hideDetails}
      />
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
    padding: 16,
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
});