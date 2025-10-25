import {
  Platform,
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  useColorScheme,
  Text,
  Modal,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Fonts } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useRef } from "react";
import AddressModal from "@/components/AddressModal";
import { Calendar } from "react-native-calendars";

export default function HomeScreen() {
  // GET CURRENT COLOR SCHEME
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];

  // STATE FOR QUANTITY, LOCATION, AND DATES
  const [quantity, setQuantity] = useState(20);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [addressModalInitialView, setAddressModalInitialView] = useState<"list" | "search">("list");
  const loadingAnim = useRef(new Animated.Value(0)).current;
  const notifications = 0;

  // MOCK SAVED ADDRESSES
  const [savedAddresses, setSavedAddresses] = useState([
    "123 Main Street, Downtown",
    "456 Oak Avenue, Midtown",
  ]);

  // HANDLE CONFIRM BUTTON - TRIGGERS HORIZONTAL LOADING ANIMATION
  const handleConfirm = () => {
    if (isLoading || !selectedAddress || !selectedDate) {
      alert("Please select an address and delivery date");
      return;
    }

    setIsLoading(true);
    Animated.timing(loadingAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start(() => {
      setIsLoading(false);
      loadingAnim.setValue(0);
    });
  };

  const handleOpenAddressModal = (view: "list" | "search" = "list") => {
    setAddressModalInitialView(view);
    setAddressModalVisible(true);
  };

  const handleAddAddress = (address: string) => {
    setSavedAddresses([...savedAddresses, address]);
  };

  const handleSelectAddress = (address: string) => {
    setSelectedAddress(address);
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
      {/* HEADER SECTION WITH TITLE AND BUTTONS */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            {/* Animated Water Circle Logo */}
            <View
              style={{
                position: "relative",
                width: 56,
                height: 56,
              }}
            >
              {/* Outer gradient circle effect */}
              <View
                style={{
                  position: "absolute",
                  width: 48,
                  height: 48,
                  borderRadius: 28,
                  backgroundColor: colors.tint + "15",
                  borderWidth: 2,
                  borderColor: colors.tint + "30",
                }}
              />

              {/* Inner circle with water drop */}
              <View
                style={{
                  position: "absolute",
                  width: 40,
                  height: 40,
                  borderRadius: 24,
                  backgroundColor: colors.tint,
                  justifyContent: "center",
                  alignItems: "center",
                  top: 4,
                  left: 4,
                  shadowColor: colors.tint,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Ionicons name="water" size={28} color={colors.background} />
              </View>

              {/* Top accent dot */}
              <View
                style={{
                  position: "absolute",
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: colors.tint,
                  top: -3,
                  right: 8,
                  opacity: 0.6,
                }}
              />

              {/* Bottom accent dot */}
              <View
                style={{
                  position: "absolute",
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: colors.tint,
                  bottom: -2,
                  left: 8,
                  opacity: 0.4,
                }}
              />
            </View>

            {/* Text Logo */}
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.sans,
                  color: colors.text,
                  fontSize: 24,
                  fontWeight: "800",
                  letterSpacing: -0.8,
                  lineHeight: 38,
                }}
              >
                MATI
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.sans,
                  color: colors.tint,
                  fontSize: 8,
                  fontWeight: "600",
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                  opacity: 0.8,
                  marginBottom: 8,
                }}
              >
                Pure Water
              </Text>
            </View>
          </View>

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

      {/* STATS CARD - SHOWS LITRES BOUGHT */}
      <View
        style={[
          styles.statsCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View
          style={[styles.stylingDotOne, { backgroundColor: colors.background }]}
        />
        <View
          style={[styles.stylingDotTwo, { backgroundColor: colors.background }]}
        />
        <View
          style={[
            styles.stylingDotThree,
            { backgroundColor: colors.background },
          ]}
        />

        <View style={styles.statsContent}>
          <Ionicons name="water" size={28} color={colors.tint} />
          <View style={styles.statsText}>
            <ThemedText style={styles.statsLabel}>Total Purchased</ThemedText>
            <ThemedText style={[styles.statsValue, { color: colors.tint }]}>
              500 Litres
            </ThemedText>
          </View>
        </View>

        <View style={styles.statsDetails}>
          <View style={styles.statItem}>
            <Ionicons name="calendar" size={16} color={colors.textSecondary} />
            <ThemedText style={styles.statText}>This Month</ThemedText>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="trending-up" size={16} color={colors.tint} />
            <ThemedText style={[styles.statText, { color: colors.tint }]}>
              +50L
            </ThemedText>
          </View>
        </View>
      </View>

      {/* ONGOING DELIVERY CARD - PLACEHOLDER */}
      <View>
        {/* Ongoing delivery card would go here */}
      </View>

      {/* QUICK REQUEST SECTION */}
      <View
        style={[
          styles.quickCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <ThemedText style={styles.quickTitle}>Quick Request</ThemedText>
        <ThemedText style={styles.quickSubtitle}>Book your water from your nearest provider</ThemedText>

        <View
          style={[styles.stylingDotOne, { backgroundColor: colors.background }]}
        />
        <View
          style={[styles.stylingDotTwo, { backgroundColor: colors.background }]}
        />
        <View
          style={[
            styles.stylingDotThree,
            { backgroundColor: colors.background },
          ]}
        />
        <View
          style={[
            styles.stylingDotFour,
            { backgroundColor: colors.background },
          ]}
        />

        {/* LOCATION AND DATE BUTTONS ROW */}
        <View style={styles.locationRow}>
          <TouchableOpacity
            style={[
              styles.locationButton,
              {
                backgroundColor: colors.background,
                width: "50%"
              },
            ]}
            onPress={() => handleOpenAddressModal("list")}
          >
            <ThemedText style={[styles.locationButtonText, {width: "80%"}]}>
              {selectedAddress || "Select Address"}
            </ThemedText>
            <Ionicons name="location" size={20} color={colors.tint} style={{marginRight: 15,width: "20%"}} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.dateButton,
              {
                backgroundColor: colors.background,
               width: "50%"
              },
            ]}
            onPress={() => setDatePickerVisible(true)}
          >
            <Ionicons name="calendar" size={20} color={colors.tint} />
            <ThemedText style={styles.dateButtonText}>
              {formatDate(selectedDate)}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.newButton, { backgroundColor: colors.card }]}
            onPress={() => handleOpenAddressModal("search")}
          >
            <ThemedText
              style={{
                color: colors.tint,
                fontWeight: "600",
                fontSize: 12,
              }}
            >
              + NEW ADDRESS
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

        {/* CONFIRM BUTTON WITH LOADING ANIMATION */}
        <View
          style={[
            styles.confirmContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <TouchableOpacity
            onPress={handleConfirm}
            disabled={isLoading}
            style={[styles.confirmButton, { backgroundColor: colors.tint }]}
          >
            <Ionicons
              name="chevron-forward"
              size={32}
              color={colors.background}
            />
          </TouchableOpacity>

          <ThemedText style={styles.confirmText}>CONFIRM</ThemedText>

          <View
            style={{
              alignItems: "center",
              backgroundColor: colors.background,
              flexDirection: "row",
            }}
          >
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.textSecondary}
            />
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.textSecondary}
            />
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.textSecondary}
            />
          </View>
        </View>
      </View>

      {/* ADDRESS MODAL */}
      <AddressModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        onSelectAddress={handleSelectAddress}
        savedAddresses={savedAddresses}
        onAddAddress={handleAddAddress}
        initialView={addressModalInitialView}
      />

      {/* CALENDAR MODAL */}
      <Modal
        visible={datePickerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDatePickerVisible(false)}
      >
        <View
          style={[
            styles.calendarOverlay,
            { backgroundColor: colors.background },
          ]}
        >
          <View style={styles.calendarHeader}>
            <ThemedText style={styles.calendarTitle}>
              Select Delivery Date
            </ThemedText>
            <TouchableOpacity onPress={() => setDatePickerVisible(false)}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
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
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: -0.5,
    lineHeight: 50,
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

  statsCard: {
    borderRadius: 38,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },

  statsContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },

  statsText: {
    flex: 1,
  },

  statsLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
    textTransform: "uppercase",
    textAlign: "left",
  },

  statsValue: {
    fontSize: 24,
    fontWeight: "800",
  },

  statsDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },

  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  statText: {
    fontSize: 14,
    opacity: 0.8,
    textTransform: "uppercase",
    textAlign: "center",
  },

  quickCard: {
    borderRadius: 38,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
  },

  quickTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 4,
    lineHeight: 50,
  },

  quickSubtitle: {
    fontSize: 14.3,
    opacity: 0.6,
    marginBottom: 16,
    fontWeight: "400",
  },

  stylingDotOne: {
    position: "absolute",
    top: "60%",
    right: -30,
    width: 45,
    height: 45,
    borderRadius: 24,
    transform: [{ translateY: -22.5 }],
  },

  stylingDotTwo: {
    position: "absolute",
    top: "60%",
    left: -30,
    width: 45,
    height: 45,
    borderRadius: 24,
    transform: [{ translateY: -22.5 }],
  },

  stylingDotThree: {
    position: "absolute",
    top: -10,
    right: "50%",
    width: 45,
    height: 45,
    borderRadius: 24,
    transform: [{ translateY: -22.5 }],
  },

  stylingDotFour: {
    position: "absolute",
    bottom: -50,
    left: "48%",
    width: 45,
    height: 45,
    borderRadius: 24,
    transform: [{ translateY: -22.5 }],
  },

  locationRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    marginHorizontal:-18
  },

  locationButton: {
    height: 60,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    // overflow: "hidden",
  },

  locationButtonText: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    textAlign: "left",
  },

  dateButton: {
    height: 60,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    paddingHorizontal: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  dateButtonText: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    textAlign: "right",
  },

  newButton: {
    paddingHorizontal: 0,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    height: 35,
    position: "absolute",
    top: -85,
    right: 16,
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
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },

  quantityDisplay: {
    width: 150,
    height: 60,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },

  quantityText: {
    fontSize: 18,
    fontWeight: "600",
  },

  confirmContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
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
  },

  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 24,
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