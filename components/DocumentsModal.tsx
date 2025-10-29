// components/profile/modals/DocumentsModal.tsx
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

interface Document {
  id: string;
  name: string;
  status: "approved" | "rejected" | "pending";
  uploadDate: string;
}

interface DocumentsModalProps {
  visible: boolean;
  onClose: () => void;
  documents: Document[];
  colors: any;
  onUpload: (doc: any) => void;
}

export default function DocumentsModal({
  visible,
  onClose,
  documents,
  colors,
  onUpload,
}: DocumentsModalProps) {
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
            {
              borderBottomColor: colors.border,
              paddingTop: 15,
              justifyContent: "flex-start",
              gap: "20%",
            },
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
            onPress={() => onUpload({})}
          >
            <Ionicons name="cloud-upload" size={24} color={colors.tint} />
            <ThemedText style={{ color: colors.tint, fontWeight: "600" }}>
              Upload New Document
            </ThemedText>
          </TouchableOpacity>

          {documents && documents.length > 0 && (
            <ThemedText style={styles.sectionTitle}>
              Uploaded Documents
            </ThemedText>
          )}

          {documents && documents.length > 0 ? (
            documents.map((doc) => (
              <View
                key={doc.id}
                style={[
                  styles.documentItem,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
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
            ))
          ) : (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <ThemedText
                style={{
                  textAlign: "center",
                  opacity: 0.6,
                  fontSize: 18,
                  textTransform: "capitalize",
                }}
              >
                No documents uploaded
              </ThemedText>
              <Ionicons
                name="document"
                size={80}
                color={colors.textSecondary}
              />
            </View>
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
  uploadButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 12,
    padding: 16,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: "dashed" as const,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    marginBottom: 12,
    marginTop: 8,
  },
  documentItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    padding: 16,
    borderRadius: 28,
    marginBottom: 12,
    borderWidth: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  documentDate: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
};
