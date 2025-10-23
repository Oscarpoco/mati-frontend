import React, { useState, useRef } from 'react';
import {
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const { width: screenWidth } = Dimensions.get('window');

interface OnboardingData {
  id: number;
  title: string;
  description: string;
  lottieSource: any;
  icon: keyof typeof Ionicons.glyphMap;
}

const onboardingData: OnboardingData[] = [
  {
    id: 1,
    title: 'Welcome to Mati',
    description: 'Join thousands of communities getting water delivered to their door while supporting local providers and reducing unemployment.',
    lottieSource: require('@/assets/animations/welcome.json'),
    icon: 'water',
  },
  {
    id: 2,
    title: 'Quick QR Scanning',
    description: 'Simply scan QR codes when your delivery arrives to ensure safety and confirm receipt.',
    lottieSource: require('@/assets/animations/qr-scan.json'),
    icon: 'scan',
  },
  {
    id: 3,
    title: 'Smart Matching',
    description: 'Our intelligent system matches you with the nearest water providers for faster, more efficient deliveries.',
    lottieSource: require('@/assets/animations/ai.json'),
    icon: 'flash',
  },
  {
    id: 4,
    title: 'Stay Connected',
    description: 'Receive real-time notifications about offers, delivery status, and updates from your favorite providers.',
    lottieSource: require('@/assets/animations/notifications.json'),
    icon: 'notifications',
  },
  {
    id: 5,
    title: 'Easy Requests',
    description: 'Request water deliveries from nearby providers with just a few taps. Set quantity and location with ease.',
    lottieSource: require('@/assets/animations/success.json'),
    icon: 'checkmark-circle',
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const animationRefs = useRef<(LottieView | null)[]>([]);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * screenWidth,
        animated: true,
      });
      setTimeout(() => {
        animationRefs.current[nextIndex]?.play();
      }, 300);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      scrollViewRef.current?.scrollTo({
        x: prevIndex * screenWidth,
        animated: true,
      });
      setTimeout(() => {
        animationRefs.current[prevIndex]?.play();
      }, 300);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    if (index !== currentIndex) {
      setCurrentIndex(index);
      animationRefs.current[index]?.play();
    }
  };

  const AnimationComponent = ({
    item,
    index,
  }: {
    item: OnboardingData;
    index: number;
  }) => {
    const [animationError, setAnimationError] = useState(false);

    if (animationError) {
      return (
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: colors.tint + '20',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 40,
          }}
        >
          <Ionicons name={item.icon} size={60} color={colors.tint} />
        </View>
      );
    }

    return (
      <View style={{ marginBottom: 40, height: 200 }}>
        <LottieView
          ref={(ref) => {
            animationRefs.current[index] = ref;
          }}
          source={item.lottieSource}
          style={{ width: '100%', height: '100%' }}
          autoPlay={index === 0}
          loop={true}
          speed={0.8}
          onAnimationFailure={() => setAnimationError(true)}
        />
      </View>
    );
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Skip Button */}
      {currentIndex < onboardingData.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <ThemedText style={[styles.skipText, { color: colors.textSecondary }]}>
            Skip
          </ThemedText>
        </TouchableOpacity>
      )}

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View
          style={[styles.progressBarBackground, { backgroundColor: colors.card }]}
        >
          <View
            style={[
              styles.progressBar,
              {
                width: `${((currentIndex + 1) / onboardingData.length) * 100}%`,
                backgroundColor: colors.tint,
              },
            ]}
          />
        </View>
      </View>

      {/* Onboarding Content */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
        decelerationRate="fast"
      >
        {onboardingData.map((item, index) => (
          <View key={item.id} style={[styles.slide, { width: screenWidth }]}>
            <View style={styles.contentContainer}>
              {/* Animation/Icon */}
              <AnimationComponent item={item} index={index} />

              {/* Step Indicator */}
              <ThemedText
                style={[
                  styles.stepText,
                  { color: colors.textSecondary, opacity: 0.7 },
                ]}
              >
                Step {index + 1} of {onboardingData.length}
              </ThemedText>

              {/* Title */}
              <ThemedText style={[styles.title, { color: colors.text }]}>
                {item.title}
              </ThemedText>

              {/* Description */}
              <ThemedText
                style={[
                  styles.description,
                  { color: colors.textSecondary, lineHeight: 24 },
                ]}
              >
                {item.description}
              </ThemedText>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        {/* Page Indicators */}
        <View style={styles.indicatorContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                {
                  backgroundColor:
                    index === currentIndex ? colors.tint : colors.card,
                  width: index === currentIndex ? 24 : 8,
                  opacity: index === currentIndex ? 1 : 0.4,
                },
              ]}
            />
          ))}
        </View>

        {/* Button Container */}
        <View style={styles.buttonContainer}>
          {/* Back Button (hidden on first slide) */}
          {currentIndex > 0 && (
            <TouchableOpacity
              style={[
                styles.backButton,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                },
              ]}
              onPress={handleBack}
            >
              <Ionicons name="chevron-back" size={24} color={colors.text} />
            </TouchableOpacity>
          )}

          {/* Next/Get Started Button */}
          <View
            style={[
              styles.confirmContainer,
              { backgroundColor: colors.tint + '10' },
            ]}
          >
            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: colors.tint }]}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Ionicons
                name="chevron-forward"
                size={28}
                color={colors.background}
              />
            </TouchableOpacity>
            <ThemedText style={styles.confirmText}>
              {currentIndex === onboardingData.length - 1 ? 'START' : 'NEXT'}
            </ThemedText>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}
            >
              <Ionicons
                name="chevron-forward"
                size={12}
                color={colors.textSecondary}
              />
              <Ionicons
                name="chevron-forward"
                size={12}
                color={colors.textSecondary}
              />
              <Ionicons
                name="chevron-forward"
                size={12}
                color={colors.textSecondary}
              />
            </View>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = {
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    justifyContent: 'space-between',
  } as any,

  skipButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  } as any,

  skipText: {
    fontSize: 14,
    fontWeight: '600',
  } as any,

  progressBarContainer: {
    height: 4,
    marginBottom: 32,
    borderRadius: 2,
  } as any,

  progressBarBackground: {
    height: '100%',
    borderRadius: 2,
    overflow: 'hidden',
  } as any,

  progressBar: {
    height: '100%',
    borderRadius: 2,
  } as any,

  slide: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  } as any,

  contentContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  } as any,

  stepText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 16,
    letterSpacing: 0.5,
  } as any,

  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 40,
  } as any,

  description: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  } as any,

  bottomContainer: {
    gap: 20,
  } as any,

  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  } as any,

  indicator: {
    height: 8,
    borderRadius: 4,
  } as any,

  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
  } as any,

  backButton: {
    width: 60,
    height: 60,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as any,

  confirmContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 32,
    flexDirection: 'row',
    padding: 4,
    paddingRight: 20,
    height: 60,
  } as any,

  confirmButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  } as any,

  confirmText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 1.2,
    opacity: 0.7,
  } as any,
};