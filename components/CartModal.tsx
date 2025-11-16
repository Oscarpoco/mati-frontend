import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  FlatList,
  Modal,
  PanResponder,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: "water" | "ice";
}

interface CartModalProps {
  visible: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  visible,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];

  // Modal animations
  const slideAnim = useRef(new Animated.Value(600)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const bottomSectionAnim = useRef(new Animated.Value(100)).current;
  const animatedTotal = useRef(new Animated.Value(0)).current;
  const priceAnimationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearAllScale = useRef(new Animated.Value(1)).current;

  const totalBalance = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Animate modal entry/exit
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(bottomSectionAnim, {
          toValue: 0,
          delay: 150,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
      ]).start();

      // Calculate delay: wait for all items to finish rendering
      // Each item has delay: index * 80ms, animation duration ~300ms
      // Add buffer for smooth transition
      const lastItemIndex = items.length > 0 ? items.length - 1 : 0;
      const itemAnimationDelay = lastItemIndex * 80; // Last item's delay
      const itemAnimationDuration = 300; // Animation duration
      const bufferTime = 150; // Buffer for smooth transition
      const totalDelay = itemAnimationDelay + itemAnimationDuration + bufferTime;

      // Reset animated total initially
      animatedTotal.setValue(0);

      // Start price animation after all items are done rendering
      priceAnimationTimerRef.current = setTimeout(() => {
        // Animate total using Animated.Value to avoid re-renders
        Animated.timing(animatedTotal, {
          toValue: totalBalance,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false, // Can't use native driver for text values
        }).start();
      }, totalDelay);

      return () => {
        if (priceAnimationTimerRef.current) {
          clearTimeout(priceAnimationTimerRef.current);
          priceAnimationTimerRef.current = null;
        }
        // Stop any ongoing animation
        animatedTotal.stopAnimation();
      };
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 600,
          duration: 250,
          useNativeDriver: true,
          easing: Easing.in(Easing.ease),
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(bottomSectionAnim, {
          toValue: 100,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      animatedTotal.setValue(0);
    }
  }, [visible, totalBalance]);

  // 🔹 Modern Cart Item Component with Swipe Delete (Memoized to prevent flickering)
  const CartItemComponent = React.memo(({ item, index }: { item: CartItem; index: number }) => {
    const pan = useRef(new Animated.ValueXY()).current;
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const priceAnim = useRef(new Animated.Value(item.price * item.quantity)).current;
    const quantityScale = useRef(new Animated.Value(1)).current;

    // Staggered entry animation
    useEffect(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          delay: index * 80,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          delay: index * 80,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    // Animate price change
    useEffect(() => {
      Animated.sequence([
        Animated.timing(priceAnim, {
          toValue: item.price * item.quantity,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
      ]).start();
    }, [item.quantity, item.price]);

    // Animate quantity change
    const animateQuantityChange = () => {
      Animated.sequence([
        Animated.spring(quantityScale, {
          toValue: 1.2,
          useNativeDriver: true,
          tension: 300,
          friction: 3,
        }),
        Animated.spring(quantityScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 300,
          friction: 3,
        }),
      ]).start();
    };

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, { dx }) => Math.abs(dx) > 10,
        onPanResponderMove: (_, { dx }) => {
          if (dx < 0) {
            pan.x.setValue(dx);
          }
        },
        onPanResponderRelease: (_, { dx }) => {
          if (dx < -80) {
            Animated.parallel([
              Animated.timing(pan.x, {
                toValue: -120,
                duration: 200,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease),
              }),
              Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
              }),
            ]).start(() => {
              onRemoveItem(item.id);
            });
          } else {
            Animated.spring(pan.x, {
              toValue: 0,
              useNativeDriver: true,
              tension: 100,
              friction: 8,
            }).start();
          }
        },
      })
    ).current;

    const deleteOpacity = pan.x.interpolate({
      inputRange: [-120, -60, 0],
      outputRange: [1, 0.5, 0],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={[
          styles.itemWrapper,
          {
            opacity: opacityAnim,
            transform: [
              { scale: scaleAnim },
              { translateX: pan.x },
            ],
          },
        ]}
      >
        {/* Delete Button Background */}
        <Animated.View
          style={[
            styles.deleteButtonBg,
            {
              opacity: deleteOpacity,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.deleteButtonTouch}
            onPress={() => onRemoveItem(item.id)}
            activeOpacity={0.8}
          >
            <Ionicons name="trash-bin" size={32} color="white" />
          </TouchableOpacity>
        </Animated.View>

        {/* Item Card */}
        <Animated.View
          style={[
            styles.cartItem,
            {
              backgroundColor: colors.card,
              transform: [{ translateX: pan.x }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Left Section - Product Info */}
          <View style={styles.leftSection}>
            {/* Icon Container */}
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: colors.button
                },
              ]}
            >
              <Ionicons
                name={item.type === "water" ? "water" : "snow"}
                size={24}
                color={colors.tint}
              />
            </View>

            {/* Product Details */}
            <View style={styles.productDetails}>
              <ThemedText
                style={[
                  styles.productName,
                  { color: colors.text, fontFamily: "poppinsMedium" },
                ]}
                numberOfLines={1}
              >
                {item.name}
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                  marginTop: 2,
                  fontFamily: "poppinsLight",
                }}
              >
                R{item.price.toFixed(2)}
              </ThemedText>
            </View>
          </View>

          {/* Right Section - Price & Quantity */}
          <View style={styles.rightSection}>
            <PriceDisplay
              priceAnim={priceAnim}
              colors={colors}
              totalPrice={item.price * item.quantity}
            />

            {/* Quantity Selector */}
            <View
              style={[
                styles.quantitySelector,
                {
                  backgroundColor: colors.background,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  animateQuantityChange();
                  onUpdateQuantity(item.id, Math.max(1, item.quantity - 1));
                }}
                style={styles.quantityBtn}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="remove-outline"
                  size={18}
                  color={colors.tint}
                />
              </TouchableOpacity>

              <Animated.Text
                style={{
                  fontSize: 14,
                  fontFamily: "poppinsMedium",
                  color: colors.text,
                  minWidth: 24,
                  textAlign: "center",
                  transform: [{ scale: quantityScale }],
                }}
              >
                {item.quantity}
              </Animated.Text>

              <TouchableOpacity
                onPress={() => {
                  animateQuantityChange();
                  onUpdateQuantity(item.id, item.quantity + 1);
                }}
                style={styles.quantityBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="add-outline" size={18} color={colors.tint} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    );
  });

  // 🔹 Empty Cart State with Animation
  const EmptyCart = () => {
    const iconScale = useRef(new Animated.Value(0)).current;
    const iconRotate = useRef(new Animated.Value(0)).current;
    const textFade = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.spring(iconScale, {
          toValue: 1,
          delay: 200,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(iconRotate, {
              toValue: 1,
              duration: 2000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(iconRotate, {
              toValue: 0,
              duration: 2000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.timing(textFade, {
          toValue: 1,
          delay: 400,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    const rotateInterpolate = iconRotate.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "10deg"],
    });

    return (
      <View style={styles.emptyContainer}>
        <Animated.View
          style={[
            styles.emptyIconBg,
            {
              backgroundColor: `${colors.tint}10`,
              transform: [
                { scale: iconScale },
                { rotate: rotateInterpolate },
              ],
            },
          ]}
        >
          <Ionicons name="cart-outline" size={100} color={colors.tint} />
        </Animated.View>
        <Animated.View style={{ opacity: textFade }}>
          <ThemedText
            style={[
              styles.emptyTitle,
              { color: colors.text, fontFamily: "poppinsMedium" },
            ]}
          >
            Cart is Empty
          </ThemedText>
          <ThemedText
            style={{
              color: colors.textSecondary,
              fontSize: 14,
              marginTop: 8,
              fontFamily: "poppinsLight",
              textAlign: "center",
            }}
          >
            Add some refreshing items to get started
          </ThemedText>
        </Animated.View>
      </View>
    );
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
          styles.backdrop,
          {
            opacity: backdropAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.modalContainer,
          {
            backgroundColor: colors.background,
            transform: [{ translateY: slideAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText
              style={[
                styles.headerTitle,
                { color: colors.text, fontFamily: "poppinsBold" },
              ]}
            >
              Shopping Cart
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 12,
                color: colors.textSecondary,
                marginTop: 4,
                fontFamily: "poppinsLight",
              }}
            >
              {items.length} {items.length === 1 ? "item" : "items"} in cart
            </ThemedText>
          </View>
          <View style={styles.headerActions}>
            {items.length > 0 && (
              <Animated.View
                style={{
                  transform: [{ scale: clearAllScale }],
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    // Animate button press
                    Animated.sequence([
                      Animated.spring(clearAllScale, {
                        toValue: 0.9,
                        useNativeDriver: true,
                        tension: 300,
                        friction: 10,
                      }),
                      Animated.spring(clearAllScale, {
                        toValue: 1,
                        useNativeDriver: true,
                        tension: 300,
                        friction: 10,
                      }),
                    ]).start();

                    // Clear all items
                    items.forEach((item) => onRemoveItem(item.id));
                  }}
                  style={[
                    styles.clearAllBtn,
                    { backgroundColor: 'transparent' },
                  ]}
                  activeOpacity={0.8}
                >
                  <Ionicons name="trash-outline" size={18} color={colors.tint} />
                  <ThemedText
                    style={{
                      fontSize: 12,
                      color: colors.tint,
                      fontFamily: "poppinsMedium",
                      marginLeft: 4,
                    }}
                  >
                    Clear All
                  </ThemedText>
                </TouchableOpacity>
              </Animated.View>
            )}
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.closeBtn,
                { backgroundColor: colors.warningRed },
              ]}
              activeOpacity={0.7}
            >
              <Ionicons name="close-outline" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Cart Items List */}
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <CartItemComponent item={item} index={index} />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
          />
        )}

        {/* Bottom Summary Section */}
        {items.length > 0 && (
          <Animated.View
            style={[
              styles.bottomSection,
              {
                backgroundColor: colors.button,
                transform: [{ translateY: bottomSectionAnim }],
              },
            ]}
          >
            {/* Price Breakdown */}
            <View style={styles.priceBreakdown}>
              <View style={styles.priceRow}>
                <ThemedText
                  style={{
                    fontSize: 13,
                    color: colors.textSecondary,
                    fontFamily: "poppinsLight",
                  }}
                >
                  Subtotal
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: 13,
                    color: colors.text,
                    fontFamily: "poppinsLight",
                  }}
                >
                  R{totalBalance.toFixed(2)}
                </ThemedText>
              </View>

              {/* <View style={styles.priceRow}>
                <ThemedText
                  style={{
                    fontSize: 13,
                    color: colors.textSecondary,
                    fontFamily: "poppinsLight",
                  }}
                >
                  Delivery
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: 13,
                    color: "#10B981",
                    fontFamily: "poppinsMedium",
                  }}
                >
                  Free
                </ThemedText>
              </View> */}
            </View>

            {/* Divider */}
            <View
              style={[
                styles.divider,
                { backgroundColor: colors.border },
              ]}
            />

            {/* Total Amount */}
            <View style={styles.totalSection}>
              <ThemedText
                style={{
                  fontSize: 18,
                  color: colors.textSecondary,
                  fontFamily: "poppinsLight",
                }}
              >
                Total Amount
              </ThemedText>
              <AnimatedTotalDisplay
                animatedTotal={animatedTotal}
                colors={colors}
              />
            </View>

            {/* Checkout Button */}
            <CheckoutButton
              onPress={onCheckout}
              colors={colors}
              totalItems={items.length}
            />

          </Animated.View>
        )}
      </Animated.View>
    </Modal>
  );
};

// 🔹 Animated Price Display Component
const PriceDisplay: React.FC<{
  priceAnim: Animated.Value;
  colors: any;
  totalPrice: number;
}> = ({ priceAnim, colors, totalPrice }) => {
  const [displayPrice, setDisplayPrice] = useState(totalPrice);

  useEffect(() => {
    const listenerId = priceAnim.addListener(({ value }) => {
      setDisplayPrice(value);
    });

    return () => {
      priceAnim.removeListener(listenerId);
    };
  }, [priceAnim]);

  return (
    <ThemedText
      style={[
        styles.totalPrice,
        { color: colors.tint, fontFamily: "poppinsMedium" },
      ]}
    >
      R{displayPrice.toFixed(2)}
    </ThemedText>
  );
};

// 🔹 Animated Total Display Component (for main total price)
const AnimatedTotalDisplay: React.FC<{
  animatedTotal: Animated.Value;
  colors: any;
}> = ({ animatedTotal, colors }) => {
  const [displayTotal, setDisplayTotal] = useState(0);

  useEffect(() => {
    const listenerId = animatedTotal.addListener(({ value }) => {
      setDisplayTotal(value);
    });

    return () => {
      animatedTotal.removeListener(listenerId);
    };
  }, [animatedTotal]);

  return (
    <ThemedText
      style={{
        fontSize: 24,
        lineHeight: 38,
        color: colors.tint,
        fontFamily: "poppinsMedium",
        marginTop: 4,
        letterSpacing: -1,
      }}
    >
      R{displayTotal.toFixed(2)}
    </ThemedText>
  );
};

// 🔹 Animated Checkout Button Component
const CheckoutButton: React.FC<{
  onPress: () => void;
  colors: any;
  totalItems: number;
}> = ({ onPress, colors, totalItems }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }, { scale: pulseAnim }],
      }}
    >
      <TouchableOpacity
        style={[
          styles.checkoutBtn,
          { backgroundColor: colors.tint },
        ]}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <ThemedText
          style={{
            fontSize: 16,
            color: colors.background,
            fontFamily: "poppinsMedium",
          }}
        >
          CHECKOUT NOW
        </ThemedText>
        <View style={[styles.checkoutBadge, { backgroundColor: colors.background }]}>
          <ThemedText
            style={{
              fontSize: 12,
              color: colors.tint,
              fontFamily: "poppinsMedium",
            }}
          >
            {totalItems}
          </ThemedText>
        </View>

      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  clearAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 20
  },
  closeBtn: {
    width: 50,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    position: "absolute",
    right: -30,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexGrow: 1,
  },
  itemWrapper: {
    marginHorizontal: 8,
    marginVertical: 8,
    position: "relative",
  },
  deleteButtonBg: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EF4444",
    borderRadius: 24,
    zIndex: 1,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  deleteButtonTouch: {
    width: 120,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 24,
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0.5,
  },
  leftSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,

  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    lineHeight: 18,
  },
  rightSection: {
    alignItems: "flex-end",
    gap: 8,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "700",
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    paddingHorizontal: 4,
    paddingVertical: 5,
    gap: 8,
  },
  quantityBtn: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: 'rgba(210, 208, 208, 0.4)',
    borderWidth: 0.5,
    borderColor: 'rgba(128, 127, 127, 0.93)',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 20,
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  priceBreakdown: {
    gap: 10,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  totalSection: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkoutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 0,
    marginBottom: 12,
    position: "relative",
  },
  checkoutBadge: {
    position: "absolute",
    top: -18,
    right: 20,
    borderRadius: 18,
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
  },
});