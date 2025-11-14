import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { BookingDetailsModal } from "@/components/booking-details-modal";
import { TimelineTracker } from "@/components/timeline-tracker";
import { useFocusEffect } from "@react-navigation/native";

// REDUX
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { getRequests } from "@/redux/slice/requestSlice";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

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
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  location: string;
  fromLocation: string;
  toLocation: string;
  mapCoords: { lat: number; lng: number };
  distance?: number;
  price?: number;
}

interface BackendRequest {
  id: string;
  litres: number;
  createdAt: number;
  date: string;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  location: {
    address?: string;
    latitude?: number;
    longitude?: number;
    lat?: number;
    lng?: number;
  };
  distance?: number;
  price?: number;
  deliveredAt?: number;
  customerId: string;
  // Provider data at top level (inconsistent backend)
  name?: string;
  phoneNumber?: string;
  email?: string;
  rating?: number;
  totalReviews?: number;
  providerId?: string;
  // Nested provider object (inconsistent backend)
  provider?: {
    name: string;
    phoneNumber: string;
    email: string;
    rating: number;
    totalReviews: number;
  };
}

// Transform backend data to Booking format - HANDLES BOTH DATA STRUCTURES
const transformBackendRequest = (request: BackendRequest): Booking => {
  const createdDate = new Date(request.createdAt);
  const bookedDate = createdDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const bookedTime = createdDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Calculate expected delivery (add 2 days)
  const deliveryDate = new Date(createdDate);
  deliveryDate.setDate(deliveryDate.getDate() + 2);
  const expectedDelivery = deliveryDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const lat =
    request.location?.latitude ?? request.location?.lat;
  const lng =
    request.location?.longitude ?? request.location?.lng;

  // 🔹 HANDLE PROVIDER DATA - Check both nested and top-level
  let provider: Provider | null = null;

  if (request.provider) {
    // Has nested provider object
    provider = {
      name: request.provider.name,
      phone: request.provider.phoneNumber,
      email: request.provider.email,
      rating: request.provider.rating ?? 0,
      reviews: request.provider.totalReviews ?? 0,
      avatar: request.provider.name?.charAt(0).toUpperCase() || "?",
    };
  } else if (request.name && request.phoneNumber && request.email) {
    // Provider info is at top level
    provider = {
      name: request.name,
      phone: request.phoneNumber,
      email: request.email,
      rating: request.rating ?? 0,
      reviews: request.totalReviews ?? 0,
      avatar: request.name?.charAt(0).toUpperCase() || "?",
    };
  }

  return {
    id: request.id,
    bookingId: `E-${request.id.substring(0, 8).toUpperCase()}`,
    litres: request.litres,
    bookedDate,
    bookedTime,
    expectedDelivery,
    provider, 
    status: request.status,
    location: request.location?.address || "Soweto, Johannesburg",
    fromLocation: request.location?.address || "Soweto, Johannesburg",
    toLocation: request.location?.address || "Soweto, Johannesburg",
    mapCoords: { lat: lat ?? 0, lng: lng ?? 0 },
    distance: request.distance,
    price: request.price,
  };
};

export default function CustomerBookingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  const dispatch = useAppDispatch();

  // 🔹 REDUX AUTH STATE
  const { user, token } = useAppSelector((state) => state.auth);
  const { loading, customerRequests } = useAppSelector(
    (state) => state.request
  );

  // FETCH REQUESTS
  useFocusEffect(
    useCallback(() => {
      if (user?.uid && token && user?.role) {
        dispatch(getRequests({ uid: user.uid, token, role: user.role }));
      }
      
    }, [dispatch, user?.uid, user?.role, token])
  );
  // ENDS


  // Transform backend customerRequests to bookings
  useEffect(() => {
    if (customerRequests && Array.isArray(customerRequests)) {
      try {
        const transformedBookings = customerRequests.map((req) =>
          transformBackendRequest(req as any)
        );
        setBookings(transformedBookings);
      } catch (error) {
        console.error("Error transforming bookings:", error);
      }
    }
  }, [customerRequests]);

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

  // Filter bookings based on status
  const activeBookings = bookings.filter(
    (b) => b.status === "pending" || b.status === "confirmed"
  );
  const pastBookings = bookings.filter(
    (b) => b.status === "delivered" || b.status === "cancelled"
  );

  const displayBookings =
    activeTab === "active" ? activeBookings : pastBookings;

  const getTimelineSteps = (status: string) => {
    if (status === "pending") {
      return [
        {
          label: "Requested",
          icon: "checkmark-circle",
          status: "completed" as const,
        },
        {
          label: "Awaiting Provider",
          icon: "car",
          status: "in-progress" as const,
        },
        {
          label: "Delivery",
          icon: "home",
          status: "pending" as const,
        },
      ];
    } else if (status === "confirmed") {
      return [
        {
          label: "Picked",
          icon: "checkmark-circle",
          status: "completed" as const,
        },
        {
          label: "In Transit",
          icon: "car",
          status: "in-progress" as const,
        },
        {
          label: "Delivery",
          icon: "home",
          status: "pending" as const,
        },
      ];
    } else {
      return [
        {
          label: "Picked",
          icon: "checkmark-circle",
          status: "completed" as const,
        },
        {
          label: "Delivery",
          icon: "car",
          status: "completed" as const,
        },
        {
          label: "Delivered",
          icon: "home",
          status: "completed" as const,
        },
      ];
    }
  };

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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                booking.status === "pending"
                  ? colors.textSecondary
                  : booking.status === "confirmed"
                  ? colors.tint
                  : booking.status === "delivered"
                  ? "#4CAF50"
                  : "#FF6B6B",
            },
          ]}
        >
          <ThemedText
            style={{
              fontSize: 12,
              fontFamily: 'poppinsMedium',
              color: colors.background,
              textTransform: "capitalize",
            }}
          >
            {booking.status}
          </ThemedText>
        </View>

        {/* Booking ID */}
        <ThemedText
          style={[
            styles.bookingId,
            { color: colors.tint, fontFamily: 'poppinsBold' },
          ]}
        >
          {booking.bookingId}
        </ThemedText>
      </View>

      {/* Timeline Tracker */}
      <TimelineTracker
        steps={getTimelineSteps(booking.status)}
        currentStep={
          booking.status === "pending"
            ? 0
            : booking.status === "confirmed"
            ? 1
            : 2
        }
      />

      {/* Location Info */}
      <View style={styles.locationSection}>
        <View style={styles.locationItem}>
          <Ionicons name="location" size={16} color={colors.warningRed} />
          <ThemedText
            style={[styles.locationText, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {booking.toLocation}
          </ThemedText>
        </View>
      </View>

      {/* Provider Info or Pending Message */}
      {booking.provider ? (
        <View
          style={[
            styles.providerSection,
            { backgroundColor: colors.button, borderColor: colors.border },
          ]}
        >
          <View style={styles.providerAvatar}>
            <ThemedText
              style={{
                fontFamily: 'poppinsBold',
                fontSize: 18,
                color: colors.background,
              }}
            >
              {booking.provider.avatar}
            </ThemedText>
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText style={[styles.providerName, { color: colors.text, fontFamily: 'poppinsMedium', }]}>
              {booking.provider.name}
            </ThemedText>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <ThemedText
                style={[styles.ratingText, { color: colors.textSecondary, fontFamily: 'poppinsMedium', }]}
              >
                {booking.provider.rating} ({booking.provider.reviews} reviews)
              </ThemedText>
            </View>
          </View>
        </View>
      ) : booking.status === "pending" ? (
        <View
          style={[
            styles.pendingSection,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <ThemedText
            style={[styles.pendingText, { color: colors.textSecondary, fontFamily: 'poppinsMedium', }]}
          >
           Please wait while we find a nearby provider to accept your request.
          </ThemedText>
        </View>
      ) : null}

      {/* Footer with Date and Details */}
      <View style={styles.cardFooter}>
        <View style={{ width: "50%" }}>
          <ThemedText
            style={[styles.footerLabel, { color: colors.textSecondary }]}
          >
            Litres
          </ThemedText>
          <ThemedText style={[styles.footerValue, { color: colors.text, fontFamily: 'poppinsMedium', }]}>
            {booking.litres}L
          </ThemedText>
        </View>
        <View style={{ width: "50%" }}>
          <ThemedText
            style={[styles.footerLabel, { color: colors.textSecondary, fontFamily: 'poppinsMedium', }]}
          >
            Expected Delivery
          </ThemedText>
          <ThemedText style={[styles.footerValue, { color: colors.text, fontFamily: 'poppinsMedium', }]}>
            {booking.expectedDelivery}
          </ThemedText>
        </View>
      </View>

      {/* Action Buttons */}
      {booking.provider && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.bottomNav }]}
          >
            <Ionicons name="call" size={32} color={colors.textSecondary} />
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
            <Ionicons name="close" size={32} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: colors.button,
                borderWidth: 1,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="chatbox" size={32} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      {loading ? (
        <React.Fragment>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 140,
                height: 140,
                borderRadius: 28,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.card,
              }}
            >
              <ActivityIndicator size={50} color={colors.text} />
            </View>
          </View>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <View
            style={[
              styles.emptyIconContainer,
              { backgroundColor: colors.card },
            ]}
          >
            <Ionicons
              name="document-text-outline"
              size={64}
              color={colors.textSecondary}
            />
          </View>
          <ThemedText style={[styles.emptyTitle, { color: colors.text, fontFamily: 'poppinsMedium', }]}>
            {activeTab === "active" ? "No Active Bookings" : "No Past Bookings"}
          </ThemedText>
          <ThemedText
            style={[styles.emptySubtitle, { color: colors.textSecondary, fontFamily: 'poppinsMedium', }]}
          >
            {activeTab === "active"
              ? "You don't have any active water deliveries right now"
              : "Your past delivery history will appear here"}
          </ThemedText>
        </React.Fragment>
      )}
    </View>
  );

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={[styles.title, { fontFamily: 'poppinsLight', }]}>
          Recently
        </ThemedText>
        <ThemedText style={[styles.title, { fontFamily: 'poppinsLight', }]}>
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
              { color: colors.textSecondary, marginLeft: 8, fontFamily: 'poppinsMedium' },
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
              fontFamily: 'poppinsMedium',
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
              fontFamily: 'poppinsMedium',
              fontSize: 14,
            }}
          >
            Past Bookings
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      {displayBookings.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {displayBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </ScrollView>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.emptyScrollContent}
        >
          <EmptyState />
        </ScrollView>
      )}

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

  emptyScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
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
    marginBottom: 12,
  },

  locationSection: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  locationText: {
    fontSize: 12,
    marginLeft: 6,
    flex: 1,
    fontFamily: 'poppinsMedium',
  },

  providerSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 26,
    borderWidth: 1,
    marginBottom: 12,
    gap: 10,
  },

  providerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 18,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },

  providerName: {
    fontSize: 14,
    marginBottom: 2,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  ratingText: {
    fontSize: 10,
  },

  pendingSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 0,
    borderWidth: 1,
    marginBottom: 12,
    gap: 8,
  },

  pendingText: {
    fontSize: 12,
    flex: 1,
    textTransform: "uppercase",
    textAlign: "left",
  },

  cardFooter: {
    flexDirection: "row",
    marginBottom: 12,
  },

  footerLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    marginBottom: 4,
  },

  footerValue: {
    fontSize: 12,
  },

  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },

  actionButton: {
    height: 60,
    width: 60,
    borderRadius: 38,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },

  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
  },

  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});