import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Colors, Fonts } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';


export default function SplashScreen() {
  const colors = Colors.dark;
  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeInAnim, scaleAnim, slideUpAnim]);

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Animated Background Blobs */}
      <Animated.View
        style={[
          styles.backgroundDot,
          {
            backgroundColor: colors.tint,
            top: '10%',
            right: '10%',
            opacity: fadeInAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.1],
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.backgroundDot,
          {
            backgroundColor: colors.tint,
            bottom: '25%',
            left: '8%',
            width: 80,
            height: 80,
            opacity: fadeInAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.08],
            }),
          },
        ]}
      />

      {/* Loader Animation */}
      <Animated.View
        style={[
          styles.loaderContainer,
          {
            opacity: fadeInAnim,
            transform: [
              {
                translateY: slideUpAnim,
              },
            ],
          },
        ]}
      >
        <LottieView
          source={require('@/assets/animations/Loader.json')}
          autoPlay
          loop
          speed={1}
          style={styles.loader}
        />
      </Animated.View>

      {/* Tagline with Fade Effect */}
      <Animated.View
        style={[
          styles.taglineContainer,
          {
            opacity: fadeInAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0, 1],
            }),
          },
        ]}
      >
        <ThemedText
          style={[styles.tagline, { color: colors.textSecondary }]}
        >
          Water Delivery Made Simple
        </ThemedText>
        
        {/* Animated Loading Dots */}
        <View style={styles.dotsContainer}>
          {[0, 1, 2].map((index) => (
            <Animated.View
              key={index}
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: colors.tint,
                marginHorizontal: 4,
                opacity: fadeInAnim.interpolate({
                  inputRange: [0, 0.3, 0.6, 1],
                  outputRange: [0.3, 0.3, 1, 0.3],
                  extrapolate: 'clamp',
                }),
              }}
            />
          ))}
        </View>
      </Animated.View>
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
  } as any,

  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  } as any,

  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  } as any,

  appName: {
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1.2,
    lineHeight: 52,
  } as any,

  loaderContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  } as any,

  loader: {
    width: '100%',
    height: '100%',
  } as any,

  taglineContainer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
  } as any,

  tagline: {
    fontSize: 18,
    fontWeight: '400',
    letterSpacing: 0.5,
    textTransform: 'capitalize',
    marginBottom: 16,
    textAlign: 'center',
  } as any,

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  } as any,
};