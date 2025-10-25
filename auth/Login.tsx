import {
  Platform,
  View,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  KeyboardAvoidingView,
  ScrollView,
  Text,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Fonts } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";

// REACT NAV
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "./authWrapper";

// REDUX
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/redux/slice/loginSlice";
import { RootState, AppDispatch } from "@/redux/store/store";

// STYLES
import { AuthStyles as styles } from "@/components/styledComponents/AuthStyle";
import LoadingBanner from "@/components/ui/LoadingBanner";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"
>;

export function LoginScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Handle login
  const handleLogin = () => {
    if (!email || !password) {
      alert("Please enter your email and password");
      return;
    }

    dispatch(loginUser({ email, password }));
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
            <View style={{ height: 100 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                {/* Animated Water Circle Logo */}
                <View
                  style={{
                    position: "relative",
                    width: 56,
                    height: 56,
                  }}
                >
                  {/* Outer gradient circle effect */}
                  <View
                    style={{
                      position: "absolute",
                      width: 56,
                      height: 56,
                      borderRadius: 28,
                      backgroundColor: colors.tint + "15",
                      borderWidth: 2,
                      borderColor: colors.tint + "30",
                    }}
                  />

                  {/* Inner circle with water drop */}
                  <View
                    style={{
                      position: "absolute",
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: colors.tint,
                      justifyContent: "center",
                      alignItems: "center",
                      top: 4,
                      left: 4,
                      shadowColor: colors.tint,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 8,
                    }}
                  >
                    <Ionicons
                      name="water"
                      size={28}
                      color={colors.background}
                    />
                  </View>

                  {/* Top accent dot */}
                  <View
                    style={{
                      position: "absolute",
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: colors.tint,
                      top: 1,
                      right: 0,
                      opacity: 0.6,
                    }}
                  />

                  {/* Bottom accent dot */}
                  <View
                    style={{
                      position: "absolute",
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: colors.tint,
                      bottom: -2,
                      left: 2,
                      opacity: 0.4,
                    }}
                  />
                </View>

                {/* Text Logo */}
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.sans,
                      color: colors.text,
                      fontSize: 32,
                      fontWeight: "800",
                      letterSpacing: -0.8,
                      lineHeight: 38,
                      marginBottom: -2,
                    }}
                  >
                    MATI
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.sans,
                      color: colors.tint,
                      fontSize: 10,
                      fontWeight: "600",
                      letterSpacing: 1.2,
                      textTransform: "uppercase",
                      opacity: 0.8,
                    }}
                  >
                    Pure Water
                  </Text>
                </View>
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
                  editable={!loading}
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
                <TouchableOpacity
                  onPress={() => navigation.navigate("ResetPassword")}
                  disabled={loading}
                >
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
                  <Ionicons
                    name="lock-closed"
                    size={22}
                    color={colors.background}
                  />
                </View>
                <TextInput
                  style={[styles.input, { color: colors.text, flex: 1 }]}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
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

          <React.Fragment>
            {error && (
              <View
                style={{
                  padding: 10,
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <ThemedText
                  style={{
                    color: colors.warningRed,
                    fontSize: 12,
                    textAlign: "center",
                    textTransform: "uppercase",
                    width: "100%",
                  }}
                >
                  {typeof error === "string" ? error : "Something went wrong"}
                </ThemedText>
              </View>
            )}
          </React.Fragment>

          {/* BOTTOM SECTION */}
          <View>
            {/* LOGIN BUTTON */}

            {loading ? (
              <React.Fragment>
                <LoadingBanner
                  loading={loading}
                  error={error}
                  onPress={() => console.log("Button pressed")}
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <View
                  style={[
                    styles.confirmContainer,
                    { backgroundColor: colors.button },
                  ]}
                >
                  <TouchableOpacity
                    onPress={handleLogin}
                    disabled={loading}
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
                  <ThemedText style={styles.confirmText}>SIGN IN</ThemedText>
                  <View
                    style={{
                      alignItems: "center",
                      backgroundColor: "transparent",
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
              </React.Fragment>
            )}

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
              disabled={loading}
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
              <TouchableOpacity
                onPress={() => navigation.navigate("Register")}
                disabled={loading}
              >
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
