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

interface Product {
  id: string;
  name: string;
  type: "water" | "ice";
  price: number;
  image: string;
  inStock: boolean;
  rating: any;
}

const PAGE_SIZE = 12;

// Dummy data generator
const generateDummyProducts = (page: number): Product[] => {
  const products: Product[] = [];
  const types: Array<"water" | "ice"> = ["water", "ice"];
  const waterImages: string[] = [
    "https://images.unsplash.com/photo-1585518419759-43cdff41de30?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1589985391892-4b1471b6fdf9?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1599599810694-b5ac4dd64e90?w=300&h=300&fit=crop",
  ];
  const iceImages: string[] = [
    "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1623509328625-6cd22b4c0267?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=300&h=300&fit=crop",
  ];

  for (let i = 0; i < PAGE_SIZE; i++) {
    const idx = (page - 1) * PAGE_SIZE + i;
    const typeIdx = idx % 2;
    const type = types[typeIdx];
    const images = type === "water" ? waterImages : iceImages;

    products.push({
      id: `product-${idx}`,
      name: `Premium ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      type: type,
      price: Math.floor(Math.random() * 200) + 50,
      image: images[idx % images.length],
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
  const [originalProducts, setOriginalProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const slideAnim = useState(new Animated.Value(500))[0];

  const fetchProducts = useCallback(
    async (pageNum: number, isInitial: boolean = false) => {
      if (loading && !isInitial) return;

      if (isInitial) {
        setInitialLoading(true);
      } else {
        setLoading(true);
      }

      await new Promise((resolve) => setTimeout(resolve, 600));

      try {
        const newProducts = generateDummyProducts(pageNum);

        if (pageNum >= 5) {
          setHasMore(false);
        }

        if (isInitial) {
          setProducts(newProducts);
          setOriginalProducts(newProducts);
        } else {
          const combined = [...products, ...newProducts];
          setProducts(combined);
          setOriginalProducts(combined);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        if (isInitial) {
          setInitialLoading(false);
        } else {
          setLoading(false);
        }
      }
    },
    [loading, products]
  );

  useEffect(() => {
    fetchProducts(1, true);
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchProducts(page, false);
    }
  }, [page]);

  const loadMore = () => {
    if (!loading && !initialLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

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
    }).start(() => {
      setShowFilterModal(false);
    });
  };

  const sortAscending = () => {
    const sorted = [...products].sort((a, b) => a.price - b.price);
    setProducts(sorted);
    closeFilterModal();
  };

  const sortDescending = () => {
    const sorted = [...products].sort((a, b) => b.price - a.price);
    setProducts(sorted);
    closeFilterModal();
  };

  const ProductCard = ({ item }: { item: Product }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          styles.productCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.productImage}
            resizeMode="cover"
          />
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
            <View
              style={{
                flexDirection: "row",
                gap: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
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

          <TouchableOpacity
            style={[
              styles.outOfStockButton,
              { borderColor: colors.textSecondary },
            ]}
            disabled
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
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (initialLoading) {
    return (
      <ThemedView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loaderContainer}>
          <View
            style={[styles.loaderBackground, { backgroundColor: colors.card }]}
          >
            <ActivityIndicator size={50} color={colors.tint} />
          </View>
        </View>
      </ThemedView>
    );
  }

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
        >
          <Ionicons name="cart" size={28} color={colors.tint} />
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

      {/* Filter Scroll */}
      <View style={styles.filterContainer}>
        {/* Search and Filter */}
        <View style={styles.searchContainer}>
          <View
            style={[
              styles.searchBar,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Ionicons name="search" size={24} color={colors.textSecondary} />
            <ThemedText
              style={[
                styles.searchPlaceholder,
                {
                  color: colors.textSecondary,
                  marginLeft: 8,
                  fontFamily: "poppinsMedium",
                },
              ]}
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
            <Ionicons name="options-outline" size={20} color={colors.tint} />
          </TouchableOpacity>
        </View>
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
              <View
                style={[
                  styles.footerLoaderBackground,
                  { backgroundColor: colors.background },
                ]}
              >
                <ActivityIndicator size="large" color={colors.tint} />
              </View>
            </View>
          ) : null
        }
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
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
                <Ionicons name="close" size={24} color={colors.text} />
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
                  onPress={sortAscending}
                >
                  <Ionicons
                    name="chevron-up"
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
                  LOW TO HIGH
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

              {/* HIGH TO LOW */}

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
                  onPress={sortDescending}
                >
                  <Ionicons
                    name="chevron-down"
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
                  HIGH TO LOW
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
            </View>
          </Animated.View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 70,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderBackground: {
    width: 140,
    height: 140,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 52,
    fontWeight: "600",
    lineHeight: 52,
  },
  cartButton: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
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
    borderColor: "#FFF",
  },
  filterContainer: {
    marginBottom: 14,
    height: 60,
  },
  searchContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    height: 60,
    borderRadius: 28,
    borderWidth: 1,
  },
  searchPlaceholder: {
    fontSize: 18,
  },
  filterButton: {
    width: 60,
    height: 60,
    borderRadius: 26,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  columnWrapper: {
    gap: 12,
    marginBottom: 12,
  },
  productCard: {
    flex: 1,
    borderRadius: 28,
    borderWidth: 1,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 130,
    backgroundColor: "#F3F4F6",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productContent: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
  },
  outOfStockButton: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    opacity: 0.6,
  },
  footerLoader: {
    justifyContent: "center",
    alignItems: "center",
  },
  footerLoaderBackground: {
    width: 50,
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  filterPopup: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    minHeight: 250,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  popupHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 24,
    gap: '18%',
  },
  popupTitle: {
    fontSize: 24,
    textAlign: "center",
  },
  popupContent: {
    gap: 12,
  },
  confirmContainer: {
    width: "100%",
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
});
