import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Animated,
} from "react-native";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface OnboardingData {
  id: number;
  title: string;
  description: string;
  lottieSource: any;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const onboardingData: OnboardingData[] = [
  {
    id: 1,
    title: "Welcome to Mati",
    description:
      "Join thousands of communities getting water delivered to their door while supporting local providers.",
    lottieSource: require("@/assets/animations/welcome.json"),
    icon: "water",
    color: "#007AFF",
  },
  {
    id: 2,
    title: "Quick QR Scanning",
    description:
      "Simply scan QR codes when your delivery arrives to ensure safety and confirm receipt instantly.",
    lottieSource: require("@/assets/animations/qr-scan.json"),
    icon: "scan",
    color: "#34C759",
  },
  {
    id: 3,
    title: "Smart Matching",
    description:
      "Our intelligent system matches you with the nearest water providers for faster deliveries.",
    lottieSource: require("@/assets/animations/ai.json"),
    icon: "flash",
    color: "#AF52DE",
  },
  {
    id: 4,
    title: "Stay Connected",
    description:
      "Receive real-time notifications about offers, delivery status, and updates from providers.",
    lottieSource: require("@/assets/animations/notifications.json"),
    icon: "notifications",
    color: "#FF9500",
  },
  {
    id: 5,
    title: "Easy Requests",
    description:
      "Request water deliveries from nearby providers with just a few taps. Simple and fast.",
    lottieSource: require("@/assets/animations/success.json"),
    icon: "checkmark-circle",
    color: "#32D74B",
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({
  onComplete,
}: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const animationRefs = useRef<(LottieView | null)[]>([]);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: currentIndex,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [currentIndex, slideAnim]);

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
            width: 140,
            height: 140,
            borderRadius: 70,
            backgroundColor: item.color,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 40,
            shadowColor: item.color,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <Ionicons name={item.icon} size={70} color={item.color} />
        </View>
      );
    }

    return (
      <View
        style={{
          marginBottom: 40,
          height: 220,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LottieView
          ref={(ref) => {
            animationRefs.current[index] = ref;
          }}
          source={item.lottieSource}
          style={{
            width: 200,
            height: 200,
          }}
          autoPlay={index === 0}
          loop={true}
          speed={1}
          onAnimationFailure={() => setAnimationError(true)}
        />
      </View>
    );
  };

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Skip Button */}
      {currentIndex < onboardingData.length - 1 && (
        <TouchableOpacity
          style={[styles.skipButton, { backgroundColor: colors.tint }]}
          onPress={handleSkip}
        >
          <ThemedText style={[styles.skipText, { color: colors.text }]}>
            PRESS HERE TO SKIP THE ONBOARDING
          </ThemedText>
        </TouchableOpacity>
      )}

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBarBackground,
            { backgroundColor: colors.card },
          ]}
        >
          <Animated.View
            style={[
              styles.progressBar,
              {
                backgroundColor: colors.tint,
                width: slideAnim.interpolate({
                  inputRange: [0, onboardingData.length - 1],
                  outputRange: ["0%", "100%"],
                }),
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
          <View
            key={item.id}
            style={[
              styles.slide,
              { width: screenWidth, justifyContent: "center" },
            ]}
          >
            <View
              style={[
                styles.contentContainer,
                {
                  minHeight: screenHeight * 0.5,
                  justifyContent: "center",
                },
              ]}
            >
              {/* Animation/Icon */}
              <AnimationComponent item={item} index={index} />

              {/* Step Indicator */}
              <ThemedText
                style={[
                  styles.stepText,
                  {
                    color: colors.textSecondary,
                    opacity: 0.6,
                  },
                ]}
              >
                Step {index + 1} of {onboardingData.length}
              </ThemedText>

              {/* Title */}
              <ThemedText
                style={[
                  styles.title,
                  { color: colors.text },
                ]}
              >
                {item.title}
              </ThemedText>

              {/* Description */}
              <ThemedText
                style={[
                  styles.description,
                  {
                    color: colors.textSecondary,
                    lineHeight: 24,
                  },
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
            <Animated.View
              key={index}
              style={[
                styles.indicator,
                {
                  backgroundColor:
                    index === currentIndex ? colors.tint : colors.card,
                  width: index === currentIndex ? 28 : 8,
                  opacity: index === currentIndex ? 1 : 0.3,
                },
              ]}
            />
          ))}
        </View>

        {/* Button Container */}
        <View style={[styles.buttonContainer, { width: "100%" }]}>
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
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color={colors.text} />
            </TouchableOpacity>
          )}

          {/* Next/Get Started Button */}
          <View
            style={[
              styles.confirmContainer,
              {
                backgroundColor: colors.button,
                // flex: currentIndex > 0 ? 1 : undefined,
                width: currentIndex > 0 ? "80%" : "100%",
              },
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
              {currentIndex === onboardingData.length - 1 ? "START" : "NEXT"}
            </ThemedText>
            <View
              style={{
                alignItems: "center",
                backgroundColor: "transparent",
                flexDirection: "row",
                gap: 2,
              }}
            >
              <Ionicons
                name="chevron-forward"
                size={12}
                color={colors.textSecondary}
                style={{ opacity: 0.6 }}
              />
              <Ionicons
                name="chevron-forward"
                size={12}
                color={colors.textSecondary}
                style={{ opacity: 0.4 }}
              />
              <Ionicons
                name="chevron-forward"
                size={12}
                color={colors.textSecondary}
                style={{ opacity: 0.2 }}
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
    paddingHorizontal: 0,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: "space-between",
  } as any,

  skipButton: {
    width: "100%",
    paddingVertical: 6,
    marginBottom: 8,
  } as any,

  skipText: {
    fontSize: 16,
    fontFamily: "poppinsBold",
    textAlign: "center",
  } as any,

  progressBarContainer: {
    height: 5,
    marginBottom: 24,
    overflow: "hidden",
  } as any,

  progressBarBackground: {
    height: "100%",
    overflow: "hidden",
  } as any,

  progressBar: {
    height: "100%",
  } as any,

  slide: {
    paddingHorizontal: 24,
    alignItems: "center",
  } as any,

  contentContainer: {
    alignItems: "center",
    width: "100%",
  } as any,

  stepText: {
    fontSize: 11,
    fontFamily: "poppinsMedium",
    textTransform: "uppercase",
    marginBottom: 16,
    letterSpacing: 1,
  } as any,

  title: {
    fontSize: 32,
    fontFamily: "poppinsBlack",
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: -0.5,
    lineHeight: 40,
  } as any,

  description: {
    fontSize: 16,
    fontFamily: "poppinsLight",
    textAlign: "center",
    maxWidth: "95%",
  } as any,

  bottomContainer: {
    paddingHorizontal: 24,
    gap: 20,
  } as any,

  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  } as any,

  indicator: {
    height: 8,
    borderRadius: 4,
  } as any,

  buttonContainer: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
  } as any,

  backButton: {
    width: 60,
    height: 60,
    borderRadius: 34,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  } as any,

  confirmContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 32,
    flexDirection: "row",
    padding: 4,
    paddingRight: 20,
    height: 60,
  } as any,

  confirmButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  } as any,

  confirmText: {
    fontSize: 18,
    fontFamily: "poppinsBold",
    textAlign: "center",
    letterSpacing: 1.2,
    opacity: 0.7,
  } as any,
};
