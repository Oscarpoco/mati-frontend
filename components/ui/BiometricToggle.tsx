import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Animated,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { Colors } from "@/constants/theme";

interface BiometricToggleProps {
  theme?: any;
  onStateChange?: (isEnabled: boolean) => void;
  showLabel?: boolean;
}

export default function BiometricToggle({
  theme = Colors.dark,
  onStateChange,
  showLabel = true,
}: BiometricToggleProps) {
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>("fingerprint");

  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  // 🔹 INITIALIZE BIOMETRIC STATUS
  useEffect(() => {
    const initializeBiometric = async () => {
      try {
        // Check biometric availability
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();

        if (compatible && enrolled) {
          setIsBiometricAvailable(true);

          // Determine biometric type
          const types =
            await LocalAuthentication.supportedAuthenticationTypesAsync();
          if (
            types.includes(
              LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
            )
          ) {
            setBiometricType("face");
          } else if (
            types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
          ) {
            setBiometricType("fingerprint");
          }
        } else {
          setIsBiometricAvailable(false);
        }

        // Load saved biometric preference
        const saved = await AsyncStorage.getItem("biometricEnabled");
        const isEnabled = saved === "true";
        setIsBiometricEnabled(isEnabled);

        // Animate to current position
        Animated.timing(slideAnim, {
          toValue: isEnabled ? 1 : 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      } catch (error) {
        console.error("Error initializing biometric:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeBiometric();
  }, []);

  // 🔹 HANDLE TOGGLE
  const handleToggle = async () => {
    if (!isBiometricAvailable) {
      Alert.alert(
        "Biometric Not Available",
        "Your device does not have biometric authentication configured."
      );
      return;
    }

    setIsLoading(true);

    try {
      if (isBiometricEnabled) {
        // Disable biometric - no auth required
        await AsyncStorage.setItem("biometricEnabled", "false");
        setIsBiometricEnabled(false);
        onStateChange?.(false);

        // Animate toggle off
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 0.8,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      } else {
        // Enable biometric - require authentication
        const result = await LocalAuthentication.authenticateAsync({
          disableDeviceFallback: false,
          promptMessage: `Verify your ${biometricType} to enable biometric lock`,
        });

        if (result.success) {
          await AsyncStorage.setItem("biometricEnabled", "true");
          setIsBiometricEnabled(true);
          onStateChange?.(true);

          // Animate toggle on
          Animated.parallel([
            Animated.timing(slideAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: false,
            }),
            Animated.sequence([
              Animated.timing(scaleAnim, {
                toValue: 0.8,
                duration: 150,
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
              }),
            ]),
          ]).start();
        }
      }
    } catch (error) {
      console.error("Error toggling biometric:", error);
      Alert.alert("Error", "Failed to update biometric settings");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { opacity: 0.6 }]}>
        <ActivityIndicator color={theme.tint} />
      </View>
    );
  }

  if (!isBiometricAvailable) {
    return null;
  }

  const togglePosition = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 28],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text
            style={[
              styles.labelText,
              { color: isBiometricEnabled ? theme.tint : theme.textSecondary },
            ]}
          >
            Biometrics
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.toggleButton,
          {
            backgroundColor: theme.card,
            borderColor: isBiometricEnabled
              ? theme.tint
              : theme.textSecondary + "30",
          },
        ]}
        onPress={handleToggle}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.toggleTrack,
            {
              backgroundColor: isBiometricEnabled
                ? theme.tint + "15"
                : "transparent",
            },
          ]}
        />

        <Animated.View
          style={[
            styles.toggleSlider,
            {
              left: togglePosition,
              backgroundColor: isBiometricEnabled
                ? theme.tint
                : theme.textSecondary,
            },
          ]}
        >
          <Ionicons
            name={isBiometricEnabled ? "checkmark" : "close"}
            size={14}
            color="#fff"
            style={styles.toggleIcon}
          />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 15
  },
  toggleButton: {
    width: 60,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleTrack: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 17,
  },
  toggleSlider: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  toggleIcon: {
    fontWeight: "bold",
  },
  labelContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  labelText: {
    fontSize: 24,
    fontWeight: "600",
    textTransform: 'uppercase',
    textAlign: 'left'
  }
});
