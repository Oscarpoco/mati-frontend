import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import { BlurView } from "expo-blur";
import { ThemedView } from "@/components/themed-view";

interface BiometricLockScreenProps {
  onSuccess: () => void;
  biometricType: string;
  theme: any;
}

export default function BiometricLockScreen({
  onSuccess,
  biometricType,
  theme,
}: BiometricLockScreenProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(1)).current;


  const MAX_ATTEMPTS = 5;

  useEffect(() => {
    triggerBiometric();
  }, []);

  // 🔹 ADVANCED PULSE ANIMATION
  useEffect(() => {
    if (isAuthenticating) {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1.15,
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    } else {
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isAuthenticating, pulseAnim]);

  // 🔹 SUCCESS ANIMATION
  useEffect(() => {
    if (isSuccess) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(onSuccess, 300);
      });
    }
  }, [isSuccess, fadeAnim, onSuccess, scaleAnim]);

  // 🔹 TRIGGER BIOMETRIC AUTHENTICATION
  const triggerBiometric = async () => {
    if (attempts >= MAX_ATTEMPTS) {
      setErrorMessage("Too many attempts. Please try again later.");
      return;
    }

    setIsAuthenticating(true);
    setErrorMessage("");

    try {
      const result = await LocalAuthentication.authenticateAsync({
        disableDeviceFallback: false,
        promptMessage: `Unlock with your Passcode`,
      });

      if (result.success) {
        setIsAuthenticating(false);
        setIsSuccess(true);
      } else if (result.error === "user_cancel") {
        setIsAuthenticating(false);
      } else {
        setAttempts(attempts + 1);
        setIsAuthenticating(false);
        setErrorMessage("Authentication failed. Please try again.");
      }
    } catch (error) {
      console.error("Biometric error:", error);
      setIsAuthenticating(false);
      setErrorMessage("Authentication error. Please try again.");
      setAttempts(attempts + 1);
    }
  };

  // 🔹 HANDLE RETRY
  const handleRetry = () => {
    if (!isAuthenticating) {
      triggerBiometric();
    }
  };

  // 🔹 GET BIOMETRIC ICON
  const getBiometricIcon = () => {
    return biometricType === "face" ? "face-recognition" : "finger-print";
  };

  const progressPercentage = (attempts / MAX_ATTEMPTS) * 100;

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            Verify Your Identity
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Use your {biometricType} to continue securely
          </Text>
        </View>

        {/* BIOMETRIC ICON - ANIMATED CIRCLE */}
        <Animated.View
          style={[
            styles.iconWrapper,
            {
              transform: [{ scale: isAuthenticating ? pulseAnim : 1 }],
            },
          ]}
        >
          <View
            style={[
              styles.outerRing,
              {
                borderColor: isAuthenticating
                  ? theme.tint + "40"
                  : "transparent",
              },
            ]}
          />
          <View
            style={[
              styles.iconContainer,
              {
                borderColor: isAuthenticating
                  ? theme.tint
                  : theme.textSecondary + "30",
                backgroundColor: isAuthenticating
                  ? theme.tint + "10"
                  : theme.card,
                shadowColor: isAuthenticating ? theme.tint : "transparent",
              },
            ]}
          >
            {isAuthenticating ? (
              <ActivityIndicator size="large" color={theme.tint} />
            ) : errorMessage ? (
              <Ionicons
                name="alert-circle"
                size={70}
                color={theme.error || "#ff6b6b"}
              />
            ) : isSuccess ? (
              <Ionicons name="checkmark-circle" size={70} color={theme.tint} />
            ) : (
              <Ionicons
                name={getBiometricIcon() as any}
                size={70}
                color={theme.tint}
              />
            )}
          </View>
        </Animated.View>

        {/* ERROR MESSAGE - MODERN STYLE */}
        {errorMessage && (
          <View style={styles.errorBox}>
            <BlurView intensity={90} style={styles.errorBlur}>
              <View
                style={[
                  styles.errorContent,
                  { backgroundColor: (theme.error || "#ff6b6b") + "15" },
                ]}
              >
                <Text
                  style={[
                    styles.errorText,
                    { color: theme.error || "#ff6b6b" },
                  ]}
                >
                  {errorMessage}
                </Text>
              </View>
            </BlurView>
          </View>
        )}

        {/* PROGRESS INDICATOR */}
        {attempts > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progressPercentage}%`,
                    backgroundColor:
                      progressPercentage > 60
                        ? theme.error || "#ff6b6b"
                        : theme.tint,
                  },
                ]}
              />
            </View>
            <Text style={[styles.attemptsText, { color: theme.textSecondary }]}>
              {attempts} of {MAX_ATTEMPTS} attempts
            </Text>
          </View>
        )}

        {/* INTERACTIVE BUTTONS */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              {
                backgroundColor: theme.tint,
                opacity: isAuthenticating || attempts >= MAX_ATTEMPTS ? 0.5 : 1,
              },
            ]}
            onPress={handleRetry}
            disabled={isAuthenticating || attempts >= MAX_ATTEMPTS}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>
              {isAuthenticating ? "AUNTHENTICATING..." : "RETRY"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* INFO TEXT */}
        <Text style={[styles.infoText, { color: theme.textSecondary }]}>
          {isAuthenticating
            ? `Place your ${biometricType} on the sensor`
            : "Tap retry to authenticate again"}
        </Text>
      </Animated.View>

      {/* SUCCESS OVERLAY */}
      {isSuccess && (
        <Animated.View
          style={[
            styles.successOverlay,
            {
              transform: [{ scale: scaleAnim }],
              backgroundColor: theme.tint + "20",
            },
          ]}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 28,
    width: "100%",
  },
  header: {
    marginBottom: 60,
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontFamily: 'poppinsMedium',
    marginBottom: 10,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'poppinsMedium',
    lineHeight: 20,
    textAlign: "center",
  },
  iconWrapper: {
    marginBottom: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  outerRing: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
  },
  iconContainer: {
    width: 130,
    height: 130,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2.5,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  errorBox: {
    width: "100%",
    marginBottom: 28,
    borderRadius: 16,
    overflow: "hidden",
  },
  errorBlur: {
    padding: 0,
  },
  errorContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
  },
  errorIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'poppinsMedium',
    lineHeight: 20,
    textAlign: "center",
  },
  progressContainer: {
    width: "100%",
    marginBottom: 32,
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    backgroundColor: "#00000010",
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  attemptsText: {
    fontSize: 12,
    fontFamily: 'poppinsMedium',
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 32,
  },
  primaryButton: {
    flexDirection: "row",
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: 'poppinsMedium',
    letterSpacing: -0.3,
  },
  infoText: {
    fontSize: 13,
    fontFamily: 'poppinsMedium',
    textAlign: "center",
    lineHeight: 18,
  },
  successOverlay: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    opacity: 0.2,
  },
});
