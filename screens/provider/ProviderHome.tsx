import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  useColorScheme,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Fonts } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import MatiLogo from "@/components/ui/Logo";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";

// REDUX
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { fetchUserById } from "@/redux/slice/authSlice";
import { RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import {
  getAllRequests,
  AcceptRequest,
  removeRequest,
  clearSuccess,
} from "@/redux/slice/getAllRequests";

interface Request {
  requestId: string;
  distance: number;
  litres: number;
  location: {
    address: string;
  };
  date: string;
  createdAt: number;
  name?: string;
  id: string;
}

export interface Provider {
  name: string;
  phoneNumber: string;
  email: string;
  rating: number;
  totalReviews: number;
  avatar: string;
}

export default function ProviderHomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const dispatch = useAppDispatch();

  // REDUX AUTH STATE
  const { user, token } = useAppSelector((state: RootState) => state.auth);
  const { success, error } = useAppSelector(
    (state: RootState) => state.customerRequests
  );
  const { requests, fetching } = useSelector(
    (state: RootState) => state.customerRequests
  );

  const notifications = 0;

  useEffect(() => {
    if (user?.uid && token) {
      dispatch(fetchUserById({ uid: user.uid, token }));
    }
  }, [dispatch, user?.uid, token]);

  useEffect(() => {
    if (token) {
      dispatch(getAllRequests(token));
    }
  }, [dispatch, token]);

  // Show message if provider has reached max requests
  useEffect(() => {
    if (requests?.length === 0 && !fetching) {
      // Check if it's because they hit the limit or just no pending requests
      console.log("No pending requests available");
    }
  }, [requests, fetching]);

  // Handle successful accept
  useEffect(() => {
    if (success && token) {
      Alert.alert("Success", "Request accepted successfully!");
      dispatch(getAllRequests(token));
      dispatch(clearSuccess());
    }
  }, [success, token, dispatch]);

  // Handle error
  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  // HANDLE ACCEPT
  const handleAccept = (requestId: string) => {
    if (!token || !user) {
      Alert.alert("Error", "No auth token or user available");
      return;
    }

    const provider: Provider = {
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
      rating: user.rating,
      totalReviews: user.totalReviews,
      avatar: user.avatar,
    };

    dispatch(AcceptRequest({ token, requestId, provider }));
  };
  // ENDS

  // HANDLE DECLINE
  const handleDecline = (requestId: string) => {
    Alert.alert(
      "Decline Request",
      "Are you sure you want to decline this request?",
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Decline",
          onPress: () => {
            dispatch(removeRequest(requestId));
            Alert.alert("Request Declined", "You have declined this request.");
          },
          style: "destructive",
        },
      ]
    );
  };
  // ENDS

  const formatCreatedDate = (dateString: any) => {
    if (!dateString) return "Invalid Date";

    const date = new Date(dateString);

    const day = date.getDate();
    const getDaySuffix = (d: number) => {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const dayWithSuffix = `${day}${getDaySuffix(day)}`;
    const month = date.toLocaleString("en-ZA", { month: "short" });
    const year = date.getFullYear();
    const time = date.toLocaleTimeString("en-ZA", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${dayWithSuffix} ${month} ${year}, ${time}`;
  };

  const renderRequestCard = ({ item }: { item: Request }) => {
    return (
      <View
        style={[
          styles.requestCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.requestHeader}>
          <View>
            <ThemedText
              style={[
                styles.customerName,
                { color: colors.text, fontFamily: Fonts.sans },
              ]}
            >
              {item.name || "Customer"}
            </ThemedText>
            <ThemedText
              style={[
                styles.location,
                { color: colors.textSecondary, fontFamily: Fonts.sans },
              ]}
            >
              {item.location.address}
            </ThemedText>
          </View>
          <View
            style={[
              styles.distanceBadge,
              { backgroundColor: colors.background },
            ]}
          >
            <Ionicons name="location" size={14} color={colors.tint} />
            <Text
              style={[
                styles.distanceText,
                { color: colors.tint, fontFamily: Fonts.sans },
              ]}
            >
              {item.distance.toFixed(2)} km
            </Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Ionicons name="water" size={16} color={colors.tint} />
            <Text
              style={[
                styles.detailText,
                { color: colors.text, fontFamily: Fonts.sans },
              ]}
            >
              {item.litres} L
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="calendar" size={16} color={colors.tint} />
            <Text
              style={[
                styles.detailText,
                { color: colors.text, fontFamily: Fonts.sans },
              ]}
            >
              Needed by the {formatCreatedDate(item.date)}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="time" size={16} color={colors.textSecondary} />
            <Text
              style={[
                styles.detailText,
                { color: colors.textSecondary, fontFamily: Fonts.sans },
              ]}
            >
              Requested on the {formatCreatedDate(item.createdAt)}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => handleDecline(item.requestId)}
            style={[
              styles.declineButton,
              {
                backgroundColor: colors.warningRed + "20",
                borderColor: colors.warningRed,
              },
            ]}
          >
            <Ionicons name="close-circle" size={18} color={colors.warningRed} />
            <Text
              style={[
                styles.buttonText,
                {
                  color: colors.warningRed,
                  fontFamily: Fonts.sans,
                },
              ]}
            >
              Decline
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleAccept(item.id)}
            style={[
              styles.acceptButton,
              {
                backgroundColor: colors.tint,
              },
            ]}
          >
            {fetching ? (
              <React.Fragment>
                <ActivityIndicator size={"small"} color={colors.text} />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={colors.background}
                />
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: colors.background,
                      fontFamily: Fonts.sans,
                      fontWeight: "600",
                    },
                  ]}
                >
                  Accept
                </Text>
              </React.Fragment>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <LottieView
        source={require("@/assets/animations/empty.json")}
        autoPlay
        loop
        style={styles.lottie}
      />
      <ThemedText
        style={[
          styles.emptyMessage,
          { color: colors.textSecondary, fontFamily: Fonts.sans },
        ]}
      >
        No requests near you at the moment
      </ThemedText>
    </View>
  );

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar style="light" />

      {/* HEADER SECTION WITH TITLE AND BUTTONS */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <MatiLogo size={53} />

          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={[
                styles.iconButton,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Ionicons name="notifications" size={28} color={colors.tint} />
              {notifications > 0 && (
                <View
                  style={[
                    styles.notificationBadge,
                    { backgroundColor: colors.warningRed },
                  ]}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      color: colors.text,
                      fontSize: 12,
                    }}
                  >
                    {notifications}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Welcome Section */}
      <View style={styles.header}>
        <ThemedText style={[styles.title, { fontFamily: Fonts.sans }]}>
          Welcome
        </ThemedText>
        <ThemedText
          numberOfLines={1}
          style={[
            styles.title,
            {
              fontFamily: Fonts.sans,
              textTransform: "capitalize",
              fontSize: 48,
              fontWeight: "200",
            },
          ]}
        >
          {user?.name}
        </ThemedText>
      </View>

      <FlatList
        data={(requests as any) || []}
        renderItem={renderRequestCard}
        keyExtractor={(item, index) => item.id}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 60,
  },

  header: {
    marginBottom: 14,
  },

  title: {
    fontSize: 52,
    fontWeight: "200",
    marginBottom: 4,
    lineHeight: 50,
  },

  headerButtons: {
    flexDirection: "row",
    gap: 12,
  },

  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },

  notificationBadge: {
    position: "absolute",
    top: -18,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },

  listContent: {
    paddingBottom: 100,
  },

  requestCard: {
    borderRadius: 38,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
  },

  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },

  customerName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "left",
    textTransform: "uppercase",
  },

  location: {
    fontSize: 14,
    lineHeight: 16,
    maxWidth: Platform.OS === "ios" ? 250 : 200,
  },

  distanceBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 16,
    gap: 4,
  },

  distanceText: {
    fontSize: 12,
    fontWeight: "600",
  },

  detailsContainer: {
    gap: 8,
    marginBottom: 12,
  },

  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  detailText: {
    fontSize: 13,
    fontWeight: "500",
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },

  acceptButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },

  declineButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
  },

  buttonText: {
    fontSize: 13,
    fontWeight: "600",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },

  lottie: {
    width: 300,
    height: 300,
    marginBottom: 16,
  },

  emptyMessage: {
    fontSize: 28,
    fontWeight: "400",
    textAlign: "center",
    textTransform: "capitalize",
    lineHeight: 35,
  },
});
