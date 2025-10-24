import React, { useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";

interface TimelineStep {
  label: string;
  icon: any;
  status: "completed" | "in-progress" | "pending";
}

interface TimelineTrackerProps {
  steps?: TimelineStep[];
  currentStep?: number;
}

export function TimelineTracker({
  steps = [
    { label: "Picked", icon: "checkmark-circle", status: "completed" },
    { label: "Delivery", icon: "car", status: "in-progress" },
    { label: "Delivered", icon: "home", status: "pending" },
  ],
  currentStep = 1,
}: TimelineTrackerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];

  // Create pulse animations for each step
  const pulseAnimations = steps.map(() => new Animated.Value(0));

  useEffect(() => {
    // Start pulse animation for current step
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimations[currentStep], {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnimations[currentStep], {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [currentStep]);

  const getStepColor = (status: string) => {
    switch (status) {
      case "completed":
        return colors.successGreen;
      case "in-progress":
        return colors.tint;
      case "pending":
        return colors.textSecondary;
      default:
        return colors.textSecondary;
    }
  };

  const getStepBorderColor = (status: string) => {
    switch (status) {
      case "completed":
        return colors.successGreen;
      case "in-progress":
        return colors.tint;
      case "pending":
        return colors.text;
      default:
        return colors.border;
    }
  };

  const getIconColor = (status: string) => {
    switch (status) {
      case "completed":
        return colors.background;
      case "in-progress":
        return colors.tint + "60";
      case "pending":
        return colors.tint + "30";
      default:
        return colors.textSecondary;
    }
  };

  return (
    <View style={styles.timelineContainer}>
      {/* Horizontal Timeline */}
      <View style={styles.horizontalTimeline}>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step Node */}
            <View style={styles.stepWrapper}>
              <View style={styles.stepNodeContainer}>
                {/* Pulse Ring */}
                {index === currentStep && (
                  <Animated.View
                    style={[
                      styles.pulseRing,
                      {
                        opacity: pulseAnimations[index],
                        transform: [
                          {
                            scale: pulseAnimations[index].interpolate({
                              inputRange: [0, 1],
                              outputRange: [1, 1.8],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.pulseRingInner,
                        { borderColor: getStepColor(step.status) },
                      ]}
                    />
                  </Animated.View>
                )}

                {/* Circle with Icon */}
                <View
                  style={[
                    styles.timelineCircle,
                    {
                      backgroundColor: getStepColor(step.status),
                      borderColor: getStepBorderColor(step.status),
                      borderWidth: step.status === "completed" ? 0 : 2,
                      shadowColor: getStepColor(step.status),
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: step.status === "in-progress" ? 0.3 : 0,
                      shadowRadius: 4,
                      elevation: step.status === "in-progress" ? 5 : 0,
                    },
                  ]}
                >
                  {step.status === "completed" ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={14}
                      color={colors.background}
                      style={{ fontWeight: "900" }}
                    />
                  ) : (
                    <Ionicons
                      name={step.icon}
                      size={14}
                      color={getIconColor(step.status)}
                    />
                  )}
                </View>

                {/* Label Below */}
                <ThemedText
                  style={[
                    styles.stepLabel,
                    {
                      color:
                        step.status === "completed"
                          ? colors.successGreen
                          : step.status === "in-progress"
                          ? colors.tint
                          : colors.textSecondary,
                      fontWeight:
                        step.status === "in-progress" ? "700" : "600",
                    },
                  ]}
                >
                  {step.label}
                </ThemedText>
              </View>
            </View>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timelineContainer: {
    marginBottom: 16,
    paddingVertical: 8,
  },

  horizontalTimeline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 0,
    marginHorizontal: -30,
  },

  stepWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  stepNodeContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minWidth: 50,
    position: "relative",
  },

  timelineCircle: {
    width: 25,
    height: 25,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 20,
  },

  pulseRing: {
    position: "absolute",
    width: 25,
    height: 25,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    top: 0
  },

  pulseRingInner: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    borderWidth: 2,
  },

  stepLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.2,
    textAlign: "center",
  },
});