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
import React, { useState, useRef, useEffect } from "react";

// REDUX
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserDetails,
  clearError,
  clearSuccess,
  fetchUserDetails,
} from "../redux/slice/updateUserDetailsSlice";
import { RootState, AppDispatch } from "@/redux/store/store";
import { fetchUserById } from "@/redux/slice/authSlice";

import LoadingBanner from "./ui/LoadingBanner";

const { height: screenHeight } = Dimensions.get("window");

interface EditDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  colors: any;
}

export default function EditDetailsModal({
  visible,
  onClose,
  colors,
}: EditDetailsModalProps) {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Get uid and token from auth state
  const uid = useSelector((state: RootState) => state.auth.user?.uid);
  const token = useSelector((state: RootState) => state.auth?.token);

  const { user, loading, error, success } = useSelector(
    (state: RootState) => state.userDetails
  );

  // ✅ Local form state
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
  });

  // ✅ POPULATE FORM WITH FETCHED USER DATA
  useEffect(() => {
    if (user?.name || user?.phoneNumber) {
      setEditForm({
        name: user.name || "",
        phone: user.phoneNumber || "",
      });
    }
  }, [user]);

  // ✅ REFETCH USER DETAILS AFTER SUCCESSFUL UPDATE
  useEffect(() => {
    if (success && uid && token) {
      setTimeout(() => {
        dispatch(fetchUserDetails({ uid, token }));
        dispatch(fetchUserById({ uid, token }));
      }, 500);
    }
  }, [success, uid, token, dispatch]);

  // ✅ CLOSE MODAL AFTER SUCCESS
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        slideOut();
        dispatch(clearSuccess());
      }, 2000);
    }
  }, [success, dispatch]);

  const handleChange = (name: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Dispatch Redux action to update user details
  const handleSubmit = () => {
    if (!uid || !token) {
      console.error("❌ Missing uid or token");
      return;
    }

    if (!editForm.name.trim() || !editForm.phone.trim()) {
      alert("Please fill in all fields");
      return;
    }
    
    dispatch(
      updateUserDetails({
        uid,
        name: editForm.name.trim(),
        phoneNumber: editForm.phone.trim(),
        token,
      })
    );
  };

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

  useEffect(() => {
    if (visible) {
      slideIn();
    }
  }, [visible]);

  const handleClose = () => {
    dispatch(clearError());
    slideOut();
  };

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
            Edit Details
          </ThemedText>
          <View style={{ width: 50, height: 50 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.modalContent}
        >
          {/* ✅ Success Message */}
          {success && (
            <View
              style={{
                padding: 12,
                alignItems: "center",
                width: "100%",
                justifyContent: "center",
                backgroundColor: "#4CAF50",
                borderRadius: 12,
                marginBottom: 20,
              }}
            >
              <ThemedText
                style={{
                  color: "#fff",
                  fontSize: 14,
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                ✓ Profile updated successfully!
              </ThemedText>
            </View>
          )}

          {/* ✅ Error Message */}
          {error && (
            <View
              style={{
                padding: 12,
                alignItems: "center",
                width: "100%",
                justifyContent: "center",
                backgroundColor: "#f44336",
                borderRadius: 12,
                marginBottom: 20,
              }}
            >
              <ThemedText
                style={{
                  color: "#fff",
                  fontSize: 12,
                  textAlign: "center",
                  fontWeight: "600",
                  textTransform: "uppercase",
                }}
              >
                {typeof error === "string" ? error : "Something went wrong"}
              </ThemedText>
            </View>
          )}

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
              onChangeText={(text) => handleChange("name", text)}
              editable={!loading}
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
              onChangeText={(text) => handleChange("phone", text)}
              editable={!loading}
              keyboardType="phone-pad"
            />
          </View>

          {/* ✅ Loading Banner OR Save Button */}
          {loading ? (
            <LoadingBanner
              loading={loading}
              error={null}
              onPress={() => console.log("Button pressed")}
            />
          ) : (
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.button }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: colors.tint,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="checkmark-outline"
                  size={24}
                  color={colors.background}
                />
              </View>

              <ThemedText
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.textSecondary,
                  textTransform: "uppercase",
                }}
              >
                SAVE CHANGES
              </ThemedText>

              <View style={{ flexDirection: "row", gap: 0 }}>
                {[...Array(3)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name="chevron-forward"
                    size={16}
                    color={colors.textSecondary}
                    style={{ marginTop: 4 }}
                  />
                ))}
              </View>
            </TouchableOpacity>
          )}
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
    fontWeight: "400" as const,
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
