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
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";

// REACT NAV
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "./authWrapper";

// REDUX
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/redux/slice/registerSlice";
import { loginUser } from "@/redux/slice/loginSlice";
import { RootState, AppDispatch } from "@/redux/store/store";

// SCREENS
import { AuthStyles as styles } from "@/components/styledComponents/AuthStyle";
import LoadingBanner from "@/components/ui/LoadingBanner";

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Register"
>;

export function RegisterScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.register);

  const name = "Champ!";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isProvider, setIsProvider] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const resultAction = await dispatch(
        registerUser({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          phoneNumber: phone || "",
          role: isProvider ? "provider" : "customer",
        })
      );

      if (registerUser.fulfilled.match(resultAction)) {
        await dispatch(
          loginUser({
            email: email.trim().toLowerCase(),
            password,
          })
        );
      } else {
        alert(resultAction.payload || "Registration failed");
      }
    } catch (err) {
      console.error("Registration/Login error:", err);
    }
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
            <View
              style={{
                height: 60,
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
                justifyContent: "flex-start",
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 24,
                  backgroundColor: colors.tint,
                }}
              >
                <Ionicons
                  name="chevron-back"
                  size={28}
                  color={colors.background}
                />
              </TouchableOpacity>

              <Text style={[styles.title, {fontSize: 28, color: colors.text}]}>
                Create Account
              </Text>
            </View>

            {/* TITLE SECTION */}
            <View style={{ marginBottom: 40 }}>
              <ThemedText
                style={[styles.subtitle, { color: colors.textSecondary }]}
              >
                Join our growing water community
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

            {/* PHONE INPUT */}
            <View style={styles.inputWrapper}>
              <ThemedText style={[styles.label, { color: colors.text }]}>
                Phone Number
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
                  <Ionicons name="call" size={22} color={colors.background} />
                </View>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="+27 (66) 000-0000"
                  placeholderTextColor={colors.textSecondary}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  editable={!loading}
                />
              </View>
            </View>

            {/* PASSWORD INPUT */}
            <View style={styles.inputWrapper}>
              <ThemedText style={[styles.label, { color: colors.text }]}>
                Password
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
                  <Ionicons
                    name="lock-closed"
                    size={22}
                    color={colors.background}
                  />
                </View>
                <TextInput
                  style={[styles.input, { color: colors.text, flex: 1 }]}
                  placeholder="Create a password"
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

            {/* PROVIDER CHECKBOX */}
            <TouchableOpacity
              onPress={() => setIsProvider(!isProvider)}
              style={[
                styles.checkboxContainer,
                { borderColor: colors.border, backgroundColor: colors.card },
              ]}
              disabled={loading}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: isProvider ? colors.tint : "transparent",
                    borderColor: colors.successGreen,
                  },
                ]}
              >
                {isProvider && (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={colors.background}
                  />
                )}
              </View>
              <ThemedText style={{ fontSize: 16, marginLeft: 12, fontFamily: 'poppinsLight', }}>
                Register as a water provider
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* ERROR DISPLAY */}
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
          {/* ENDS */}

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
                    onPress={handleRegister}
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
                  <ThemedText style={styles.confirmText}>SIGN UP</ThemedText>
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

            {/* LOGIN LINK */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <ThemedText style={{ color: colors.textSecondary, fontFamily: 'poppinsBold', }}>
                Already have an account?{" "}
              </ThemedText>
              <TouchableOpacity onPress={() => navigation.navigate("Login")} disabled={loading}>
                <ThemedText style={{ color: colors.tint, fontFamily: 'poppinsMedium', }}>
                  Login
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
