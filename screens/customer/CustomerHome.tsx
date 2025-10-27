import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  useColorScheme,
  Text,
  Modal,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Fonts } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import AddressModal from "@/components/AddressModal";
import { Calendar } from "react-native-calendars";
import MatiLogo from "@/components/ui/Logo";
import { StatusBar } from "expo-status-bar";
import LoadingBanner from "@/components/ui/LoadingBanner";

// REDUX
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { fetchUserById } from "@/redux/slice/authSlice";
import { createRequest } from "@/redux/slice/requestSlice";

export default function CustomerHomeScreen() {
  // GET CURRENT COLOR SCHEME
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const dispatch = useAppDispatch();

  // 🔹 REDUX AUTH STATE
  const { user, token } = useAppSelector((state) => state.auth);
  const { selectedLocation } = useAppSelector((state) => state.location);
  const { loading, error, success } = useAppSelector((state) => state.request);

  // STATE FOR QUANTITY, LOCATION, AND DATES
  const [quantity, setQuantity] = useState(20);
  const [selectedDate, setSelectedDate] = useState("");
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const notifications = 0;
  const [timeLeft, setTimeLeft] = useState(720);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Convert seconds to minutes:seconds
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  useEffect(() => {
    if (user?.uid && token) {
      dispatch(fetchUserById({ uid: user.uid, token }));
    }
  }, [dispatch, user?.uid, token]);

  // HANDLE CONFIRM BUTTON - TRIGGERS HORIZONTAL LOADING ANIMATION
  const handleConfirm = () => {
    if (!selectedLocation || !selectedDate) {
      alert("Please select an address and delivery date");
      return;
    }

    if (!token || !user?.uid || !selectedLocation) {
      console.warn("TOKEN OR UID NOT AVAILABLE");
      return;
    }

    dispatch(
      createRequest({
        litres: quantity,
        location: {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          address: selectedLocation.address,
        },
        token,
        uid: user.uid,
        date: selectedDate
      })
    );
  };

  const handleOpenAddressModal = (view: "list") => {
    setAddressModalVisible(true);
  };

  const handleDateSelect = (day: any) => {
    setSelectedDate(day.dateString);
    setDatePickerVisible(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Select Date";

    const date = new Date(dateString);
    const month = date.toLocaleString("en-US", { month: "long" });
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month}\n${day}, ${year}`;
  };

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
            {/* NOTIFICATION BUTTON */}
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

      {/* Header */}
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
            },
          ]}
        >
          {user?.name}
        </ThemedText>
      </View>

      {/* QUICK REQUEST SECTION */}
      <View
        style={[
          styles.quickCard,
          { backgroundColor: colors.background, borderColor: colors.border },
        ]}
      >
        <ThemedText style={styles.quickTitle}>Quick Request</ThemedText>
        <ThemedText style={styles.quickSubtitle}>
          Book your water from your nearest provider
        </ThemedText>

        <View
          style={[styles.stylingDotOne, { backgroundColor: colors.tint }]}
        />
        <View
          style={[styles.stylingDotTwo, { backgroundColor: colors.tint }]}
        />
        <View
          style={[styles.stylingDotThree, { backgroundColor: colors.tint }]}
        />
        <View
          style={[styles.stylingDotFour, { backgroundColor: colors.tint }]}
        />

        {/* LOCATION AND DATE BUTTONS ROW */}
        <View style={styles.locationRow}>
          <TouchableOpacity
            style={[
              styles.locationButton,
              {
                backgroundColor: colors.card,
                width: "48%",
              },
            ]}
            onPress={() => handleOpenAddressModal("list")}
          >
            <ThemedText
              style={[
                styles.locationButtonText,
                {
                  width: "80%",
                  fontSize: 10,
                },
              ]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {selectedLocation?.address || "Select Address"}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.dateButton,
              {
                backgroundColor: colors.card,
                width: "48%",
              },
            ]}
            onPress={() => setDatePickerVisible(true)}
          >
            <ThemedText style={styles.dateButtonText}>
              {formatDate(selectedDate)}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* QUANTITY CONTROLS */}
        <View style={styles.quantityRow}>
          <TouchableOpacity
            onPress={() => quantity > 1 && setQuantity(quantity - 1)}
            style={[
              styles.quantityButton,
              {
                backgroundColor: colors.warningRed,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="remove" size={32} color={colors.background} />
          </TouchableOpacity>

          <View
            style={[
              styles.quantityDisplay,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <ThemedText style={styles.quantityText}>{quantity}</ThemedText>
          </View>

          <TouchableOpacity
            onPress={() => setQuantity(quantity + 1)}
            style={[
              styles.quantityButton,
              {
                backgroundColor: colors.tint,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="add" size={32} color={colors.background} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ERROR HANDLING */}
      <React.Fragment>
        {error && (
          <View
            style={{
              padding: 10,
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <ThemedText
              style={{
                color: colors.warningRed,
                fontSize: 12,
                textAlign: "center",
                textTransform: "uppercase",
                width: "100%",
              }}
            >
              {typeof error === "string" ? error : "Something went wrong"}
            </ThemedText>
          </View>
        )}
      </React.Fragment>

      {/* SUCCESS HANDLING */}
      <React.Fragment>
        {success === true && (
          <View
            style={{
              paddingVertical: 10,
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <ThemedText
              style={{
                color: colors.successGreen,
                fontSize: 12,
                textAlign: "center",
                textTransform: "uppercase",
                width: "100%",
              }}
            >
              SUCCESS! PLEASE WAIT FOR AVAILABLE PROVIDER.
            </ThemedText>
            <ThemedText
              style={{
                color: colors.warningRed,
                fontSize: 16,
                textAlign: "center",
                textTransform: "uppercase",
                width: "100%",
              }}
            >
              {`Waiting minutes are ${minutes}:${seconds.toString().padStart(2, "0")}`}
            </ThemedText>
          </View>
        )}
      </React.Fragment>

      {/* CONFIRM BUTTON WITH LOADING ANIMATION */}
      {loading ? (
        <React.Fragment>
          <LoadingBanner
            loading={loading}
            error={null}
            onPress={() => console.log("Button pressed")}
          />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <View
            style={[
              styles.confirmContainer,
              { backgroundColor: colors.button },
            ]}
          >
            <TouchableOpacity
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: colors.tint,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={handleConfirm}
            >
              <Ionicons
                name="chevron-forward"
                size={28}
                color={colors.background}
              />
            </TouchableOpacity>

            <ThemedText
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: colors.textSecondary,
                textTransform: "uppercase",
              }}
            >
              CONFIRM REQUEST
            </ThemedText>

            <View style={{ flexDirection: "row", gap: 0 }}>
              {[...Array(3)].map((_, i) => (
                <Ionicons
                  key={i}
                  name="chevron-forward"
                  size={16}
                  color={colors.textSecondary}
                  style={{ marginTop: 4 }}
                />
              ))}
            </View>
          </View>
        </React.Fragment>
      )}

      {/* ADDRESS MODAL */}
      <AddressModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        initialView="list"
      />

      {/* CALENDAR MODAL */}
      <Modal
        visible={datePickerVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setDatePickerVisible(false)}
      >
        <View
          style={[
            styles.calendarOverlay,
            {
              backgroundColor: colors.background,
            },
          ]}
        >
          <View style={styles.calendarHeader}>
            <TouchableOpacity
              onPress={() => setDatePickerVisible(false)}
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
            <ThemedText style={styles.calendarTitle}>
              Select Delivery Date
            </ThemedText>
          </View>

          <View
            style={[
              styles.calendarContainer,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={
                selectedDate
                  ? {
                      [selectedDate]: {
                        selected: true,
                        selectedColor: colors.tint,
                      },
                    }
                  : {}
              }
              minDate={new Date().toISOString().split("T")[0]}
              theme={{
                backgroundColor: colors.card,
                calendarBackground: colors.card,
                textSectionTitleColor: colors.text,
                selectedDayBackgroundColor: colors.tint,
                selectedDayTextColor: colors.background,
                todayTextColor: colors.tint,
                dayTextColor: colors.text,
                textDisabledColor: colors.textSecondary,
                dotColor: colors.tint,
                selectedDotColor: colors.background,
                monthTextColor: colors.text,
                indicatorColor: colors.tint,
                arrowColor: colors.tint,
              }}
            />
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 60,
    paddingBottom: 100,
    justifyContent: "space-between",
  },

  header: {
    marginBottom: 14,
  },

  title: {
    fontSize: 52,
    fontWeight: "600",
    marginBottom: 4,
    lineHeight: 60,
  },

  locationText: {
    fontSize: 14,
    fontWeight: "800",
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

  quickCard: {
    borderRadius: 0,
    paddingHorizontal: 16,
    marginBottom: 20,
  },

  quickTitle: {
    fontSize: 32,
    fontWeight: "600",
    marginBottom: 4,
    lineHeight: 50,
    textTransform: "uppercase",
    textAlign: "center",
  },

  quickSubtitle: {
    fontSize: 14.3,
    opacity: 0.6,
    marginBottom: 16,
    fontWeight: "400",
    textAlign: "center",
  },

  stylingDotOne: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 5,
    height: 25,
  },
  stylingDotTwo: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 5,
    height: 25,
  },
  stylingDotThree: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 5,
    height: 25,
  },
  stylingDotFour: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 5,
    height: 25,
  },

  locationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    // marginHorizontal: -16,
  },

  locationButton: {
    height: 60,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  locationButtonText: {
    fontWeight: "500",
    textTransform: "uppercase",
    textAlign: "center",
  },

  dateButton: {
    height: 60,
    paddingHorizontal: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  dateButtonText: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    textAlign: "center",
  },

  quantityRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    justifyContent: "center",
  },

  quantityButton: {
    width: 60,
    height: 60,
    borderRadius: 0,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },

  quantityDisplay: {
    width: 150,
    height: 60,
    borderRadius: 0,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },

  quantityText: {
    fontSize: 18,
    fontWeight: "600",
  },

  confirmContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
    borderRadius: 32,
    flexDirection: "row",
    padding: 4,
    paddingRight: 20,
  },

  confirmButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
  },

  confirmText: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.7,
    letterSpacing: 1.2,
  },

  calendarOverlay: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    justifyContent: "flex-start",
    flexDirection: "column",
  },

  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 20,
  },

  calendarTitle: {
    fontSize: 24,
    fontWeight: "700",
    flex: 1,
  },

  calendarContainer: {
    marginHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
  },
});
