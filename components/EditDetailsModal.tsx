// components/profile/modals/EditDetailsModal.tsx
import {
  Modal,
  ScrollView,
  View,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useRef } from "react";

const { height: screenHeight } = Dimensions.get("window");

interface EditDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  user: any;
  colors: any;
  onSave: (details: any) => void;
}

export default function EditDetailsModal({
  visible,
  onClose,
  user,
  colors,
  onSave,
}: EditDetailsModalProps) {
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    phone: user?.phoneNumber || "",
  });

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

  const handleOpen = () => {
    slideIn();
  };

  const handleClose = () => {
    slideOut();
  };

  React.useEffect(() => {
    if (visible) {
      handleOpen();
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
              width: 50,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 18,
              backgroundColor: colors.tint,
            }}
          >
            <Ionicons
              name="chevron-back"
              size={28}
              color={colors.background}
            />
          </TouchableOpacity>
          <ThemedText
            style={{
              color: colors.text,
              textAlign: "center",
              fontSize: 22,
              fontWeight: "600",
            }}
          >
            Edit Details
          </ThemedText>
          <View style={{ width: 50, height: 50 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.modalContent}
        >
          <View style={styles.formGroup}>
            <ThemedText style={styles.formLabel}>Full Name</ThemedText>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Enter your name"
              placeholderTextColor={colors.textSecondary}
              value={editForm.name}
              onChangeText={(text) =>
                setEditForm({ ...editForm, name: text })
              }
            />
          </View>

          <View style={styles.formGroup}>
            <ThemedText style={styles.formLabel}>Phone Number</ThemedText>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Enter your phone number"
              placeholderTextColor={colors.textSecondary}
              value={editForm.phone}
              onChangeText={(text) =>
                setEditForm({ ...editForm, phone: text })
              }
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.tint }]}
            onPress={() => onSave(editForm)}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: colors.background,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="checkmark" size={24} color={colors.tint} />
            </View>

            <ThemedText
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: colors.background,
                textTransform: "uppercase",
              }}
            >
              Save Changes
            </ThemedText>

            <View style={{ flexDirection: "row", gap: 0 }}>
              {[...Array(3)].map((_, i) => (
                <Ionicons
                  key={i}
                  name="chevron-forward"
                  size={16}
                  color={colors.background}
                  style={{ marginTop: 4 }}
                />
              ))}
            </View>
          </TouchableOpacity>
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
    paddingTop: 70,
  },
  modalContent: {
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 40,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    marginBottom: 8,
    opacity: 0.7,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: "500" as const,
  },
  saveButton: {
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    borderRadius: 32,
    flexDirection: "row" as const,
    padding: 4,
    paddingRight: 20,
    marginBottom: 0,
    marginTop: 24,
  },
};