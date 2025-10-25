import React from "react";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { AuthStyles as styles } from "@/components/styledComponents/AuthStyle";
import { ThemedText } from "../themed-text";

type LoadingBannerProps = {
  loading: boolean;
  error: string | null;
  onPress?: () => void; 
};

const LoadingBanner: React.FC<LoadingBannerProps> = ({
  loading,
  error,
  onPress,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];

  return (
    <View
      style={[
        styles.confirmContainer,
        { backgroundColor: colors.button, paddingRight: 6, paddingLeft: 20 },
      ]}
    >
      {!error ? (
        <>
          <View
            style={{
              alignItems: "center",
              backgroundColor: "transparent",
              flexDirection: "row",
            }}
          >
            <Ionicons name="chevron-back" size={16} color={colors.textSecondary} />
            <Ionicons name="chevron-back" size={16} color={colors.textSecondary} />
            <Ionicons name="chevron-back" size={16} color={colors.textSecondary} />
          </View>

          <ThemedText
            style={[styles.confirmText, { color: colors.text, fontSize: 12 }]}
          >
            LOADING PLEASE WAIT
          </ThemedText>

          <TouchableOpacity
            disabled={loading}
            onPress={onPress}
            style={[styles.confirmButton, { backgroundColor: colors.tint }]}
          >
            {loading && (
              <ActivityIndicator size={"large"} color={colors.background} />
            )}
          </TouchableOpacity>
        </>
      ) : (
        <View style={{ padding: 10, alignItems: "center" }}>
          <ThemedText
            style={{
              color: colors.warningRed,
              fontSize: 12,
              textAlign: "center",
            }}
          >
            {typeof error === "string" ? error : "Something went wrong"}
          </ThemedText>
        </View>
      )}
    </View>
  );
};

export default LoadingBanner;
