import { CartItem, CartModal } from "@/components/CartModal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  FlatList,
  Image,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface Product {
  id: string;
  name: string;
  type: "water" | "ice";
  price: number;
  image: any;
  inStock: boolean;
  rating: string;
}

interface CartItemWithDetails extends CartItem {
  product: Product;
  quantity: number;
}

const PAGE_SIZE = 12;

// 🧊 Generate dummy products with realistic stock status
const generateDummyProducts = (page: number): Product[] => {
  const products: Product[] = [];
  const types: Array<"water" | "ice"> = ["water", "ice"];

  const waterImages = [
    require("@/assets/thumbnails/water-2.jpeg"),
    require("@/assets/thumbnails/water-3.jpeg"),
    require("@/assets/thumbnails/water-4.jpeg"),
  ];

  const iceImages = [
    require("@/assets/thumbnails/ice-1.jpeg"),
    require("@/assets/thumbnails/ice-2.jpeg"),
    require("@/assets/thumbnails/ice-3.jpeg"),
  ];

  for (let i = 0; i < PAGE_SIZE; i++) {
    const idx = (page - 1) * PAGE_SIZE + i;
    const type = types[idx % 2];
    const images = type === "water" ? waterImages : iceImages;
    const randomImage = images[Math.floor(Math.random() * images.length)];

    products.push({
      id: `product-${idx}`,
      name: `Premium ${type.charAt(0).toUpperCase() + type.slice(1)} - ${idx}`,
      type,
      price: Math.floor(Math.random() * 200) + 50,
      image: randomImage,
      inStock: Math.random() > 0.3, // 70% chance of being in stock
      rating: (Math.random() * 2 + 3).toFixed(1),
    });
  }

  return products;
};

export default function WaterSalesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];

  // Product management
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  // UI state
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [cartVisible, setCartVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(500))[0];

  // Animation refs
  const cartButtonScale = useRef(new Animated.Value(1)).current;
  const cartBadgeScale = useRef(new Animated.Value(1)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslateY = useRef(new Animated.Value(-100)).current;
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cart management
  const [cartItems, setCartItems] = useState<Map<string, CartItemWithDetails>>(
    new Map()
  );

  // 🔹 Fetch mock products
  const fetchProducts = useCallback(
    async (pageNum: number, isInitial: boolean = false) => {
      if (loading && !isInitial) return;
      isInitial ? setInitialLoading(true) : setLoading(true);

      // await new Promise((r) => setTimeout(r, 600)); // simulate delay

      const newProducts = generateDummyProducts(pageNum);
      if (pageNum >= 5) setHasMore(false);

      setProducts((prev) =>
        isInitial ? newProducts : [...prev, ...newProducts]
      );
      isInitial ? setInitialLoading(false) : setLoading(false);
    },
    [loading]
  );

  // Initial load
  useEffect(() => {
    fetchProducts(1, true);
  }, [fetchProducts]);

  // Cleanup toast timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // Load more on page change
  useEffect(() => {
    if (page > 1) {
      fetchProducts(page);
    }
  }, [page, fetchProducts]);

  const loadMore = () => {
    if (!loading && !initialLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  // 🔹 Show toast notification
  const showToastNotification = useCallback((message: string) => {
    // Clear any existing timer
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    setToastMessage(message);
    setShowToast(true);

    // Reset animations
    toastTranslateY.setValue(-100);
    toastOpacity.setValue(0);

    Animated.parallel([
      Animated.spring(toastTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();

    // Auto hide after 2 seconds
    toastTimerRef.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastTranslateY, {
          toValue: -100,
          duration: 250,
          useNativeDriver: true,
          easing: Easing.in(Easing.ease),
        }),
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowToast(false);
        toastTimerRef.current = null;
      });
    }, 2000);
  }, []);

  // 🔹 Animate cart button
  const animateCartButton = useCallback(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(cartButtonScale, {
          toValue: 1.2,
          useNativeDriver: true,
          tension: 300,
          friction: 3,
        }),
        Animated.spring(cartBadgeScale, {
          toValue: 1.5,
          useNativeDriver: true,
          tension: 300,
          friction: 3,
        }),
      ]),
      Animated.parallel([
        Animated.spring(cartButtonScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 300,
          friction: 3,
        }),
        Animated.spring(cartBadgeScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 300,
          friction: 3,
        }),
      ]),
    ]).start();
  }, []);

  // 🔹 Cart functions
  const addToCart = useCallback(
    (product: Product) => {
      if (!product.inStock) {
        Alert.alert("Out of Stock", `${product.name} is currently out of stock.`);
        return;
      }

      setCartItems((prev) => {
        const updated = new Map(prev);
        const existingItem = updated.get(product.id);

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          updated.set(product.id, {
            id: product.id,
            product,
            quantity: 1,
            name: product.name,
            price: product.price,
            type: product.type,
          });
        }

        return updated;
      });

      // Animate cart button and show toast
      animateCartButton();
      showToastNotification(`${product.name} added to cart!`);
    },
    [animateCartButton, showToastNotification]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prev) => {
      const updated = new Map(prev);
      updated.delete(productId);
      return updated;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) => {
      const updated = new Map(prev);
      const item = updated.get(productId);
      if (item) {
        item.quantity = quantity;
      }
      return updated;
    });
  }, [removeFromCart]);

  // Memoized cart calculations with proper Map size check
  const cartStats = useMemo(() => {
    let totalItems = 0;
    let totalPrice = 0;

    if (cartItems && cartItems.size > 0) {
      cartItems.forEach((item) => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
      });
    }

    return { totalItems, totalPrice };
  }, [cartItems]);

  // 🔹 Modal controls
  const openFilterModal = () => {
    setShowFilterModal(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeFilterModal = () => {
    Animated.timing(slideAnim, {
      toValue: 500,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setShowFilterModal(false));
  };

  // 🔹 Sorting functions
  const sortAscending = () => {
    setProducts((prev) => [...prev].sort((a, b) => a.price - b.price));
    closeFilterModal();
  };

  const sortDescending = () => {
    setProducts((prev) => [...prev].sort((a, b) => b.price - a.price));
    closeFilterModal();
  };

  // 🔹 Product card component
  const ProductCard = ({ item }: { item: Product }) => {
    const isInCart = cartItems.has(item.id);
    const cartQuantity = cartItems.get(item.id)?.quantity ?? 0;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          styles.productCard,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.imageContainer}>
          <Image
            source={item.image}
            style={styles.productImage}
            resizeMode="stretch"
          />

          {/* Type Badge */}
          <View style={styles.badge}>
            <ThemedText style={styles.badgeText}>
              {item.type.toUpperCase()}
            </ThemedText>
          </View>

          {/* Stock Badge */}
          {!item.inStock && (
            <View
              style={[
                styles.stockBadge,
                { backgroundColor: "rgba(255, 0, 0, 0.7)" },
              ]}
            >
              <ThemedText
                style={{
                  fontSize: 10,
                  fontWeight: "700",
                  color: "white",
                  fontFamily: "poppinsMedium",
                }}
              >
                OUT OF STOCK
              </ThemedText>
            </View>
          )}
        </View>

        <View style={styles.productContent}>
          <ThemedText
            style={[
              styles.productName,
              { color: colors.text, fontFamily: "poppinsMedium" },
            ]}
            numberOfLines={2}
          >
            {item.name}
          </ThemedText>

          <View style={styles.ratingRow}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <ThemedText
                style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                  marginLeft: 4,
                  fontFamily: "poppinsLight",
                }}
              >
                {item.rating}
              </ThemedText>
            </View>

            <ThemedText
              style={[
                styles.price,
                { color: colors.text, fontFamily: "poppinsMedium" },
              ]}
            >
              R{item.price.toFixed(2)}
            </ThemedText>
          </View>

          {/* Action Button - Conditional based on stock */}
          {item.inStock ? (
            <TouchableOpacity
              style={[
                styles.addToCartButton,
                {
                  backgroundColor: colors.tint,
                  borderColor: colors.tint,
                },
              ]}
              onPress={() => addToCart(item)}
            >
              <Ionicons name="add-circle" size={16} color="white" />
              <ThemedText
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: "white",
                  marginLeft: 6,
                  fontFamily: "poppinsMedium",
                }}
              >
                {isInCart ? `IN CART (${cartQuantity})` : "ADD TO CART"}
              </ThemedText>
            </TouchableOpacity>
          ) : (
            <View
              style={[
                styles.outOfStockButton,
                { borderColor: colors.textSecondary },
              ]}
            >
              <Ionicons
                name="close-circle"
                size={16}
                color={colors.textSecondary}
              />
              <ThemedText
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: colors.textSecondary,
                  marginLeft: 6,
                  fontFamily: "poppinsMedium",
                }}
              >
                OUT OF STOCK
              </ThemedText>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // 🔹 Loader screen
  if (initialLoading) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loaderContainer}>
          <View style={[styles.loaderBackground, { backgroundColor: colors.card }]}>
            <ActivityIndicator size={50} color={colors.tint} />
          </View>
        </View>
      </ThemedView>
    );
  }

  // 🔹 Main UI
  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <ThemedText style={[styles.title, { fontFamily: "poppinsLight" }]}>
            Water
          </ThemedText>
          <ThemedText
            style={[styles.title, { fontFamily: "poppinsLight", fontSize: 42 }]}
          >
            Marketplace
          </ThemedText>
        </View>

        <Animated.View
          style={{
            transform: [{ scale: cartButtonScale }],
          }}
        >
          <TouchableOpacity
            style={[styles.cartButton, { backgroundColor: "transparent" }]}
            onPress={() => setCartVisible(true)}
          >
            <Ionicons
              name="cart-outline"
              size={28}
              color={colors.textSecondary}
            />
            {cartStats.totalItems > 0 && (
              <Animated.View
                style={[
                  styles.cartBadge,
                  {
                    backgroundColor: colors.tint,
                    transform: [{ scale: cartBadgeScale }],
                  },
                ]}
              >
                <ThemedText
                  style={{
                    fontSize: 12,
                    color: "white",
                    fontFamily: "poppinsExtraLight",
                  }}
                >
                  {cartStats.totalItems}
                </ThemedText>
              </Animated.View>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Search + Filter */}
      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchBar,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={22}
            color={colors.textSecondary}
          />
          <ThemedText
            style={{
              color: colors.textSecondary,
              marginLeft: 8,
              fontFamily: "poppinsMedium",
              fontSize: 16,
            }}
          >
            Search
          </ThemedText>
        </View>

        <TouchableOpacity
          onPress={openFilterModal}
          style={[
            styles.filterButton,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons
            name="swap-vertical-outline"
            size={22}
            color={colors.tint}
          />
        </TouchableOpacity>
      </View>

      {/* Products Grid */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard item={item} />}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="large" color={colors.tint} />
            </View>
          ) : null
        }
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="none"
        onRequestClose={closeFilterModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={closeFilterModal}
          />
          <Animated.View
            style={[
              styles.filterPopup,
              {
                backgroundColor: colors.background,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.popupHeader}>
              <ThemedText
                style={[
                  styles.popupTitle,
                  { color: colors.text, fontFamily: "poppinsBold" },
                ]}
              >
                Sort by Price
              </ThemedText>
              <TouchableOpacity
                onPress={closeFilterModal}
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

            <View style={styles.popupContent}>
              {/* LOW TO HIGH */}
              <TouchableOpacity
                style={[styles.sortButton, { backgroundColor: colors.card }]}
                onPress={sortAscending}
              >
                <Ionicons
                  name="chevron-up-outline"
                  size={28}
                  color={colors.tint}
                />
                <ThemedText
                  style={{
                    fontFamily: "poppinsMedium",
                    color: colors.text,
                  }}
                >
                  LOW TO HIGH
                </ThemedText>
              </TouchableOpacity>

              {/* HIGH TO LOW */}
              <TouchableOpacity
                style={[styles.sortButton, { backgroundColor: colors.card }]}
                onPress={sortDescending}
              >
                <Ionicons
                  name="chevron-down-outline"
                  size={28}
                  color={colors.tint}
                />
                <ThemedText
                  style={{
                    fontFamily: "poppinsMedium",
                    color: colors.text,
                  }}
                >
                  HIGH TO LOW
                </ThemedText>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Toast Notification */}
      {showToast && (
        <Animated.View
          style={[
            styles.toastContainer,
            {
              opacity: toastOpacity,
              transform: [{ translateY: toastTranslateY }],
            },
          ]}
        >
          <View
            style={[
              styles.toast,
              {
                backgroundColor: colors.card,
                borderColor: colors.tint,
              },
            ]}
          >
            <View
              style={[
                styles.toastIconContainer,
                { backgroundColor: `${colors.tint}20` },
              ]}
            >
              <Ionicons name="checkmark-circle" size={24} color={colors.tint} />
            </View>
            <ThemedText
              style={[
                styles.toastText,
                { color: colors.text, fontFamily: "poppinsMedium" },
              ]}
              numberOfLines={2}
            >
              {toastMessage}
            </ThemedText>
          </View>
        </Animated.View>
      )}

      {/* CART MODAL */}
      <CartModal
        visible={cartVisible}
        onClose={() => setCartVisible(false)}
        items={Array.from(cartItems.values()).map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          type: item.type,
        }))}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={() => {
          Alert.alert(
            "Order Placed",
            `Total: R${cartStats.totalPrice.toFixed(2)}\n${cartStats.totalItems} items`,
            [
              {
                text: "Continue Shopping",
                onPress: () => {
                  setCartVisible(false);
                  setCartItems(new Map());
                },
              },
            ]
          );
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 70,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  titleSection: { flex: 1 },
  title: { fontSize: 52, fontWeight: "600", lineHeight: 52 },
  cartButton: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 54,
    borderRadius: 24,
    borderWidth: 1,
  },
  filterButton: {
    width: 54,
    height: 54,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: { paddingBottom: 100 },
  columnWrapper: { gap: 12, marginBottom: 12 },
  productCard: {
    flex: 1,
    borderRadius: 0,
    borderWidth: 1,
    overflow: "hidden",
    elevation: 2,
  },
  imageContainer: { position: "relative", width: "100%", height: 150 },
  productImage: { width: "100%", height: "100%" },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 0,
  },
  badgeText: { fontSize: 10, fontFamily: "poppinsMedium" },
  stockBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 0,
  },
  productContent: { padding: 10 },
  productName: { fontSize: 12, marginBottom: 8 },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  price: { fontSize: 16 },
  addToCartButton: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 0,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  outOfStockButton: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 0,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    opacity: 0.6,
  },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loaderBackground: {
    width: 140,
    height: 140,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  footerLoader: { justifyContent: "center", alignItems: "center", padding: 20 },
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalBackground: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" },
  filterPopup: {
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  popupHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  popupTitle: { fontSize: 22 },
  popupContent: { gap: 14 },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 20,
  },
  toastContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 100 : 90,
    left: 16,
    right: 16,
    zIndex: 1000,
    alignItems: "center",
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    minHeight: 56,
    maxWidth: "100%",
  },
  toastIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  toastText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});