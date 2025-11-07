import React from "react";
import { View, TouchableOpacity, Animated,  useColorScheme, Linking } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";

interface AnnouncementField {
  label: string;
  value: string;
  icon?: any;
  type?: "email" | "phone" | "text" | "url";
}

interface AnnouncementBannerProps {
  title: string;
  message: string;
  fields?: AnnouncementField[];
  onDismiss: () => void;
  type?: "info" | "warning" | "success";
}

export function AnnouncementBanner({
  title,
  message,
  fields = [],
  onDismiss,
  type = "info",
}: AnnouncementBannerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleDismiss = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onDismiss());
  };

  const handleFieldPress = (field: AnnouncementField) => {
    if (field.type === "email") {
      Linking.openURL(`mailto:${field.value}`);
    } else if (field.type === "phone") {
      Linking.openURL(`tel:${field.value}`);
    }
  };

  const typeColors = {
    info: colors.tint,
    warning: "#FFA500",
    success: "#4CAF50",
  };

  const getIconName = (type?: string): string => {
    switch (type) {
      case "email":
        return "mail";
      case "phone":
        return "call";
      case "url":
        return "link";
      default:
        return "information-circle";
    }
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        zIndex: 1000,
      }}
    >
      <View
        style={{
          backgroundColor: typeColors[type] + "12",
          borderBottomColor: typeColors[type],
          borderBottomWidth: 4,
          paddingVertical: 16,
          paddingHorizontal: 14,
        }}
      >
        {/* Header with Icon and Close */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 14,
            gap: 12,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: typeColors[type],
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name={
                type === "info"
                  ? "information-circle"
                  : type === "warning"
                    ? "warning"
                    : "checkmark-circle"
              }
              size={20}
              color={colors.background}
            />
          </View>

          <View style={{ flex: 1 }}>
            <ThemedText
              style={{
                fontSize: 15,
                fontWeight: "800",
                color: colors.text,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {title}
            </ThemedText>
          </View>

          <TouchableOpacity
            onPress={handleDismiss}
            style={{
              width: 35,
              height: 35,
              justifyContent: "center",
              alignItems: "center",
              marginRight: -4,
            }}
          >
            <Ionicons name="close" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Main Message */}
        <View style={{ marginBottom: 14 }}>
          <ThemedText
            style={{
              fontSize: 13,
              color: colors.text,
              lineHeight: 20,
              letterSpacing: 0.3,
              fontWeight: "500",
            }}
          >
            {message}
          </ThemedText>
        </View>

        {/* Contact Fields */}
        {fields.length > 0 && (
          <View
            style={{
              backgroundColor: colors.card + "40",
              borderRadius: 28,
              paddingVertical: 12,
              paddingHorizontal: 12,
              marginBottom: 12,
              borderColor: typeColors[type] + "20",
              borderWidth: 1,
            }}
          >
            {fields.map((field, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleFieldPress(field)}
                activeOpacity={field.type === "email" || field.type === "phone" ? 0.6 : 1}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 8,
                  paddingHorizontal: 8,
                  borderBottomColor: typeColors[type] + "15",
                  borderBottomWidth: index < fields.length - 1 ? 1 : 0,
                }}
              >
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: typeColors[type] + "20",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10,
                  }}
                >
                  <Ionicons
                    name={field.icon || getIconName(field.type)}
                    size={14}
                    color={typeColors[type]}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <ThemedText
                    style={{
                      fontSize: 10,
                      color: colors.textSecondary,
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: 0.3,
                      marginBottom: 2,
                    }}
                  >
                    {field.label}
                  </ThemedText>
                  <ThemedText
                    style={{
                      fontSize: 12,
                      color: colors.text,
                      fontWeight: "600",
                    }}
                  >
                    {field.value}
                  </ThemedText>
                </View>

                {(field.type === "email" || field.type === "phone") && (
                  <Ionicons
                    name="chevron-forward"
                    size={14}
                    color={typeColors[type]}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Footer - Date Posted */}
        <View
          style={{
            paddingTop: 10,
            borderTopColor: typeColors[type] + "25",
            borderTopWidth: 1,
          }}
        >
          <ThemedText
            style={{
              fontSize: 11,
              color: colors.textSecondary,
              fontWeight: "500",
              opacity: 0.7,
            }}
          >
            UPDATES: 07 NOVEMBER 2025 BY GAMEFUXION-ZA
          </ThemedText>
        </View>
      </View>
    </Animated.View>
  );
}