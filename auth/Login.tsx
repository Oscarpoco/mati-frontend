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
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
import { AnnouncementBanner } from "@/components/ui/AnnouncementBanner";
import MatiLogo from "@/components/ui/Logo";

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

  const [showAnnouncement, setShowAnnouncement] = useState(false);

  useEffect(() => {
    const checkAnnouncement = async () => {
      try {
        const isRead = await AsyncStorage.getItem("announcement_v1_isRead");
        if (!isRead) {
          setShowAnnouncement(true);
        }
      } catch (error) {
        console.log("Error reading announcement:", error);
      }
    };

    checkAnnouncement();
  }, []);

  const handleDismissAnnouncement = async () => {
    try {
      await AsyncStorage.setItem("announcement_v1_isRead", "true");
      setShowAnnouncement(false);
    } catch (error) {
      console.log("Error saving announcement state:", error);
    }
  };

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
              <MatiLogo size={53} />
            </View>

            {/* TITLE SECTION */}
            <View style={{ marginBottom: 40 }}>
              <ThemedText style={[styles.title, {fontFamily: 'poppinsBlack'}]}>Ha ku amukela</ThemedText>
              <ThemedText
                style={[styles.subtitle, { color: colors.textSecondary, fontFamily: 'poppinsBold', }]}
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
                    fontFamily: 'poppinsMedium',
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
                  fontSize: 18,
                  position: "absolute",
                  left: "45%",
                  backgroundColor: colors.background,
                  paddingHorizontal: 10,
                  fontFamily: 'poppinsBlack',
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
                style={{ fontSize: 16, fontWeight: "600", marginLeft: 10, fontFamily: 'poppinsBlack',color: colors.textSecondary }}
              >
                CONTINUE WITH GOOGLE
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
              <ThemedText style={{ color: colors.textSecondary, fontFamily: 'poppinsBlack', }}>
                Do not have an account?{" "}
              </ThemedText>
              <TouchableOpacity
                onPress={() => navigation.navigate("Register")}
                disabled={loading}
              >
                <ThemedText style={{ color: colors.tint, fontFamily: 'poppinsMedium', }}>
                  Sign up
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <>
      {showAnnouncement && (
        <AnnouncementBanner
          title="IMPORTANT ANNOUNCEMENT"
          message="The wait is over! MATI BETA Version is finally here. Create your Account as a Customer to experience great work made by GAMEFUXION-ZA Developers. NOTE: This app does not feature any payment method in Beta. Expect the first full version on 22 November."
          fields={[
            {
              label: "Email",
              value: "oscarkylepoco@gmail.com",
              type: "email",
              icon: "mail",
            },
            {
              label: "WhatsApp",
              value: "+27 (0)660 850 741",
              type: "phone",
              icon: "logo-whatsapp",
            },
          ]}
          type="success"
          onDismiss={handleDismissAnnouncement}
        />
      )}
      {/* Rest of your layout */}
    </>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
