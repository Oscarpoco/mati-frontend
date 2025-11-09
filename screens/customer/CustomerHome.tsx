import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  useColorScheme,
  Text,
  Modal,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";

// COMPONENTS
import AddressModal from "@/components/AddressModal";
import { Calendar } from "react-native-calendars";
import MatiLogo from "@/components/ui/Logo";
import LoadingBanner from "@/components/ui/LoadingBanner";
import { NotificationModal } from "@/components/NotificationModal";
import { WaitingModal } from "@/components/ui/WaitingPopup";
// ENDS

// REDUX
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { fetchUserById } from "@/redux/slice/authSlice";
import { createRequest } from "@/redux/slice/requestSlice";
// ENDS

export default function CustomerHomeScreen() {
  // GET CURRENT COLOR SCHEME
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  // ENDS

  // 🔹 REDUX AUTH STATE
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const { selectedLocation } = useAppSelector((state) => state.location);
  const { loading, error, success } = useAppSelector((state) => state.request);
  // ENDS

  // STATE FOR QUANTITY, LOCATION, AND DATES
  const [quantity, setQuantity] = useState(20);
  const [selectedDate, setSelectedDate] = useState("");
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const notifications = 0;
  const [isWaiting, setIsWaiting] = useState(true);
  // ENDS

  // FETCH USER DETAILS ON MOUNT
  useEffect(() => {
    if (user?.uid && token) {
      dispatch(fetchUserById({ uid: user.uid, token }));
    }
  }, [dispatch, user?.uid, token]);
  // ENDS

  // HANDLE CONFIRM BUTTON - TRIGGERS HORIZONTAL LOADING ANIMATION
  const handleConfirm = async () => {
    if (!selectedLocation || !selectedDate) {
      alert("Please select an address and delivery date");
      return;
    }

    if (!token || !user?.uid || !selectedLocation) {
      console.warn("TOKEN OR UID NOT AVAILABLE");
      return;
    }

    try {
      await dispatch(
        createRequest({
          litres: quantity,
          location: {
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            address: selectedLocation.address,
          },
          token,
          uid: user.uid,
          date: selectedDate,
          name: user.name,
          phoneNumber: user.phoneNumber,
        })
      );

      if (success === true) {
        setIsWaiting(true);
      }
    } catch (error: any) {
      console.error("Error creating request:", error);
    }
  };
  // ENDS

  // ADDRESS MODAL
  const handleOpenAddressModal = () => {
    setAddressModalVisible(true);
  };
  // ENDS

  // PICK DATE
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
  // ENDS

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
              onPress={() => setNotificationVisible(true)}
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

      <ScrollView contentContainerStyle={{ paddingBottom: 100, gap: 20 }}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={[styles.title]}>Welcome</ThemedText>
          <ThemedText
            numberOfLines={1}
            style={[
              styles.title,
              {
                fontFamily: "poppinsMedium",
                textTransform: "capitalize",
                fontSize: 46,
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
            { backgroundColor: colors.button, borderColor: colors.border },
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
                  backgroundColor: colors.button,
                  width: "48%",
                },
              ]}
              onPress={() => handleOpenAddressModal()}
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
                  backgroundColor: colors.button,
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

          <ThemedText
            style={{
              fontSize: 12,
              fontFamily: "poppinsMedium",
              textAlign: "center",
              color: colors.textSecondary,
              marginBottom: 5,
            }}
          >
            CHOOSE NUMBER OF WATER BOTTLE NEEDED
          </ThemedText>

          {/* QUANTITY CONTROLS */}
          <View
            style={[
              styles.quantityRow,
              { backgroundColor: colors.button, borderColor: colors.border },
            ]}
          >
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
                  size={38}
                  color={colors.background}
                />
              </TouchableOpacity>

              <ThemedText
                style={{
                  fontSize: 18,
                  fontFamily: "poppinsBold",
                  color: colors.textSecondary,
                  textTransform: "uppercase",
                }}
              >
                CONFIRM
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
      </ScrollView>
      {/* ENDS */}

      {/* ADDRESS MODAL */}
      <AddressModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        initialView="list"
      />
      {/* ENDS */}

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
                width: 45,
                height: 45,
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
            <ThemedText style={styles.calendarTitle}>Delivery Date</ThemedText>
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
      {/* ENDS */}

      {/* NOTIFICATION MODAL */}
      <NotificationModal
        visible={notificationVisible}
        onClose={() => setNotificationVisible(false)}
      />
      {/* ENDS */}

      {/* WAITING MODAL */}
      <WaitingModal
        visible={isWaiting}
        onClose={() => setIsWaiting(false)}
      />
      {/* ENDS */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 60,
    justifyContent: "space-between",
  },

  header: {
    marginBottom: 14,
  },

  title: {
    fontSize: 52,
    marginBottom: 4,
    lineHeight: 60,
    fontFamily: "poppinsBold",
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
    paddingHorizontal: 14,
    marginBottom: 20,
  },

  quickTitle: {
    fontSize: 32,
    fontFamily: "poppinsLight",
    marginBottom: 4,
    lineHeight: 50,
    textTransform: "uppercase",
    textAlign: "center",
  },

  quickSubtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 16,
    fontFamily: "poppinsExtraLight",
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
  },

  locationButton: {
    height: 60,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 0,
  },

  locationButtonText: {
    fontFamily: "poppinsLight",
    textTransform: "uppercase",
    textAlign: "left",
  },

  dateButton: {
    height: 60,
    paddingHorizontal: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 0,
  },

  dateButtonText: {
    fontSize: 12,
    fontFamily: "poppinsLight",
    textTransform: "uppercase",
    textAlign: "center",
  },

  quantityRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    justifyContent: "space-between",
    borderRadius: 32,
    padding: 4,
    borderWidth: 0.7,
    alignItems: "center",
  },

  quantityButton: {
    width: 60,
    height: 60,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },

  quantityDisplay: {
    width: 150,
    height: 60,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },

  quantityText: {
    fontSize: 18,
    fontFamily: "poppinsMedium",
  },

  confirmContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
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
    fontSize: 28,
    fontFamily: "poppinsBold",
    flex: 1,
    lineHeight: 50,
  },

  calendarContainer: {
    marginHorizontal: 16,
    borderRadius: 48,
    borderWidth: 1,
    padding: 16,
  },
});
