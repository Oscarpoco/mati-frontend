import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
  FlatList,
} from "react-native";
import axios from "axios";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Fonts } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";

interface News {
  title: string;
  description: string;
  urlToImage?: string;
  publishedAt: string;
  source: { name: string };
  url: string;
}

const NEWS_API_KEY = process.env.EXPO_PUBLIC_NEWS_API;
const PAGE_SIZE = 10;

export default function NewsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const [news, setNews] = useState<News[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchNews = useCallback(
    async (pageNum: number, isInitial: boolean = false) => {
      if (loading && !isInitial) return;

      if (isInitial) {
        setInitialLoading(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await axios.get(
          `https://newsapi.org/v2/everything?q=(water%20OR%20outage%20OR%20supply)%20AND%20South%20Africa&sortBy=publishedAt&language=en&pageSize=${PAGE_SIZE}&page=${pageNum}&apiKey=${NEWS_API_KEY}`
        );

        const articles = response.data.articles || [];
        if (articles.length < PAGE_SIZE) setHasMore(false);

        if (isInitial) {
          setNews(articles);
        } else {
          setNews((prev) => [...prev, ...articles]);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        if (isInitial) {
          setInitialLoading(false);
        } else {
          setLoading(false);
        }
      }
    },
    [loading]
  );

  useEffect(() => {
    fetchNews(1, true);
  }, [fetchNews]);

  useEffect(() => {
    if (page > 1) {
      fetchNews(page, false);
    }
  }, [page]);

  const loadMore = () => {
    if (!loading && !initialLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const NewsCard = ({ item, index }: { item: News; index: number }) => {
    const isExpanded = expandedId === `${item.url}-${index}`;
    const cardKey = `${item.url}-${index}`;

    return (
      <TouchableOpacity
        onPress={() =>
          setExpandedId(isExpanded ? null : cardKey)
        }
        activeOpacity={0.7}
        style={[
          styles.newsCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {item.urlToImage && (
          <Image
            source={{ uri: item.urlToImage }}
            style={styles.newsImage}
            resizeMode="cover"
          />
        )}

        <View style={styles.cardContent}>
          <View style={styles.metaRow}>
            <ThemedText
              style={{
                fontSize: 11,
                fontWeight: "600",
                color: colors.textSecondary,
                textTransform: "uppercase",
              }}
            >
              {new Date(item.publishedAt).toLocaleDateString("en-ZA", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 10,
                color: colors.textSecondary,
              }}
            >
              {item.source?.name}
            </ThemedText>
          </View>

          <ThemedText
            style={[
              styles.newsTitle,
              { color: colors.text, fontFamily: Fonts.sans },
            ]}
          >
            {item.title}
          </ThemedText>

          <ThemedText
            style={[
              styles.newsText,
              { color: colors.textSecondary },
            ]}
            numberOfLines={isExpanded ? 0 : 3}
          >
            {item.description || "No summary available."}
          </ThemedText>

          <TouchableOpacity
            onPress={() => setExpandedId(isExpanded ? null : cardKey)}
            style={[
              styles.moreButton,
              { backgroundColor: colors.tint + "20" },
            ]}
          >
            <ThemedText
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: colors.tint,
                textTransform: "uppercase",
              }}
            >
              {isExpanded ? "Show Less" : "Read More"}
            </ThemedText>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={16}
              color={colors.tint}
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (initialLoading) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loaderContainer}>
          <View style={[styles.loaderBackground, { backgroundColor: colors.card }]}>
            <ActivityIndicator size={50} color={colors.tint} />
            <ThemedText style={styles.loaderText}>Loading News...</ThemedText>
          </View>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header]}>
        <ThemedText style={[styles.title, { fontFamily: Fonts.sans }]}>
          Water
        </ThemedText>
        <ThemedText style={[styles.title, { fontFamily: Fonts.sans }]}>
          News Updates
        </ThemedText>
      </View>

      <FlatList
        data={news}
        keyExtractor={(item, index) => `${item.url}-${index}`}
        renderItem={({ item, index }) => <NewsCard item={item} index={index} />}
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
    borderRadius: 38,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  loaderText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: "600",
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 42,
    fontWeight: "600",
    lineHeight: 48,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  newsCard: {
    borderRadius: 38,
    borderWidth: 1,
    marginBottom: 12,
    overflow: "hidden",
  },
  newsImage: {
    width: "100%",
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  newsText: {
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 18,
  },
  moreButton: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: "flex-start",
    alignItems: "center",
  },
  footerLoader: {
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});