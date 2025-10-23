import React from 'react';
import { View } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function SplashScreen() {
  const colors = Colors.dark;

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.backgroundDot,
          {
            backgroundColor: colors.tint,
            top: '10%',
            right: '-10%',
          },
        ]}
      />
      <View
        style={[
          styles.backgroundDot,
          {
            backgroundColor: colors.tint,
            bottom: '15%',
            left: '-8%',
            width: 80,
            height: 80,
          },
        ]}
      />

      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <View
          style={[styles.iconCircle, { backgroundColor: colors.tint + '20' }]}
        >
          <Ionicons name="water" size={80} color={colors.tint} />
        </View>
        <ThemedText style={[styles.appName, { color: colors.text }]}>
          MATI
        </ThemedText>
      </View>

      {/* Loader Animation */}
      <View style={styles.loaderContainer}>
        <LottieView
          source={require('@/assets/animations/Loader.json')}
          autoPlay
          loop
          speed={1}
          style={styles.loader}
        />
      </View>

      {/* Tagline */}
      <View style={styles.taglineContainer}>
        <ThemedText
          style={[styles.tagline, { color: colors.textSecondary }]}
        >
          Water Delivery Made Simple
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  } as any,

  backgroundDot: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.1,
  } as any,

  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  } as any,

  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  } as any,

  appName: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1,
    lineHeight: 50,
  } as any,

  loaderContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
  } as any,

  loader: {
    width: '100%',
    height: '100%',
  } as any,

  taglineContainer: {
    position: 'absolute',
    bottom: 60,
  } as any,

  tagline: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  } as any,
};