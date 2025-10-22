import {
  Platform,
  View,
  Animated,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useRef } from "react";

import { AuthStyles as styles } from "@/components/styledComponents/AuthStyle";

interface ResetPasswordScreenProps {
  onNavigateToLogin: () => void;
}

export function ResetPasswordScreen({
  onNavigateToLogin,
}: ResetPasswordScreenProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const loadingAnim = useRef(new Animated.Value(0)).current;

  const handleResetPassword = () => {
    if (isLoading) return;
    setIsLoading(true);

    Animated.timing(loadingAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start(() => {
      setIsLoading(false);
      loadingAnim.setValue(0);
      setIsSuccess(true);
    });
  };

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between",
          }}
        >
          {/* HEADER */}
          <View>
            <View style={{ height: 80 }}>
              <TouchableOpacity onPress={onNavigateToLogin} style={{width: 40, height: 40, justifyContent: "center", alignItems: "center" , borderRadius: 24, backgroundColor: colors.tint }}>
                <Ionicons name="arrow-back" size={28} color={colors.background} />
              </TouchableOpacity>
            </View>

            {/* TITLE SECTION */}
            <View style={{ marginBottom: 40 }}>
              <ThemedText style={styles.title}>Reset Password</ThemedText>
              <ThemedText
                style={[styles.subtitle, { color: colors.textSecondary }]}
              >
                Enter your email and we will send you a link to reset your
                password
              </ThemedText>
            </View>

            {!isSuccess ? (
              <>
                {/* EMAIL INPUT */}
                <View style={styles.inputWrapper}>
                  <ThemedText style={[styles.label, { color: colors.text }]}>
                    Email Address
                  </ThemedText>
                  <View
                    style={[
                      styles.inputField,
                      {
                        borderColor: colors.border,
                        backgroundColor: colors.card,
                      },
                    ]}
                  >
                    <View
                      style={{
                        width: 52,
                        height: 52,
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 5,
                        backgroundColor: colors.tint,
                        borderRadius: 12,
                      }}
                    >
                      <Ionicons
                        name="mail"
                        size={22}
                        color={colors.background}
                      />
                    </View>
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      placeholder="Enter your email"
                      placeholderTextColor={colors.textSecondary}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      editable={!isLoading}
                    />
                  </View>
                </View>
              </>
            ) : (
              <>
                {/* SUCCESS STATE */}
                <View style={{ alignItems: "center", marginVertical: 60 }}>
                  <View
                    style={[
                      styles.successIcon,
                      { backgroundColor: colors.tint + "20" },
                    ]}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={80}
                      color={colors.tint}
                    />
                  </View>
                  <ThemedText
                    style={[
                      styles.successTitle,
                      { color: colors.tint, marginTop: 20 },
                    ]}
                  >
                    Email Sent!
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.successSubtitle,
                      { color: colors.textSecondary, marginTop: 12 },
                    ]}
                  >
                    Check your inbox for reset instructions
                  </ThemedText>
                </View>
              </>
            )}
          </View>

          {/* BOTTOM SECTION */}
          <View>
            {!isSuccess ? (
              <>
                {/* SEND LINK BUTTON */}
                <View
                  style={[
                    styles.confirmContainer,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <TouchableOpacity
                    onPress={handleResetPassword}
                    disabled={isLoading}
                    style={[
                      styles.confirmButton,
                      { backgroundColor: colors.tint },
                    ]}
                  >
                    <Ionicons
                      name="chevron-forward"
                      size={32}
                      color={colors.background}
                    />
                  </TouchableOpacity>
                  <ThemedText style={styles.confirmText}>SEND LINK</ThemedText>
                  <View
                    style={{
                      alignItems: "center",
                      backgroundColor: colors.background,
                      flexDirection: "row",
                    }}
                  >
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={colors.textSecondary}
                    />
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={colors.textSecondary}
                    />
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={colors.textSecondary}
                    />
                  </View>
                </View>
              </>
            ) : (
              <>
                {/* BACK TO LOGIN */}
                <View
                  style={[
                    styles.confirmContainer,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <TouchableOpacity
                    onPress={onNavigateToLogin}
                    style={[
                      styles.confirmButton,
                      { backgroundColor: colors.tint },
                    ]}
                  >
                    <Ionicons
                      name="chevron-forward"
                      size={32}
                      color={colors.background}
                    />
                  </TouchableOpacity>
                  <ThemedText style={styles.confirmText}>
                    BACK TO LOGIN
                  </ThemedText>
                  <View
                    style={{
                      alignItems: "center",
                      backgroundColor: colors.background,
                      flexDirection: "row",
                    }}
                  >
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={colors.textSecondary}
                    />
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={colors.textSecondary}
                    />
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={colors.textSecondary}
                    />
                  </View>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
