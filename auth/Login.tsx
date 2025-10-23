import {
  Platform,
  View,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  KeyboardAvoidingView,
  ScrollView,
  Animated,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Fonts } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useRef } from "react";

// React Navigation imports
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "./authWrapper";

import { AuthStyles as styles } from "@/components/styledComponents/AuthStyle";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"
>;

export function LoginScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const loadingAnim = useRef(new Animated.Value(0)).current;

  const handleLogin = () => {
    if (isLoading) return;
    setIsLoading(true);

    Animated.timing(loadingAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start(() => {
      setIsLoading(false);
      loadingAnim.setValue(0);
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
            <View style={{ height: 120 }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <View
                  style={[styles.iconCircle, { backgroundColor: colors.tint }]}
                >
                  <Ionicons name="water" size={32} color={colors.background} />
                </View>
                <ThemedText style={[styles.logo, { fontFamily: Fonts.sans }]}>
                  Mati
                </ThemedText>
              </View>
            </View>

            {/* TITLE SECTION */}
            <View style={{ marginBottom: 40 }}>
              <ThemedText style={styles.title}>Welcome Back</ThemedText>
              <ThemedText
                style={[styles.subtitle, { color: colors.textSecondary }]}
              >
                Sign in to continue to your account
              </ThemedText>
            </View>

            {/* EMAIL INPUT */}
            <View style={styles.inputWrapper}>
              <ThemedText style={[styles.label, { color: colors.text }]}>
                Email
              </ThemedText>
              <View
                style={[
                  styles.inputField,
                  { borderColor: colors.border, backgroundColor: colors.card },
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
                    borderRadius: 20,
                  }}
                >
                  <Ionicons name="mail" size={22} color={colors.background} />
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

            {/* PASSWORD INPUT */}
            <View style={styles.inputWrapper}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <ThemedText style={[styles.label, { color: colors.text }]}>
                  Password
                </ThemedText>
                <TouchableOpacity onPress={() => navigation.navigate("ResetPassword")}>
                  <ThemedText
                    style={[styles.forgotLink, { color: colors.tint }]}
                  >
                    Forgot Password?
                  </ThemedText>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.inputField,
                  { borderColor: colors.border, backgroundColor: colors.card },
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
                    borderRadius: 20,
                  }}
                >
                  <Ionicons name="lock-closed" size={22} color={colors.background} />
                </View>
                <TextInput
                  style={[styles.input, { color: colors.text, flex: 1 }]}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye" : "eye-off"}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* BOTTOM SECTION */}
          <View>
            {/* LOGIN BUTTON */}
            <View
              style={[
                styles.confirmContainer,
                { backgroundColor: colors.tint + "10" },
              ]}
            >
              <TouchableOpacity
                onPress={handleLogin}
                disabled={isLoading}
                style={[styles.confirmButton, { backgroundColor: colors.tint }]}
              >
                <Ionicons
                  name="chevron-forward"
                  size={32}
                  color={colors.background}
                />
              </TouchableOpacity>
              <ThemedText style={styles.confirmText}>LOGIN</ThemedText>
              <View
                style={{
                  alignItems: "center",
                  backgroundColor: 'transparent',
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

            {/* DIVIDER */}
            <View style={[styles.divider, { borderTopColor: colors.border }]}>
              <ThemedText
                style={{
                  color: colors.textSecondary,
                  fontSize: 12,
                  position: "absolute",
                  left: "45%",
                  backgroundColor: colors.background,
                  paddingHorizontal: 10,
                }}
              >
                OR
              </ThemedText>
            </View>

            {/* GOOGLE LOGIN */}
            <TouchableOpacity
              style={[
                styles.socialButton,
                { borderColor: colors.border, backgroundColor: colors.card },
              ]}
            >
              <Ionicons name="logo-google" size={24} color={colors.tint} />
              <ThemedText
                style={{ fontSize: 16, fontWeight: "600", marginLeft: 10 }}
              >
                Continue with Google
              </ThemedText>
            </TouchableOpacity>

            {/* SIGNUP LINK */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <ThemedText style={{ color: colors.textSecondary }}>
                Do not have an account?{" "}
              </ThemedText>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <ThemedText style={{ color: colors.tint, fontWeight: "700" }}>
                  Sign up
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
