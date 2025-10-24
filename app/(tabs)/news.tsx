import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';


interface News {
  id: string;
  title: string;
  excerpt: string;
  fullContent: string;
  image: string;
  province: string;
  date: string;
  category: string;
}

const mockNews: News[] = [
  {
    id: '1',
    title: 'Water Supply Disruption in Cape Town',
    excerpt: 'Scheduled maintenance will affect water distribution in the southern suburbs this week...',
    fullContent: 'Scheduled maintenance will affect water distribution in the southern suburbs this week. The City of Cape Town has announced that water supply will be interrupted on Monday and Tuesday from 06:00 to 18:00. Residents are urged to store sufficient water for their daily needs. The maintenance is part of the infrastructure upgrade project aimed at improving water delivery efficiency and reducing leakage in the system. For more information, contact the city helpline.',
    image: 'https://images.unsplash.com/photo-1508108712903-a75bba0f4b5b?w=500&h=300&fit=crop',
    province: 'Western Cape',
    date: 'Oct 23, 2025',
    category: 'Maintenance'
  },
  {
    id: '2',
    title: 'Durban Water Crisis Update',
    excerpt: 'New water conservation measures announced by eThekwini Municipality to address the ongoing shortage...',
    fullContent: 'The eThekwini Municipality has announced new water conservation measures to address the ongoing shortage affecting the greater Durban area. Residents are asked to reduce consumption by 30% as drought conditions persist. The municipality is implementing stage 4 load shedding on water distribution. Emergency water tankers have been deployed to critical areas including hospitals and schools. Citizens can report water leaks via the municipality app or helpline.',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&h=300&fit=crop',
    province: 'KwaZulu-Natal',
    date: 'Oct 22, 2025',
    category: 'Alert'
  },
  {
    id: '3',
    title: 'Johannesburg Water Quality Report',
    excerpt: 'Latest water quality tests show improvement in supply across northern areas...',
    fullContent: 'Latest water quality tests conducted by Johannesburg Water show significant improvement in supply across northern areas of the city. The test results indicate that 99.2% of the water supply meets international standards. New filtration systems installed in Sandton and Midrand have contributed to this improvement. The city continues to monitor water quality 24/7 to ensure safety for all residents and businesses.',
    image: 'https://images.unsplash.com/photo-1423666639041-f56000c27a7a?w=500&h=300&fit=crop',
    province: 'Gauteng',
    date: 'Oct 21, 2025',
    category: 'Update'
  },
  {
    id: '4',
    title: 'Port Elizabeth Water Infrastructure Project',
    excerpt: 'R50 million investment in new water treatment facilities begins next month...',
    fullContent: 'The Nelson Mandela Bay Municipality has secured R50 million in funding for a new water treatment facility project. Construction will begin next month in Port Elizabeth with an expected completion date of June 2026. The new facility will increase water production capacity by 25% and serve an additional 100,000 residents. This project is part of the broader infrastructure development initiative to meet the growing water demands in the region.',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=300&fit=crop',
    province: 'Eastern Cape',
    date: 'Oct 20, 2025',
    category: 'Project'
  },
  {
    id: '5',
    title: 'Pretoria Water Pipeline Burst Alert',
    excerpt: 'Major pipeline burst affecting water supply in central areas - repairs underway...',
    fullContent: 'A major pipeline burst was detected early this morning in central Pretoria, affecting water supply to approximately 150,000 residents. Tshwane Water and Sanitation is working around the clock to repair the 500mm main line. Alternative water distribution points have been set up in affected areas. Residents should expect low water pressure until repairs are completed, expected by tomorrow evening. Boil water notices have been issued for affected zones.',
    image: 'https://images.unsplash.com/photo-1584622181473-2b69b4323c85?w=500&h=300&fit=crop',
    province: 'Gauteng',
    date: 'Oct 19, 2025',
    category: 'Emergency'
  },
  {
    id: '6',
    title: 'Bloemfontein Water Conservation Success',
    excerpt: 'Community efforts reduce water consumption by 22% in Q3...',
    fullContent: 'Bloemfontein residents have successfully reduced water consumption by 22% in the third quarter through community conservation efforts. The city\'s awareness campaign promoting water-saving practices has been highly effective. Local schools and businesses have also implemented grey water recycling systems. The municipality plans to expand these initiatives with more incentives for households that maintain low consumption rates throughout 2026.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=300&fit=crop',
    province: 'Free State',
    date: 'Oct 18, 2025',
    category: 'Success'
  },
];

export default function NewsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNews = mockNews.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.province.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Alert':
        return colors.warningRed;
      case 'Emergency':
        return '#FF4444';
      case 'Maintenance':
        return colors.tint;
      case 'Update':
        return colors.successGreen;
      case 'Project':
        return '#9C27B0';
      default:
        return colors.tint;
    }
  };

  const NewsCard = ({ news }: { news: News }) => {
    const isExpanded = expandedId === news.id;

    return (
      <TouchableOpacity
        onPress={() => setExpandedId(isExpanded ? null : news.id)}
        style={[
          styles.newsCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        activeOpacity={0.7}
      >
        {/* Image Section */}
        <View
          style={[styles.imageContainer, { backgroundColor: colors.border }]}
        >
          <Image
            source={{ uri: news.image }}
            style={styles.newsImage}
            resizeMode="cover"
          />
          {/* Category Badge */}
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: getCategoryColor(news.category) },
            ]}
          >
            <ThemedText
              style={{
                fontSize: 10,
                fontWeight: '700',
                color: '#FFFFFF',
                textTransform: 'uppercase',
              }}
            >
              {news.category}
            </ThemedText>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.cardContent}>
          {/* Province and Date */}
          <View style={styles.metaRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons
                name="location"
                size={14}
                color={colors.textSecondary}
              />
              <ThemedText
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color: colors.textSecondary,
                  textTransform: 'uppercase',
                }}
              >
                {news.province}
              </ThemedText>
            </View>
            <ThemedText
              style={{
                fontSize: 10,
                fontWeight: '500',
                color: colors.textSecondary,
              }}
            >
              {news.date}
            </ThemedText>
          </View>

          {/* Title */}
          <ThemedText
            style={[
              styles.newsTitle,
              { color: colors.text, fontFamily: Fonts.sans },
            ]}
          >
            {news.title}
          </ThemedText>

          {/* Excerpt or Full Content */}
          <ThemedText
            style={[
              styles.newsText,
              { color: colors.textSecondary },
            ]}
            numberOfLines={isExpanded ? 0 : 2}
          >
            {isExpanded ? news.fullContent : news.excerpt}
          </ThemedText>

          {/* More Button or Collapse Indicator */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              onPress={() => setExpandedId(isExpanded ? null : news.id)}
              style={[
                styles.moreButton,
                { backgroundColor: colors.tint + '20' },
              ]}
            >
              <ThemedText
                style={{
                  fontSize: 12,
                  fontWeight: '700',
                  color: colors.tint,
                  textTransform: 'uppercase',
                }}
              >
                {isExpanded ? 'Show Less' : 'Read More'}
              </ThemedText>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={colors.tint}
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={[styles.title, { fontFamily: Fonts.sans }]}>
          News
        </ThemedText>
        <ThemedText style={[styles.title, { fontFamily: Fonts.sans }]}>
          Updates
        </ThemedText>
      </View>

      {/* Search Bar */}
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
              { color: colors.textSecondary, marginLeft: 8 },
            ]}
          >
            Search news or province
          </ThemedText>
        </View>
      </View>

      {/* News List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
      >
        {filteredNews.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 70,
  },

  header: {
    marginBottom: 16,
  },

  title: {
    fontSize: 48,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 60,
  },

  searchContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    alignItems: 'center',
  },

  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    height: 60,
    borderRadius: 28,
    borderWidth: 1,
  },

  searchPlaceholder: {
    fontSize: 16,
    fontWeight: '400',
  },

  scrollContent: {
    paddingBottom: 100,
  },

  newsCard: {
    borderRadius: 28,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },

  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },

  newsImage: {
    width: '100%',
    height: '100%',
  },

  categoryBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },

  cardContent: {
    padding: 16,
  },

  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  newsTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
    lineHeight: 22,
  },

  newsText: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    marginBottom: 12,
  },

  footerRow: {
    flexDirection: 'row',
  },

  moreButton: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});