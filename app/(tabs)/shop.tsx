import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
  FlatList,
  Modal,
  Animated,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { CartModal, CartItem  } from "@/components/CartModal";

interface Product {
  id: string;
  name: string;
  type: "water" | "ice";
  price: number;
  image: any;
  inStock: boolean;
  rating: string;
}

const PAGE_SIZE = 12;

// 🧊 Generate dummy products (randomized images + price)
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
      name: `Premium ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      type,
      price: Math.floor(Math.random() * 200) + 50,
      image: randomImage,
      inStock: false,
      rating: (Math.random() * 2 + 3).toFixed(1),
    });
  }

  return products;
};

export default function WaterSalesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [cartVisible, setCartVisible] = useState(false);
const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const slideAnim = useState(new Animated.Value(500))[0];

  // 🔹 Fetch mock products
  const fetchProducts = useCallback(
    async (pageNum: number, isInitial: boolean = false) => {
      if (loading && !isInitial) return;
      isInitial ? setInitialLoading(true) : setLoading(true);

      await new Promise((r) => setTimeout(r, 600)); // simulate delay

      const newProducts = generateDummyProducts(pageNum);
      if (pageNum >= 5) setHasMore(false);

      setProducts((prev) => (isInitial ? newProducts : [...prev, ...newProducts]));
      isInitial ? setInitialLoading(false) : setLoading(false);
    },
    [loading]
  );

  useEffect(() => {
    fetchProducts(1, true);
  }, []);

  useEffect(() => {
    if (page > 1) fetchProducts(page);
  }, [page]);

  const loadMore = () => {
    if (!loading && !initialLoading && hasMore) setPage((prev) => prev + 1);
  };

  // 🔹 Modal controls
  const openFilterModal = () => {
    setShowFilterModal(true);
    Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: false }).start();
  };

  const closeFilterModal = () => {
    Animated.timing(slideAnim, { toValue: 500, duration: 300, useNativeDriver: false }).start(() =>
      setShowFilterModal(false)
    );
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
  const ProductCard = ({ item }: { item: Product }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.productCard, { backgroundColor: colors.background, borderColor: colors.border }]}
    >
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.productImage} resizeMode="stretch" />

        {/* 🔸 Type Badge */}
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>{item.type.toUpperCase()}</ThemedText>
        </View>
      </View>

      <View style={styles.productContent}>
        <ThemedText
          style={[styles.productName, { color: colors.text, fontFamily: "poppinsMedium" }]}
          numberOfLines={2}
        >
          {item.name}
        </ThemedText>

        <View style={styles.ratingRow}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <ThemedText
              style={{ fontSize: 12, color: colors.textSecondary, marginLeft: 4, fontFamily: "poppinsLight" }}
            >
              {item.rating}
            </ThemedText>
          </View>

          <ThemedText style={[styles.price, { color: colors.text, fontFamily: "poppinsMedium" }]}>
            R{item.price.toFixed(2)}
          </ThemedText>
        </View>

        <TouchableOpacity
          style={[styles.outOfStockButton, { borderColor: colors.textSecondary }]}
          disabled
        >
          <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
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
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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

        <TouchableOpacity
          style={[styles.cartButton, { backgroundColor: "transparent" }]}
          onPress={() => setCartVisible(true)}
        >
          <Ionicons
            name="cart-outline"
            size={28}
            color={colors.textSecondary}
          />
          <View style={[styles.cartBadge, { backgroundColor: "transparent" }]}>
            <ThemedText
              style={{
                fontSize: 14,
                color: "white",
                fontFamily: "poppinsExtraLight",
              }}
            >
              0
            </ThemedText>
          </View>
        </TouchableOpacity>
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
              <TouchableOpacity
                onPress={closeFilterModal}
                style={{
                  width: 45,
                  height: 45,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 18,
                  backgroundColor: colors.tint,
                }}
              >
                <Ionicons name="chevron-back" size={24} color={colors.background} />
              </TouchableOpacity>
              <ThemedText
                style={[
                  styles.popupTitle,
                  { color: colors.text, fontFamily: "poppinsBold" },
                ]}
              >
                Sort by Price
              </ThemedText>
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
                  style={{ fontFamily: "poppinsMedium", color: colors.text }}
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
                  style={{ fontFamily: "poppinsMedium", color: colors.text }}
                >
                  HIGH TO LOW
                </ThemedText>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* CART */}
      <CartModal
        visible={cartVisible}
        onClose={() => setCartVisible(false)}
        items={cartItems}
        onUpdateQuantity={(id, qty) => {
          /* update logic */
        }}
        onRemoveItem={(id) => {
          /* remove logic */
        }}
        onCheckout={() => {
          /* checkout logic */
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
    top: -6,
    right: -6,
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
  productContent: { padding: 10 },
  productName: { fontSize: 14, marginBottom: 8 },
  ratingRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  price: { fontSize: 16 },
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
    padding: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  popupHeader: { flexDirection: "row", alignItems: "center", gap: 20, marginBottom: 20 },
  popupTitle: { fontSize: 22 },
  popupContent: { gap: 14 },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 20,
  },
});
