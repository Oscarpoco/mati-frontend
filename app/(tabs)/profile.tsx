// ProfileScreen.tsx
import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  useColorScheme,
  Dimensions,
} from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { Colors, Fonts } from "@/constants/theme";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";

import UserInfoCard from "@/components/UserInfoCard";
import ActionButtons from "@/components/ActionButtons";
import EditDetailsModal from "@/components/EditDetailsModal";
import DocumentsModal from "@/components/DocumentsModal";
import TermsModal from "@/components/TermsModal";
import AddressModal from "@/components/AddressModal";

const { height: screenHeight } = Dimensions.get("window");

interface DispatchFunctions {
  onUpdateUserDetails?: (details: any) => void;
  onLogout?: () => void;
  onAddAddress?: (address: string) => void;
  onSelectAddress?: (address: string) => void;
  onUploadDocument?: (document: any) => void;
}

interface Document {
  id: string;
  name: string;
  status: "approved" | "rejected" | "pending";
  uploadDate: string;
}

interface ProfileScreenProps {
  dispatchFunctions?: DispatchFunctions;
}

export default function ProfileScreen({ dispatchFunctions = {} }: ProfileScreenProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const dispatch = useAppDispatch();

  // 🔹 REDUX AUTH STATE
  const { user } = useAppSelector((state) => state.auth);
  
  // MOCK DATA
  const documents: Document[] = [
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
  ];
  
  const addresses: string[] = [
    "123 Main Street, Downtown",
    "456 Oak Avenue, Midtown",
  ];

  // STATE FOR MODALS
  const [editDetailsModalVisible, setEditDetailsModalVisible] = useState(false);
  const [documentsModalVisible, setDocumentsModalVisible] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);

  // MODAL HANDLERS
  const handleOpenEditDetails = () => setEditDetailsModalVisible(true);
  const handleCloseEditDetails = () => setEditDetailsModalVisible(false);

  const handleOpenDocuments = () => setDocumentsModalVisible(true);
  const handleCloseDocuments = () => setDocumentsModalVisible(false);

  const handleOpenTerms = () => setTermsModalVisible(true);
  const handleCloseTerms = () => setTermsModalVisible(false);

  const handleOpenAddresses = () => setAddressModalVisible(true);
  const handleCloseAddresses = () => setAddressModalVisible(false);

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <ThemedText style={[styles.title, { fontFamily: Fonts.sans }]}>
          Manage
        </ThemedText>
        <ThemedText style={[styles.title, { fontFamily: Fonts.sans }]}>
          Your Profile
        </ThemedText>
      </View>

      {/* MAIN CONTENT */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* USER INFO CARD */}
        <UserInfoCard user={user} colors={colors} />

        {/* ACTION BUTTONS */}
        <ActionButtons
          colors={colors}
          onEditDetails={handleOpenEditDetails}
          onManageAddresses={handleOpenAddresses}
          onDocuments={handleOpenDocuments}
          onTerms={handleOpenTerms}
          onLogout={() => dispatchFunctions.onLogout?.()}
        />
      </ScrollView>

      {/* MODALS */}
      <EditDetailsModal
        visible={editDetailsModalVisible}
        onClose={handleCloseEditDetails}
        user={user}
        colors={colors}
        onSave={(details) => {
          dispatchFunctions.onUpdateUserDetails?.(details);
          handleCloseEditDetails();
        }}
      />

      <DocumentsModal
        visible={documentsModalVisible}
        onClose={handleCloseDocuments}
        documents={documents}
        colors={colors}
        onUpload={(doc) => dispatchFunctions.onUploadDocument?.(doc)}
      />

      <TermsModal
        visible={termsModalVisible}
        onClose={handleCloseTerms}
        colors={colors}
      />

      <AddressModal
        visible={addressModalVisible}
        onClose={handleCloseAddresses}
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
    fontSize: 48,
    fontWeight: "600",
    marginBottom: 4,
    lineHeight: 60,
  },
});