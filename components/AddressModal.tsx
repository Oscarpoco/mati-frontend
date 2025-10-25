// AddressModal.tsx
import React, { useState } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  FlatList,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";

interface AddressModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectAddress: (address: string) => void;
  savedAddresses: string[];
  onAddAddress: (address: string) => void;
  initialView?: "list" | "search";
}

export default function AddressModal({
  visible,
  onClose,
  onSelectAddress,
  savedAddresses,
  onAddAddress,
  initialView = "list",
}: AddressModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];

  const [currentView, setCurrentView] = useState<"list" | "search" | "confirm">(
    initialView
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmingAddress, setConfirmingAddress] = useState("");

  // Mock search results - replace with real API
  const searchResults = [
    "123 Main Street, Downtown",
    "456 Oak Avenue, Midtown",
    "789 Pine Road, Uptown",
    "321 Elm Street, Suburbs",
    "654 Maple Drive, Countryside",
  ].filter((addr) => addr.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleAddressSelect = (address: string) => {
    setConfirmingAddress(address);
    setCurrentView("confirm");
  };

  const handleConfirmAddress = () => {
    onAddAddress(confirmingAddress);
    onSelectAddress(confirmingAddress);
    resetModal();
  };

  const handleSelectSavedAddress = (address: string) => {
    onSelectAddress(address);
    resetModal();
  };

  const resetModal = () => {
    setCurrentView(initialView);
    setSearchQuery("");
    setConfirmingAddress("");
    onClose();
  };

  const renderListView = () => (
    <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View style={styles.modalHeader}>
        <TouchableOpacity
          onPress={resetModal}
          style={[styles.closeButton, { backgroundColor: colors.tint }]}
        >
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <ThemedText style={styles.modalTitle}>My Addresses</ThemedText>
        <View style={{ width: 28 }} />
      </View>

      {/* DIVIDER */}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* SAVED ADDRESSES LIST */}
      <ThemedText
        style={[styles.sectionLabel, { color: colors.textSecondary }]}
      >
        SAVED ADDRESSES
      </ThemedText>

      <FlatList
        data={savedAddresses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[
              styles.addressItem,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => handleSelectSavedAddress(item)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.addressIconContainer,
                { backgroundColor: colors.tint + "15" },
              ]}
            >
              <Ionicons name="location" size={20} color={colors.tint} />
            </View>
            <View style={styles.addressInfo}>
              <ThemedText style={styles.addressLabel}>
                Address {index + 1}
              </ThemedText>
              <ThemedText style={styles.addressText}>{item}</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.tint} />
          </TouchableOpacity>
        )}
        scrollEnabled={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="location-outline"
              size={48}
              color={colors.textSecondary}
            />
            <ThemedText
              style={[styles.emptyText, { color: colors.textSecondary }]}
            >
              No saved addresses yet
            </ThemedText>
            <ThemedText
              style={[styles.emptySubtext, { color: colors.textSecondary }]}
            >
              Add one to get started
            </ThemedText>
          </View>
        }
      />

      {/* ADD NEW ADDRESS BUTTON */}

      <View
        style={[styles.confirmContainer, { backgroundColor: colors.bottomNav }]}
      >
        <TouchableOpacity
          onPress={() => setCurrentView("search")}
          // disabled={isLoading}
          style={[styles.confirmButton, { backgroundColor: colors.tint }]}
        >
          <Ionicons
            name="chevron-forward"
            size={32}
            color={colors.background}
          />
        </TouchableOpacity>

        <ThemedText style={[styles.confirmText, { color: colors.background }]}>
          ADD NEW ADDRESS
        </ThemedText>

        <View
          style={{
            alignItems: "center",
            backgroundColor: colors.bottomNav,
            flexDirection: "row",
          }}
        >
          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.background}
          />
          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.background}
          />
          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.background}
          />
        </View>
      </View>
    </View>
  );

  const renderSearchView = () => (
    <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View style={styles.modalHeader}>
        <TouchableOpacity
          onPress={() => setCurrentView("list")}
          style={[styles.closeButton, { backgroundColor: colors.tint }]}
        >
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <ThemedText style={styles.modalTitle}>Search Address</ThemedText>
      </View>

      {/* DIVIDER */}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* SEARCH INPUT */}
      <View
        style={[
          styles.searchWrapper,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Ionicons name="search" size={24} color={colors.textSecondary} />
        <TextInput
          style={[
            styles.searchInput,
            {
              color: colors.text,
            },
          ]}
          placeholder="Search address or location"
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* SEARCH RESULTS */}
      <ThemedText
        style={[
          styles.sectionLabel,
          { color: colors.textSecondary, marginTop: 20 },
        ]}
      >
        SEARCH RESULTS
      </ThemedText>

      <FlatList
        data={searchResults}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.searchResultItem,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => handleAddressSelect(item)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.resultIconContainer,
                { backgroundColor: colors.tint + "15" },
              ]}
            >
              <Ionicons name="location-outline" size={18} color={colors.tint} />
            </View>
            <ThemedText style={styles.resultText}>{item}</ThemedText>
            <Ionicons name="chevron-forward" size={18} color={colors.tint} />
          </TouchableOpacity>
        )}
        scrollEnabled={true}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name={searchQuery ? "search-outline" : "location-outline"}
              size={48}
              color={colors.textSecondary}
            />
            <ThemedText
              style={[styles.emptyText, { color: colors.textSecondary }]}
            >
              {searchQuery ? "No results found" : "Start typing to search"}
            </ThemedText>
            <ThemedText
              style={[styles.emptySubtext, { color: colors.textSecondary }]}
            >
              {searchQuery
                ? "Try a different search term"
                : "Enter street name or location"}
            </ThemedText>
          </View>
        }
      />
    </View>
  );

  const renderConfirmView = () => (
    <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View style={styles.modalHeader}>
        <TouchableOpacity
          onPress={() => setCurrentView("search")}
          style={[styles.closeButton, { backgroundColor: colors.tint }]}
        >
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <ThemedText style={styles.modalTitle}>Confirm Address</ThemedText>
        <View style={{ width: 28 }} />
      </View>

      {/* DIVIDER */}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* CONFIRMATION CARD */}
      <View
        style={[
          styles.confirmationCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.tint + "30",
            shadowColor: colors.tint,
          },
        ]}
      >
        <View
          style={[
            styles.confirmIconCircle,
            { backgroundColor: colors.tint + "15" },
          ]}
        >
          <Ionicons name="location" size={40} color={colors.tint} />
        </View>

        <ThemedText style={styles.confirmLabel}>Delivery Address</ThemedText>
        <ThemedText style={styles.confirmAddress}>
          {confirmingAddress}
        </ThemedText>

        {/* CONFIRMATION DOTS STYLING */}
        <View
          style={[styles.confirmDotOne, { backgroundColor: colors.background }]}
        />
        <View
          style={[styles.confirmDotTwo, { backgroundColor: colors.background }]}
        />
      </View>

      {/* CONFIRMATION MESSAGE */}
      <ThemedText style={[styles.confirmQuestion, { color: colors.text }]}>
        Are you sure you want to add this as your delivery address?
      </ThemedText>

      {/* ACTION BUTTONS ROW */}
      <View style={styles.confirmButtonRow}>
        <TouchableOpacity
          style={[
            styles.confirmCancelButton,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setCurrentView("search")}
          activeOpacity={0.7}
        >
          <ThemedText style={[styles.cancelButtonText, { color: colors.text }]}>
            Cancel
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.confirmYesButton, { backgroundColor: colors.tint }]}
          onPress={handleConfirmAddress}
          activeOpacity={0.8}
        >
          <Ionicons
            name="checkmark"
            size={24}
            color={colors.background}
            style={{ marginRight: 6 }}
          />
          <ThemedText
            style={[styles.yesButtonText, { color: colors.background }]}
          >
            Confirm
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );

  const currentContent =
    currentView === "list"
      ? renderListView()
      : currentView === "search"
      ? renderSearchView()
      : renderConfirmView();

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View
        style={[styles.modalOverlay, { backgroundColor: colors.background }]}
      >
        {currentContent}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
  },

  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 8,
  },

  closeButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },

  modalTitle: {
    fontSize: 26,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    letterSpacing: -0.5,
    marginLeft: -8,
  },

  divider: {
    height: 1,
    marginBottom: 20,
    opacity: 0.5,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 12,
    opacity: 0.7,
  },

  addressItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 38,
    marginBottom: 12,
    borderWidth: 1,
    gap: 12,
  },

  addressIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  addressInfo: {
    flex: 1,
    gap: 4,
  },

  addressLabel: {
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.6,
    textTransform: "uppercase",
  },

  addressText: {
    fontSize: 14,
    fontWeight: "500",
  },

  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    height: 60,
    borderRadius: 28,
    borderWidth: 1,
    gap: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
  },

  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginBottom: 12,
    borderWidth: 1,
    gap: 12,
  },

  resultIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  resultText: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },

  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
  },

  emptySubtext: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 6,
  },

  addButton: {
    flexDirection: "row",
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },

  addButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },

  confirmationCard: {
    alignItems: "center",
    padding: 28,
    borderRadius: 28,
    marginVertical: 32,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    gap: 12,
    position: "relative",
    overflow: "hidden",
  },

  confirmDotOne: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    top: -15,
    right: -20,
    opacity: 0.5,
  },

  confirmDotTwo: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    bottom: -25,
    left: -25,
    opacity: 0.3,
  },

  confirmIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  confirmLabel: {
    fontSize: 12,
    fontWeight: "700",
    opacity: 0.6,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  confirmAddress: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },

  confirmQuestion: {
    fontSize: 15,
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 28,
    lineHeight: 22,
  },

  confirmButtonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: "auto",
  },

  confirmCancelButton: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },

  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },

  confirmYesButton: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  yesButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },

  confirmContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    borderRadius: 32,
    flexDirection: "row",
    padding: 4,
    paddingRight: 20,
  },

  confirmButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
  },

  confirmText: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.7,
    letterSpacing: 1.2,
  },
});
