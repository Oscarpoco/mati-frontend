import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Fonts } from "@/constants/theme";

type MatiLogoProps = {
  size?: number; // optional: allows resizing (default 56)
  showText?: boolean; // optional: show or hide "Mati Pure Water"
};

const MatiLogo: React.FC<MatiLogoProps> = ({
  size = 56,
  showText = true,
}) => {
  const colors = Colors.dark; // or Colors.light depending on theme

  const innerSize = size * 0.7;
  const outerSize = size * 0.85;

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      {/* LOGO CIRCLE PART */}
      <View style={{ position: "relative", width: size, height: size }}>
        {/* OUTER GRADIENT CIRCLE */}
        <View
          style={{
            position: "absolute",
            width: outerSize,
            height: outerSize,
            borderRadius: outerSize / 2,
            backgroundColor: colors.tint + "15",
            borderWidth: 2,
            borderColor: colors.tint + "30",
            alignSelf: "center",
          }}
        />

        {/* INNER CIRCLE */}
        <View
          style={{
            position: "absolute",
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            backgroundColor: colors.tint,
            justifyContent: "center",
            alignItems: "center",
            top: (size - innerSize) / 2,
            left: (size - innerSize) / 2,
            shadowColor: colors.tint,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Ionicons name="water" size={innerSize * 0.7} color={colors.background} />
        </View>

        {/* ACCENT DOTS */}
        <View
          style={{
            position: "absolute",
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: colors.tint,
            top: -3,
            right: 8,
            opacity: 0.6,
          }}
        />
        <View
          style={{
            position: "absolute",
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: colors.tint,
            bottom: -2,
            left: 8,
            opacity: 0.4,
          }}
        />
      </View>

      {/* TEXT PART */}
      {showText && (
        <View style={{ flexDirection: "column", justifyContent: "center" }}>
          <Text
            style={{
              fontFamily: Fonts.sans,
              color: colors.text,
              fontSize: 24,
              fontWeight: "800",
              letterSpacing: -0.8,
              lineHeight: 38,
            }}
          >
            MATI
          </Text>
          <Text
            style={{
              fontFamily: Fonts.sans,
              color: colors.tint,
              fontSize: 8,
              fontWeight: "600",
              letterSpacing: 1.2,
              textTransform: "uppercase",
              opacity: 0.8,
              marginBottom: 8,
            }}
          >
            Pure Water
          </Text>
        </View>
      )}
    </View>
  );
};

export default MatiLogo;
