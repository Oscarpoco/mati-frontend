import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  Animated,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

// REDUX
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { getRequests } from "@/redux/slice/requestSlice";
// ENDS

interface waitingModalProps {
  visible: boolean;
  onClose: () => void;
}

const AnimatedDrop = ({ color }: { color: string }) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -24,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [bounceAnim]);

  return (
    <View style={[styles.dropContainer]}>
      <View style={[styles.drop]}>
        <Ionicons name="water" size={36} color="#41F4DA" />
      </View>
    </View>
  );
};

// PULSE RINGS
const PulseRing = ({ color }: { color: string }) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0.4)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.6,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0.9,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.4,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [scaleAnim, opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.pulseRing,
        {
          borderColor: color,
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.pulseRing1,
          {
            borderColor: color,
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.pulseRing2,
            {
              borderColor: color,
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        />
      </Animated.View>
    </Animated.View>
  );
};
// ENDS

export const WaitingModal = ({ visible, onClose }: waitingModalProps) => {
  const colors = Colors["dark"];

  // 🔹 REDUX AUTH STATE
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const { loading, customerRequests } = useAppSelector(
    (state) => state.request
  );

  const [pendingRequests, setPendingRequests] = useState(customerRequests);
  const slideAnim = useRef(new Animated.Value(600)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // FETCH REQUESTS
  useEffect(() => {
    if (user?.uid && token && user?.role) {
      dispatch(getRequests({ uid: user.uid, token, role: user.role }));
    }
  }, [dispatch, user?.uid, user?.role, token]);
  // ENDS

  // Update pendingRequests whenever customerRequests changes
  useEffect(() => {
    setPendingRequests(customerRequests);
  }, [customerRequests]);

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 600,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleAnim, slideAnim, fadeAnim]);

  const handleCancelRequest = (id: string) => {
    setPendingRequests(pendingRequests.filter((req) => req.id !== id));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        >
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
                backgroundColor: colors.background,
              },
            ]}
            onStartShouldSetResponder={() => true}
          >
            {/* Close Button */}
            <TouchableOpacity
              style={[
                styles.closeButton,
                {
                  backgroundColor: colors.card,
                },
              ]}
              onPress={onClose}
              activeOpacity={0.6}
            >
              <Ionicons name="chevron-down" size={26} color={colors.text} />
            </TouchableOpacity>

            {/* Header Section */}
            <View
              style={[
                styles.headerSection,
                { backgroundColor: colors.background },
              ]}
            >
              <View style={styles.pulseContainer}>
                <PulseRing color={colors.tint} />
                <AnimatedDrop color={colors.tint} />
              </View>

              <ThemedText
                style={[styles.headerTitle, { fontFamily: "poppinsBlack" }]}
              >
                Water Delivery Confirmed
              </ThemedText>

              <ThemedText
                style={[
                  styles.headerSubtitle,
                  { fontFamily: "poppinsLight", color: colors.textSecondary },
                ]}
              >
                Your booking has been successfully placed
              </ThemedText>
            </View>

            {/* Service Details - Horizontal Scroll */}
            <View
              style={[
                styles.detailsSection,
                { backgroundColor: colors.background },
              ]}
            >
              <ThemedText
                style={[
                  styles.sectionTitle,
                  { fontFamily: "poppinsLight", color: colors.text },
                ]}
              >
                Your Pending Requests
              </ThemedText>

              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.tint} />
                  <ThemedText
                    style={[
                      styles.loadingText,
                      {
                        fontFamily: "poppinsLight",
                        color: colors.textSecondary,
                        marginTop: 12,
                      },
                    ]}
                  >
                    Fetching your requests...
                  </ThemedText>
                </View>
              ) : pendingRequests.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  scrollEventThrottle={16}
                  style={styles.horizontalScroll}
                  contentContainerStyle={styles.scrollContent}
                >
                  {pendingRequests.map((item) => (
                    <Animated.View
                      key={item.id}
                      style={[
                        styles.requestCard,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.card,
                        },
                      ]}
                    >
                      <View style={styles.cardHeader}>
                        <View style={[styles.cardIcon]}>
                          <Ionicons
                            name="water"
                            size={28}
                            color={colors.tint}
                          />
                        </View>

                        {item.litres > 0 && (
                          <View
                            style={[
                              styles.litreTagCard,
                              {
                                backgroundColor: colors.button,
                              },
                            ]}
                          >
                            <Ionicons
                              name="water"
                              size={13}
                              color={colors.tint}
                            />
                            <ThemedText
                              style={[
                                styles.litreTextCard,
                                {
                                  fontFamily: "poppinsBold",
                                  color: colors.tint,
                                },
                              ]}
                            >
                              {item.litres}L
                            </ThemedText>
                          </View>
                        )}
                      </View>

                      <ThemedText
                        style={[
                          styles.cardTitle,
                          { fontFamily: "poppinsBold", color: colors.text },
                        ]}
                      >
                        R {item.price}
                      </ThemedText>

                      <ThemedText
                        style={[
                          styles.cardTimestamp,
                          {
                            fontFamily: "poppinsLight",
                            color: colors.textSecondary,
                          },
                        ]}
                      >
                        {new Date(item.createdAt).toLocaleString("en-ZA", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </ThemedText>

                      <TouchableOpacity
                        style={[styles.cancelButtonCard]}
                        onPress={() => handleCancelRequest(item.id)}
                        activeOpacity={0.6}
                      >
                        <ThemedText style={{ color: colors.textSecondary }}>
                          Cancel
                        </ThemedText>
                      </TouchableOpacity>
                    </Animated.View>
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.emptyContainer}>
                  <View
                    style={[
                      styles.emptyIcon,
                      {
                        backgroundColor: colors.tint,
                      },
                    ]}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={64}
                      color={colors.tint}
                    />
                  </View>
                  <ThemedText
                    style={[
                      styles.emptyText,
                      { fontFamily: "poppinsBold", color: colors.text },
                    ]}
                  >
                    All Clear!
                  </ThemedText>
                </View>
              )}
            </View>

            {/* Info Box */}
            <View
              style={[
                styles.infoBox,
                {
                  backgroundColor: colors.background,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.infoText,
                  { fontFamily: "poppinsLight", color: "#fb0303ab" },
                ]}
              >
                You&apos;ll receive a notification once a provider accepts your
                request
              </ThemedText>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  overlayTouchable: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    height: "100%",
    paddingBottom: Platform.OS === "ios" ? 40 : 0,
    overflow: "hidden",
    flex: 1,
    justifyContent: "flex-end",
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 14,
    marginBottom: 12,
  },
  headerSection: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 6,
  },
  pulseContainer: {
    width: 130,
    height: 130,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
    position: "relative",
  },
  pulseRing: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3.5,
    justifyContent: "center",
    alignItems: "center",
  },
  pulseRing1: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3.5,
    justifyContent: "center",
    alignItems: "center",
  },
  pulseRing2: {
    width: 60,
    height: 60,
    borderRadius: 25,
    borderWidth: 3.5,
  },
  dropContainer: {
    width: 110,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
  },
  drop: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 32,
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: -0.8,
    lineHeight: 38,
  },
  headerSubtitle: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  statusBox: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 14,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusTitle: {
    fontSize: 14,
    marginBottom: 3,
  },
  statusMessage: {
    fontSize: 13,
    lineHeight: 18,
  },
  detailsSection: {
    paddingVertical: 4,
    borderTopWidth: 0.8,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 24,
    marginBottom: 18,
    paddingLeft: 24,
    letterSpacing: -0.3,
    lineHeight: 38,
    paddingVertical: 5,
  },
  horizontalScroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 24,
    gap: 14,
  },
  loadingContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  loadingText: {
    fontSize: 14,
    lineHeight: 18,
  },
  requestCard: {
    width: 170,
    padding: 16,
    borderRadius: 32,
    borderWidth: 1,
    justifyContent: "space-between",
    minHeight: 150,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cardIcon: {
    height: 37,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonCard: {
    width: "100%",
    height: 32,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fc030351",
  },
  cardTitle: {
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 18,
  },
  cardTimestamp: {
    fontSize: 11,
    marginBottom: 12,
    lineHeight: 15,
  },
  litreTagCard: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  litreTextCard: {
    fontSize: 11,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    marginTop: "auto",
  },
  cardFooterText: {
    fontSize: 12,
  },
  infoBox: {
    marginHorizontal: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
    textAlign: "center",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    width: 90,
    height: 90,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  emptyText: {
    fontSize: 20,
    letterSpacing: -0.3,
  },
});
