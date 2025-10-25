import {
  StyleSheet,
  View,
  TouchableOpacity,
  useColorScheme,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  Dimensions,
  Animated,
  StatusBar,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Fonts } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useRef } from "react";
import AddressModal from "@/components/AddressModal";

const { height: screenHeight } = Dimensions.get("window");

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];

  // STATE FOR USER DATA
  const [userData, setUserData] = useState({
    name: "John Doe",
    phone: "+27 123 456 7890",
    email: "john.doe@example.com",
    isVerified: true,
  });

  // STATE FOR MODALS
  const [editDetailsModalVisible, setEditDetailsModalVisible] = useState(false);
  const [documentsModalVisible, setDocumentsModalVisible] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);

  // STATE FOR EDIT FORM
  const [editForm, setEditForm] = useState(userData);

  // ANIMATED VALUES
  const editDetailsSlideAnim = useRef(new Animated.Value(screenHeight)).current;
  const documentsSlideAnim = useRef(new Animated.Value(screenHeight)).current;
  const termsSlideAnim = useRef(new Animated.Value(screenHeight)).current;

  // MOCK SAVED ADDRESSES
  const [savedAddresses, setSavedAddresses] = useState([
    "123 Main Street, Downtown",
    "456 Oak Avenue, Midtown",
  ]);

  // MOCK DOCUMENTS
  const [documents, setDocuments] = useState([
    {
      id: "1",
      name: "ID Document",
      status: "approved",
      uploadDate: "2024-10-15",
    },
    {
      id: "2",
      name: "Proof of Address",
      status: "pending",
      uploadDate: "2024-10-20",
    },
    {
      id: "3",
      name: "Business License",
      status: "rejected",
      uploadDate: "2024-10-18",
    },
  ]);

  // ANIMATION FUNCTIONS
  const slideInModal = (anim: any) => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const slideOutModal = (anim: any, onComplete: any) => {
    Animated.timing(anim, {
      toValue: screenHeight,
      duration: 500,
      useNativeDriver: true,
    }).start(onComplete);
  };

  const handleOpenEditDetails = () => {
    setEditDetailsModalVisible(true);
    slideInModal(editDetailsSlideAnim);
  };

  const handleCloseEditDetails = () => {
    slideOutModal(editDetailsSlideAnim, () => {
      setEditDetailsModalVisible(false);
    });
  };

  const handleOpenDocuments = () => {
    setDocumentsModalVisible(true);
    slideInModal(documentsSlideAnim);
  };

  const handleCloseDocuments = () => {
    slideOutModal(documentsSlideAnim, () => {
      setDocumentsModalVisible(false);
    });
  };

  const handleOpenTerms = () => {
    setTermsModalVisible(true);
    slideInModal(termsSlideAnim);
  };

  const handleCloseTerms = () => {
    slideOutModal(termsSlideAnim, () => {
      setTermsModalVisible(false);
    });
  };

  const handleSaveDetails = () => {
    setUserData(editForm);
    handleCloseEditDetails();
    Alert.alert("Success", "Profile details updated successfully");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", onPress: () => {} },
      { text: "Logout", onPress: () => console.log("User logged out") },
    ]);
  };

  const handleAddAddress = (address: string) => {
    setSavedAddresses([...savedAddresses, address]);
  };

  const handleSelectAddress = (address: string) => {
    console.log("Selected address:", address);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "#10B981";
      case "rejected":
        return "#EF4444";
      case "pending":
        return "#F59E0B";
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return "checkmark-circle";
      case "rejected":
        return "close-circle";
      case "pending":
        return "time";
      default:
        return "help-circle";
    }
  };

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle="light-content" />

      {/* HEADER SECTION WITH TITLE AND PROFILE PICTURE */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <ThemedText style={[styles.title, { fontFamily: Fonts.sans }]}>
              Manage
            </ThemedText>
            <ThemedText style={[styles.title, { fontFamily: Fonts.sans }]}>
              Your Profile
            </ThemedText>
          </View>
        </View>
      </View>

      {/* MAIN CONTENT */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* USER INFO CARD */}
        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <View
            style={[styles.stylingDotOne, { backgroundColor: colors.tint }]}
          />
          <View
            style={[styles.stylingDotTwo, { backgroundColor: colors.tint }]}
          />
          <View
            style={[styles.stylingDotThree, { backgroundColor: colors.tint }]}
          />
          <View
            style={[styles.stylingDotFour, { backgroundColor: colors.tint }]}
          />
          <View style={styles.userInfoRow}>
            <ThemedText style={styles.userInfoLabel}>Name</ThemedText>
            <ThemedText style={styles.userInfoValue}>
              {userData.name}
            </ThemedText>
          </View>
          <View style={styles.divider} />

          <View style={styles.userInfoRow}>
            <ThemedText style={styles.userInfoLabel}>Phone</ThemedText>
            <ThemedText style={styles.userInfoValue}>
              {userData.phone}
            </ThemedText>
          </View>
          <View style={styles.divider} />

          <View style={styles.userInfoRow}>
            <ThemedText style={styles.userInfoLabel}>Email</ThemedText>
            <ThemedText style={styles.userInfoValue}>
              {userData.email}
            </ThemedText>
          </View>
          <View style={styles.divider} />

          <View style={styles.userInfoRow}>
            <ThemedText style={styles.userInfoLabel}>Verification</ThemedText>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Ionicons
                name={userData.isVerified ? "checkmark-circle" : "close-circle"}
                size={18}
                color={userData.isVerified ? "#10B981" : "#EF4444"}
              />
              <ThemedText
                style={{
                  color: userData.isVerified ? "#10B981" : "#EF4444",
                  fontWeight: "600",
                }}
              >
                {userData.isVerified ? "Verified" : "Not Verified"}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* ACTION BUTTONS */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={handleOpenEditDetails}
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

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={() => setAddressModalVisible(true)}
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

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={handleOpenDocuments}
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

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={handleOpenTerms}
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

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.warningRed }]}
          onPress={handleSaveDetails}
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
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.background}
              style={{ marginTop: 4 }}
            />
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.background}
              style={{ marginTop: 4 }}
            />
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.background}
              style={{ marginTop: 4 }}
            />
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* EDIT DETAILS MODAL */}
      <Modal
        visible={editDetailsModalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={handleCloseEditDetails}
      >
        <StatusBar hidden={true} />

        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={0.7}
          onPress={handleCloseEditDetails}
        />

        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: editDetailsSlideAnim }],
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
              onPress={handleCloseEditDetails}
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
            <View
              style={{
                width: 50,
                height: 50,
              }}
            />
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
              onPress={handleSaveDetails}
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
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.background}
                  style={{ marginTop: 4 }}
                />
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.background}
                  style={{ marginTop: 4 }}
                />
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.background}
                  style={{ marginTop: 4 }}
                />
              </View>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </Modal>

      {/* DOCUMENTS MODAL */}
      <Modal
        visible={documentsModalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={handleCloseDocuments}
      >
        <StatusBar hidden={true} />

        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={0.7}
          onPress={handleCloseDocuments}
        />

        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: documentsSlideAnim }],
              backgroundColor: colors.background,
            },
          ]}
        >
          <View
            style={[
              styles.modalHeader,
              {
                borderBottomColor: colors.border,
                paddingTop: 15,
                justifyContent: "flex-start",
                gap: "20%",
              },
            ]}
          >
            <TouchableOpacity
              onPress={handleCloseDocuments}
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
                alignSelf: "center",
                fontSize: 22,
                fontWeight: "600",
              }}
            >
              Documents
            </ThemedText>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalContent}
          >
            <TouchableOpacity
              style={[
                styles.uploadButton,
                { backgroundColor: colors.card, borderColor: colors.tint },
              ]}
            >
              <Ionicons name="cloud-upload" size={24} color={colors.tint} />
              <ThemedText style={{ color: colors.tint, fontWeight: "600" }}>
                Upload New Document
              </ThemedText>
            </TouchableOpacity>

            <ThemedText style={styles.sectionTitle}>
              Uploaded Documents
            </ThemedText>

            {documents.map((doc) => (
              <View
                key={doc.id}
                style={[
                  styles.documentItem,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    flex: 1,
                  }}
                >
                  <Ionicons
                    name="document"
                    size={28}
                    color={colors.textSecondary}
                  />
                  <View style={{ flex: 1 }}>
                    <ThemedText style={styles.documentName}>
                      {doc.name}
                    </ThemedText>
                    <ThemedText style={styles.documentDate}>
                      {doc.uploadDate}
                    </ThemedText>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Ionicons
                    name={getStatusIcon(doc.status)}
                    size={20}
                    color={getStatusColor(doc.status)}
                  />
                  <ThemedText
                    style={{
                      color: getStatusColor(doc.status),
                      fontWeight: "600",
                      fontSize: 12,
                      textTransform: "capitalize",
                    }}
                  >
                    {doc.status}
                  </ThemedText>
                </View>
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      </Modal>

      {/* TERMS & CONDITIONS MODAL */}
      <Modal
        visible={termsModalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={handleCloseTerms}
      >
        <StatusBar hidden={true} />

        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={0.7}
          onPress={handleCloseTerms}
        />

        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: termsSlideAnim }],
              backgroundColor: colors.background,
            },
          ]}
        >
          <View
            style={[styles.modalHeader, { borderBottomColor: colors.border }]}
          >
            <TouchableOpacity
              onPress={handleCloseTerms}
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
              Terms & Conditions
            </ThemedText>
            <View
              style={{
                width: 50,
                height: 50,
              }}
            />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalContent}
          >
            <ThemedText style={styles.termsContent}>
              {`1. User Agreement\n\nBy using our service, you agree to our terms and conditions.\n\n2. Service Description\n\nWe provide water delivery services to customers in selected areas.\n\n3. User Responsibilities\n\nUsers are responsible for providing accurate information during registration and maintaining the confidentiality of their account.\n\n4. Payment Terms\n\nPayment must be made as per the selected payment method. Cancellations must be made 2 hours before delivery.\n\n5. Delivery Terms\n\nDeliveries are made during business hours. Additional charges may apply for areas outside our service zone.\n\n6. Limitation of Liability\n\nWe are not liable for any indirect or consequential damages arising from your use of our service.\n\n7. Modification of Terms\n\nWe reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.\n\n8. Governing Law\n\nThese terms are governed by applicable local laws.`}
            </ThemedText>
          </ScrollView>
        </Animated.View>
      </Modal>

      {/* ADDRESS MODAL */}
      <AddressModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        onSelectAddress={handleSelectAddress}
        savedAddresses={savedAddresses}
        onAddAddress={handleAddAddress}
        initialView="list"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 120,
  },

  header: {
    marginBottom: 24,
  },

  title: {
    fontSize: 52,
    fontWeight: "400",
    marginBottom: 4,
    lineHeight: 60,
  },

  stylingDotOne: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 0,
  },

  stylingDotTwo: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 0,
  },

  stylingDotThree: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderRadius: 0,
  },

  stylingDotFour: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderRadius: 0,
  },

  infoCard: {
    borderRadius: 0,
    padding: 26,
    paddingHorizontal: 30,
    marginBottom: 24,
    borderWidth: 1,
  },

  userInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },

  userInfoLabel: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.7,
  },

  userInfoValue: {
    fontSize: 14,
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },

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

  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000000",
    opacity: 0.5,
  },

  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: screenHeight * 1,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    fontWeight: "600",
    marginBottom: 8,
    opacity: 0.7,
  },

  textInput: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: "500",
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

  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 16,
    borderRadius: 28,
    borderWidth: 2,
    borderStyle: "dashed",
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 8,
  },

  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 38,
    marginBottom: 12,
    borderWidth: 1,
  },

  documentName: {
    fontSize: 16,
    fontWeight: "600",
  },

  documentDate: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },

  termsContent: {
    fontSize: 14,
    lineHeight: 24,
    opacity: 0.8,
    marginBottom: 0,
  },
});
