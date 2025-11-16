
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import LoadingBanner from "@/components/ui/LoadingBanner";

// REDUX
import { logoutUser } from "../redux/slice/authSlice";
import { RootState, AppDispatch } from "@/redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../redux/slice/updateUserDetailsSlice";
import { useAppSelector } from "@/redux/store/hooks";

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
}: ActionButtonsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const uid = useSelector((state: RootState) => state.auth.user?.uid);
  const token = useSelector((state: RootState) => state.auth?.token);
  const loading = useSelector((state: RootState) => state.auth?.loading);
  const dataLoading = useSelector(
    (state: RootState) => state.userDetails?.loading
  );

  const { user } = useAppSelector((state) => state.auth);

  const userType = user?.role;

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleOpenDetails = () => {
    if (!token || !uid) {
      console.warn("Missing token or user UID");
      return;
    }

    dispatch(fetchUserDetails({ uid: uid, token }))
      .unwrap()
      .then(() => onEditDetails())
      .catch((err) => console.error("Fetch user details error:", err));
  };

  return (
    <View>
      {/* EDIT DETAILS */}
      <TouchableOpacity
        style={[
          styles.actionButton,
          { backgroundColor: colors.background, borderColor: colors.border },
        ]}
        onPress={() => handleOpenDetails()}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View
            style={{
              height: 50,
              width: 50,
              backgroundColor: colors.tint,
              borderRadius: 18,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {dataLoading ? (
              <ActivityIndicator size={"small"} color={colors.background} />
            ) : (
              <Ionicons name="create" size={28} color={colors.background} />
            )}
          </View>
          <View>
            <ThemedText style={[styles.actionButtonText, {color: colors.textSecondary}]}>
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
          <View
            style={{
              height: 50,
              width: 50,
              backgroundColor: colors.background,
              borderRadius: 18,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="location" size={28} color={colors.warningRed} />
          </View>
          <View>
            <ThemedText style={[styles.actionButtonText, {color: colors.textSecondary}]}>
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

      {userType === "provider" && (
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
          onPress={onDocuments}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{
                height: 50,
                width: 50,
                backgroundColor: colors.tint,
                borderRadius: 18,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="document" size={28} color={colors.successGreen} />
            </View>
            <View>
              <ThemedText style={[styles.actionButtonText, {color: colors.textSecondary}]}>Documents</ThemedText>
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
      )}

      {/* TERMS & CONDITIONS */}
      <TouchableOpacity
        style={[
          styles.actionButton,
          {
            backgroundColor:
              userType === "provider" ? colors.card : colors.background,
            borderColor: colors.border,
          },
        ]}
        onPress={onTerms}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View
            style={{
              height: 50,
              width: 50,
              backgroundColor: colors.card,
              borderRadius: 18,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="document-text"
              size={28}
              color={colors.textSecondary}
            />
          </View>
          <View>
            <ThemedText style={[styles.actionButtonText, {color: colors.textSecondary}]}>
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

      {loading ? (
        <React.Fragment>
          <LoadingBanner
            loading={loading}
            error={null}
            onPress={() => console.log("Button pressed")}
          />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <View style={[styles.saveButton, { backgroundColor: colors.button }]}>
            <TouchableOpacity
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: colors.warningRed,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={handleLogout}
            >
              <Ionicons name="log-out" size={24} color={colors.tint} />
            </TouchableOpacity>

            <ThemedText
              style={{
                fontSize: 18,
                fontFamily: 'poppinsBold',
                color: colors.textSecondary,
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
                  color={colors.textSecondary}
                  style={{ marginTop: 4 }}
                />
              ))}
            </View>
          </View>
        </React.Fragment>
      )}
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
    fontSize: 18,
    fontFamily: 'poppinsMedium',
  },
  actionButtonSubtext: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
    fontFamily: 'poppinsMedium',
  },
  saveButton: {
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 32,
    flexDirection: "row",
    padding: 4,
    paddingRight: 25,
    marginBottom: 0,
    marginTop: 24,
  },
});
