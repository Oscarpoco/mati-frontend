import {
  Platform,
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  Text
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Fonts } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useRef } from "react";

export default function HomeScreen() {
  // GET CURRENT COLOR SCHEME
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];

  // STATE FOR QUANTITY AND LOCATION
  const [quantity, setQuantity] = useState(20);
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const loadingAnim = useRef(new Animated.Value(0)).current;
  const notifications = 3

  // HANDLE CONFIRM BUTTON - TRIGGERS HORIZONTAL LOADING ANIMATION
  const handleConfirm = () => {
    if (isLoading) return;

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

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* HEADER SECTION WITH TITLE AND BUTTONS */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons name="water" size={32} color={colors.tint} />
            <ThemedText style={[styles.title, { fontFamily: Fonts.sans }]}>
              Mati
            </ThemedText>
          </View>

          <View style={styles.headerButtons}>
            {/* SCANNER BUTTON */}
            <TouchableOpacity
              style={[
                styles.iconButton,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Ionicons name="scan" size={28} color={colors.tint} />
            </TouchableOpacity>

            {/* NOTIFICATION BUTTON */}
            <TouchableOpacity
              style={[
                styles.iconButton,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Ionicons name="notifications" size={28} color={colors.tint} />
              {notifications > 0 && (
                <View style={[styles.notificationBadge, {backgroundColor: colors.warningRed}]}>
                  <Text style={{fontWeight: '600', color: colors.text, fontSize: 14}}>{notifications}</Text>
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

        <View style={[styles.stylingDotOne, {backgroundColor: colors.background}]} />
        <View style={[styles.stylingDotTwo, {backgroundColor: colors.background}]} />
        <View style={[styles.stylingDotThree, {backgroundColor: colors.background}]} />

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

      <View>
        {/* I WANT A CARD THAT SHOWS AN ONGOING DELIVERY IF THERES ANY BUT IF THERE'S NONE RENDER THAT NO BOOKINGS AVAILABLE  */}
      </View>

      {/* QUICK REQUEST SECTION */}
      <View
        style={[
          styles.quickCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <ThemedText style={styles.quickTitle}>Quick Request</ThemedText>
        <ThemedText style={styles.quickSubtitle}>Book your water</ThemedText>

        <View style={[styles.stylingDotOne, {backgroundColor: colors.background}]} />
        <View style={[styles.stylingDotTwo, {backgroundColor: colors.background}]} />
        <View style={[styles.stylingDotThree, {backgroundColor: colors.background}]} />
        <View style={[styles.stylingDotFour, {backgroundColor: colors.background}]} />

        {/* LOCATION INPUT WITH AUTO BUTTON */}
        <View style={styles.locationRow}>
          <TextInput
            style={[
              styles.locationInput,
              {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="Enter Your location"
            placeholderTextColor={colors.textSecondary}
            value={location}
            onChangeText={setLocation}
          />
          <TouchableOpacity
            style={[styles.autoButton, { backgroundColor: colors.tint }]}
          >
            <ThemedText
              style={{
                color: colors.background,
                fontWeight: "600",
                fontSize: 14,
              }}
            >
              AUTO
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  // MAIN CONTAINER - NO SCROLL
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 60,
    paddingBottom: 100,
    justifyContent: "space-between",
  },

  // HEADER WITH TITLE AND BUTTONS
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
    width: 27,
    height: 27,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },

  LocationButton: {
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },

  // STATS CARD SECTION
  statsCard: {
    borderRadius: 0,
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
    textAlign: 'left'
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
    textAlign: 'center'
  },

  // QUICK REQUEST CARD
  quickCard: {
    borderRadius: 0,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
  },

  quickTitle: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 4,
    lineHeight: 50,
  },

  quickSubtitle: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 16,
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
    top: -12,
    right: "50%",
    width: 45,
    height: 45,
    borderRadius: 24,
    transform: [{ translateY: -22.5 }],
  },

  stylingDotFour: {
    position: "absolute",
    bottom: -50,
    left: "50%",
    width: 45,
    height: 45,
    borderRadius: 24,
    transform: [{ translateY: -22.5 }],
  },

  // LOCATION INPUT
  locationRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },

  locationInput: {
    flex: 1,
    height: 64,
    borderRadius: 18,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },

  autoButton: {
    paddingHorizontal: 14,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    height: 60,
  },

  // QUANTITY CONTROLS
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

  // CONFIRM BUTTON WITH LOADING
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

  loadingBar: {
    height: 3,
    borderRadius: 1.5,
  },

  confirmText: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.7,
    letterSpacing: 1.2,
  },
});
