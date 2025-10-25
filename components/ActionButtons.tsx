// components/profile/ActionButtons.tsx
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

interface ActionButtonsProps {
  colors: any;
  onEditDetails: () => void;
  onManageAddresses: () => void;
  onDocuments: () => void;
  onTerms: () => void;
  onLogout: () => void;
}

export default function ActionButtons({
  colors,
  onEditDetails,
  onManageAddresses,
  onDocuments,
  onTerms,
  onLogout,
}: ActionButtonsProps) {
  return (
    <View>
      {/* EDIT DETAILS */}
      <TouchableOpacity
        style={[
          styles.actionButton,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
        onPress={onEditDetails}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Ionicons name="create" size={24} color={colors.tint} />
          <View>
            <ThemedText style={styles.actionButtonText}>
              Edit Personal Details
            </ThemedText>
            <ThemedText style={styles.actionButtonSubtext}>
              Update your profile information
            </ThemedText>
          </View>
        </View>
        <Ionicons
          name="chevron-forward"
          size={24}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {/* MANAGE ADDRESSES */}
      <TouchableOpacity
        style={[
          styles.actionButton,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
        onPress={onManageAddresses}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Ionicons name="location" size={24} color={colors.tint} />
          <View>
            <ThemedText style={styles.actionButtonText}>
              Manage Addresses
            </ThemedText>
            <ThemedText style={styles.actionButtonSubtext}>
              View and update saved addresses
            </ThemedText>
          </View>
        </View>
        <Ionicons
          name="chevron-forward"
          size={24}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {/* DOCUMENTS */}
      <TouchableOpacity
        style={[
          styles.actionButton,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
        onPress={onDocuments}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Ionicons name="document" size={24} color={colors.tint} />
          <View>
            <ThemedText style={styles.actionButtonText}>Documents</ThemedText>
            <ThemedText style={styles.actionButtonSubtext}>
              View document verification status
            </ThemedText>
          </View>
        </View>
        <Ionicons
          name="chevron-forward"
          size={24}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {/* TERMS & CONDITIONS */}
      <TouchableOpacity
        style={[
          styles.actionButton,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
        onPress={onTerms}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Ionicons name="document-text" size={24} color={colors.tint} />
          <View>
            <ThemedText style={styles.actionButtonText}>
              Terms & Conditions
            </ThemedText>
            <ThemedText style={styles.actionButtonSubtext}>
              Read our terms of service
            </ThemedText>
          </View>
        </View>
        <Ionicons
          name="chevron-forward"
          size={24}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {/* LOGOUT */}
      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.warningRed }]}
        onPress={onLogout}
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
          <Ionicons name="log-out" size={24} color={colors.tint} />
        </View>

        <ThemedText
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: colors.background,
            textTransform: "uppercase",
          }}
        >
          LOGOUT
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
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 28,
    marginBottom: 12,
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  actionButtonSubtext: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  saveButton: {
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 32,
    flexDirection: "row",
    padding: 4,
    paddingRight: 20,
    marginBottom: 0,
    marginTop: 24,
  },
});