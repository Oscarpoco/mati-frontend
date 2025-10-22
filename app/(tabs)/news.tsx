import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function NewsScreen() {
  // GET CURRENT COLOR SCHEME
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* NEWS SCREEN PLACEHOLDER */}
      <ThemedText style={styles.title}>News</ThemedText>
      <ThemedText style={styles.subtitle}>Latest updates and announcements</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
});