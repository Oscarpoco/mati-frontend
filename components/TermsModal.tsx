// components/profile/modals/TermsModal.tsx
import {
  Modal,
  ScrollView,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";

const { height: screenHeight } = Dimensions.get("window");

interface TermsModalProps {
  visible: boolean;
  onClose: () => void;
  colors: any;
}

const TERMS_CONTENT = `1. User Agreement

By using our service, you agree to our terms and conditions.

2. Service Description

We provide water delivery services to customers in selected areas.

3. User Responsibilities

Users are responsible for providing accurate information during registration and maintaining the confidentiality of their account.

4. Payment Terms

Payment must be made as per the selected payment method. Cancellations must be made 2 hours before delivery.

5. Delivery Terms

Deliveries are made during business hours. Additional charges may apply for areas outside our service zone.

6. Limitation of Liability

We are not liable for any indirect or consequential damages arising from your use of our service.

7. Modification of Terms

We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.

8. Governing Law

These terms are governed by applicable local laws.`;

export default function TermsModal({
  visible,
  onClose,
  colors,
}: TermsModalProps) {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  const slideIn = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const slideOut = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 500,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const handleClose = () => {
    slideOut();
  };

  React.useEffect(() => {
    if (visible) {
      slideIn();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={handleClose}
    >
      <StatusBar hidden={true} />

      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={0.7}
        onPress={handleClose}
      />

      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [{ translateY: slideAnim }],
            backgroundColor: colors.background,
            maxHeight: screenHeight * 0.7,
          },
        ]}
      >
        <View
          style={[
            styles.modalHeader,
            { borderBottomColor: colors.border, paddingTop: 15 },
          ]}
        >
          <TouchableOpacity
            onPress={handleClose}
            style={{
              width: 45,
              height: 45,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 18,
              backgroundColor: colors.tint,
            }}
          >
            <Ionicons name="chevron-back" size={28} color={colors.background} />
          </TouchableOpacity>
          <ThemedText
            style={{
              color: colors.text,
              textAlign: "center",
              fontSize: 22,
              fontWeight: "600",
            }}
          >
            Terms & Conditions
          </ThemedText>
          <View style={{ width: 50, height: 50 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.modalContent}
        >
          <ThemedText style={styles.termsContent}>{TERMS_CONTENT}</ThemedText>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = {
  backdrop: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000000",
    opacity: 0.5,
  },
  modalContainer: {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: screenHeight,
  },
  modalHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  modalContent: {
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 40,
  },
  termsContent: {
    fontSize: 14,
    lineHeight: 24,
    opacity: 0.8,
    marginBottom: 0,
  },
};
