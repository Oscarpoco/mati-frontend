import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  Animated,
  PanResponder,
  Platform,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";

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

  const totalBalance = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 🔹 Cart Item Component with Swipe Delete
  const CartItemComponent = ({ item }: { item: CartItem }) => {
    const pan = useRef(new Animated.ValueXY()).current;
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
            Animated.timing(pan.x, {
              toValue: -120,
              duration: 200,
              useNativeDriver: true,
            }).start();
          } else {
            Animated.spring(pan.x, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        },
      })
    ).current;

    return (
      <View style={styles.itemWrapper}>
        {/* Delete Button */}
        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: "#FF6B6B" }]}
          onPress={() => onRemoveItem(item.id)}
        >
          <Ionicons name="trash-bin" size={20} color="white" />
        </TouchableOpacity>

        {/* Item Card */}
        <Animated.View
          style={[
            styles.cartItem,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              transform: [{ translateX: pan.x }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.itemInfo}>
            <View>
              <ThemedText
                style={[
                  styles.itemName,
                  { color: colors.text, fontFamily: "poppinsMedium" },
                ]}
              >
                {item.name}
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                  marginTop: 4,
                  fontFamily: "poppinsLight",
                }}
              >
                {item.type.toUpperCase()}
              </ThemedText>
            </View>
            <ThemedText
              style={[
                styles.itemPrice,
                { color: colors.text, fontFamily: "poppinsMedium" },
              ]}
            >
              R{(item.price * item.quantity).toFixed(2)}
            </ThemedText>
          </View>

          {/* Quantity Controls */}
          <View
            style={[
              styles.quantityControl,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <TouchableOpacity
              onPress={() =>
                onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
              }
              style={styles.quantityButton}
            >
              <Ionicons name="remove-outline" size={18} color={colors.tint} />
            </TouchableOpacity>

            <ThemedText
              style={{
                fontSize: 14,
                fontFamily: "poppinsMedium",
                color: colors.text,
                minWidth: 30,
                textAlign: "center",
              }}
            >
              {item.quantity}
            </ThemedText>

            <TouchableOpacity
              onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
              style={styles.quantityButton}
            >
              <Ionicons name="add-outline" size={18} color={colors.tint} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    );
  };

  // 🔹 Empty Cart State
  const EmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cart-outline" size={64} color={colors.textSecondary} />
      <ThemedText
        style={[
          styles.emptyText,
          { color: colors.text, fontFamily: "poppinsMedium" },
        ]}
      >
        Your cart is empty
      </ThemedText>
      <ThemedText
        style={{
          color: colors.textSecondary,
          fontSize: 14,
          marginTop: 8,
          fontFamily: "poppinsLight",
        }}
      >
        Add items to get started
      </ThemedText>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <ThemedView
        style={[styles.modalContainer, { backgroundColor: colors.background }]}
      >
        {/* Header */}
        <View
          style={[styles.modalHeader, { borderBottomColor: colors.border }]}
        >
          <ThemedText
            style={[
              styles.headerTitle,
              { color: colors.text, fontFamily: "poppinsBold" },
            ]}
          >
            Your Cart
          </ThemedText>
          <TouchableOpacity
            onPress={onClose}
            style={{
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 16,
              backgroundColor: colors.card,
            }}
          >
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Cart Items */}
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CartItemComponent item={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Bottom Section */}
        {items.length > 0 && (
          <View
            style={[
              styles.bottomSection,
              { backgroundColor: colors.card, borderTopColor: colors.border },
            ]}
          >
            {/* Subtotal */}
            <View style={styles.priceRow}>
              <ThemedText
                style={{
                  fontSize: 14,
                  color: colors.textSecondary,
                  fontFamily: "poppinsLight",
                }}
              >
                Subtotal
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: 14,
                  color: colors.text,
                  fontFamily: "poppinsMedium",
                }}
              >
                R{totalBalance.toFixed(2)}
              </ThemedText>
            </View>

            {/* Delivery Fee */}
            <View style={styles.priceRow}>
              <ThemedText
                style={{
                  fontSize: 14,
                  color: colors.textSecondary,
                  fontFamily: "poppinsLight",
                }}
              >
                Delivery
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: 14,
                  color: colors.text,
                  fontFamily: "poppinsMedium",
                }}
              >
                R0.00
              </ThemedText>
            </View>

            {/* Divider */}
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />

            {/* Total */}
            <View style={[styles.priceRow, styles.totalRow]}>
              <ThemedText
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: colors.text,
                  fontFamily: "poppinsMedium",
                }}
              >
                Total
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: 22,
                  fontWeight: "700",
                  color: colors.tint,
                  fontFamily: "poppinsMedium",
                }}
              >
                R{totalBalance.toFixed(2)}
              </ThemedText>
            </View>

            {/* Checkout Button */}
            <TouchableOpacity
              style={[styles.checkoutButton, { backgroundColor: colors.tint }]}
              onPress={onCheckout}
            >
              <ThemedText
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: colors.background,
                  fontFamily: "poppinsMedium",
                }}
              >
                Proceed to Checkout
              </ThemedText>
              <Ionicons
                name="arrow-forward-outline"
                size={20}
                color={colors.background}
              />
            </TouchableOpacity>
          </View>
        )}
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 60 : 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  itemWrapper: {
    marginBottom: 12,
    position: "relative",
  },
  deleteButton: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 120,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    borderRadius: 12,
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    zIndex: 2,
  },
  itemInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 12,
  },
  itemName: {
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 16,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    marginTop: 16,
  },
  bottomSection: {
    borderTopWidth: 1,
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  totalRow: {
    marginBottom: 16,
  },
  checkoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
});
