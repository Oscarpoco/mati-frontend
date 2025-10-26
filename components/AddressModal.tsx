// AddressModal.tsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  FlatList,
  useColorScheme,
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store/store";
import {
  addLocationToUser,
  Location,
  selectLocation,
  fetchUserById,
} from "../redux/slice/locationSlice";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import LoadingBanner from "./ui/LoadingBanner";

interface AddressModalProps {
  visible: boolean;
  onClose: () => void;
  initialView?: "list" | "form";
}

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

const PROVINCES = [
  { label: "Western Cape", value: "western_cape" },
  { label: "Eastern Cape", value: "eastern_cape" },
  { label: "Northern Cape", value: "northern_cape" },
  { label: "Free State", value: "free_state" },
  { label: "KwaZulu-Natal", value: "kwazulu_natal" },
  { label: "Gauteng", value: "gauteng" },
  { label: "Limpopo", value: "limpopo" },
  { label: "Mpumalanga", value: "mpumalanga" },
  { label: "North West", value: "north_west" },
];

export default function AddressModal({
  visible,
  onClose,
  initialView = "list",
}: AddressModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const dispatch = useDispatch<AppDispatch>();

  const { user, token } = useSelector((state: RootState) => state.auth);
  const { locations, selectedLocation, loading } = useSelector(
    (state: RootState) => state.location
  );

  const [currentView, setCurrentView] = useState<"list" | "form">(initialView);
  const [formData, setFormData] = useState({
    province: "",
    city: "",
    suburb: "",
    streetName: "",
    streetNumber: "",
    postalCode: "",
    label: "Home",
  });

  const [provinces, setProvinces] = useState<
    { label: string; value: string }[]
  >([]);
  const [cities, setCities] = useState<{ label: string; value: string }[]>([]);
  const [suburbs, setSuburbs] = useState<{ label: string; value: string }[]>(
    []
  );
  const [loadingGeo, setLoadingGeo] = useState(false);

  useEffect(() => {
    if (user?.uid && token) {
      dispatch(fetchUserById({ uid: user.uid, token }));
    }
    fetchProvinces();
  }, [dispatch, user?.uid, token]);

  const fetchProvinces = () => {
    setProvinces(PROVINCES);
  };

  const fetchCities = async (province: string) => {
    setCities([]);
    setSuburbs([]);
    setLoadingGeo(true);

    const provinceLabel =
      PROVINCES.find((p) => p.value === province)?.label || "";
    const query = `cities in ${provinceLabel}, South Africa`;

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
          query
        )}&key=${GOOGLE_MAPS_API_KEY}&region=za`
      );
      const data = await response.json();

      const cityList = (data.results || []).slice(0, 200).map((item: any) => ({
        label: item.name,
        value: item.name,
      }));

      setCities(cityList);
    } catch (error) {
      console.error("Error fetching cities:", error);
      Alert.alert("Error", "Failed to load cities. Check your Google API key.");
    } finally {
      setLoadingGeo(false);
    }
  };

  const fetchSuburbs = async (cityName: string) => {
    setLoadingGeo(true);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=suburbs+in+${encodeURIComponent(
          cityName
        )},+South+Africa&key=${GOOGLE_MAPS_API_KEY}&region=za`
      );
      const data = await response.json();

      const suburbList = (data.results || []).slice(0, 200).map((item: any) => ({
        label: item.name,
        value: item.name,
      }));

      setSuburbs(suburbList);
    } catch (error) {
      console.error("Error fetching suburbs:", error);
    } finally {
      setLoadingGeo(false);
    }
  };

  const buildFullAddress = () => {
    const parts = [
      formData.streetNumber,
      formData.streetName,
      formData.suburb,
      formData.city,
      formData.postalCode,
    ].filter(Boolean);
    return parts.join(", ");
  };

  const validateForm = () => {
    if (!formData.province || !formData.city || !formData.streetName) {
      Alert.alert("Validation Error", "Please fill in all required fields");
      return false;
    }
    return true;
  };

  const getCoordinates = async (address: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${GOOGLE_MAPS_API_KEY}&region=za`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return { latitude: location.lat, longitude: location.lng };
      }
    } catch (error) {
      console.error("Error getting coordinates:", error);
    }
    return { latitude: 0, longitude: 0 };
  };

  const handleAddAddress = async () => {
    if (!validateForm() || !user || !token) return;

    const fullAddress = buildFullAddress();
    const coords = await getCoordinates(fullAddress);

    const newLocation: Location = {
      id: `${Date.now()}`,
      address: fullAddress,
      latitude: coords.latitude,
      longitude: coords.longitude,
      label: formData.label,
      isDefault: locations.length === 0,
      createdAt: Date.now(),
    };

    try {
      await dispatch(
        addLocationToUser({
          uid: user.uid,
          location: newLocation,
          token,
        })
      ).unwrap();

      resetForm();
      Alert.alert("Success", "Address added successfully");
    } catch (err: any) {
      Alert.alert("Error", err || "Failed to add address. Please try again.");
    }
  };

  const handleSelectAddress = (location: Location) => {
    dispatch(selectLocation(location));
    onClose();
  };

  const resetForm = () => {
    setFormData({
      province: "",
      city: "",
      suburb: "",
      streetName: "",
      streetNumber: "",
      postalCode: "",
      label: "Home",
    });
    setCurrentView("list");
  };

  const renderListView = () => (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            resetForm();
            onClose();
          }}
          style={[styles.backButton, { backgroundColor: colors.tint }]}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Addresses</ThemedText>
        <View style={{ width: 50 }} />
      </View>

      <FlatList
        data={locations}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 100,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelectAddress(item)}
            activeOpacity={0.6}
          >
            <View
              style={[
                styles.addressCard,
                {
                  backgroundColor: colors.card,
                  borderColor:
                    selectedLocation?.id === item.id
                      ? colors.tint
                      : colors.border,
                  borderWidth: selectedLocation?.id === item.id ? 2 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.button },
                ]}
              >
                <Ionicons name="location" size={20} color={colors.warningRed} />
              </View>

              <View style={styles.addressDetails}>
                <ThemedText style={styles.addressLabel}>
                  {item.label}
                </ThemedText>
                <ThemedText
                  style={[styles.addressText, { color: colors.textSecondary }]}
                  numberOfLines={2}
                >
                  {item.address}
                </ThemedText>
              </View>

              {selectedLocation?.id === item.id && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={colors.tint}
                />
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View
              style={[
                styles.emptyIconBox,
                { backgroundColor: colors.tint + "15" },
              ]}
            >
              <Ionicons name="location-outline" size={40} color={colors.tint} />
            </View>
            <ThemedText style={styles.emptyText}>No addresses yet</ThemedText>
            <ThemedText
              style={[styles.emptySubtext, { color: colors.textSecondary }]}
            >
              Add your first address to get started
            </ThemedText>
          </View>
        }
      />

      <TouchableOpacity
        onPress={() => setCurrentView("form")}
        disabled={loading}
        style={[
          styles.fab,
          {
            backgroundColor: colors.tint,
            opacity: loading ? 0.6 : 1,
          },
        ]}
      >
        <Ionicons name="add" size={28} color={colors.background} />
      </TouchableOpacity>
    </View>
  );

  const renderFormView = () => (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setCurrentView("list")}
          style={[styles.backButton, { backgroundColor: colors.tint }]}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Add Address</ThemedText>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView
        style={styles.formContainer}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>
            Province <ThemedText style={{ color: "#FF6B6B" }}>*</ThemedText>
          </ThemedText>
          <View
            style={[
              styles.dropdownContainer,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <RNPickerSelect
              items={provinces}
              onValueChange={(value) => {
                setFormData({
                  ...formData,
                  province: value,
                  city: "",
                  suburb: "",
                });
                fetchCities(value);
              }}
              value={formData.province}
              placeholder={{ label: "Select Province", value: null }}
              style={{
                inputIOS: {
                  color: colors.text,
                  fontSize: 16,
                  paddingVertical: 16,
                },
                inputAndroid: {
                  color: colors.text,
                  fontSize: 16,
                  paddingVertical: 12,
                },
              }}
              useNativeAndroidPickerStyle={false}
              Icon={() => (
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={colors.tint}
                  style={{ marginTop: 13 }}
                />
              )}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>
            City <ThemedText style={{ color: "#FF6B6B" }}>*</ThemedText>
          </ThemedText>
          <View
            style={[
              styles.dropdownContainer,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: formData.province ? 1 : 0.5,
              },
            ]}
          >
            <RNPickerSelect
              items={cities}
              onValueChange={(value) => {
                setFormData({ ...formData, city: value, suburb: "" });
                fetchSuburbs(value);
              }}
              value={formData.city}
              placeholder={{
                label: loadingGeo ? "Loading..." : "Select City",
                value: null,
              }}
              enabled={!!formData.province && !loadingGeo}
              style={{
                inputIOS: {
                  color: colors.text,
                  fontSize: 16,
                  paddingVertical: 12,
                },
                inputAndroid: {
                  color: colors.text,
                  fontSize: 16,
                  paddingVertical: 12,
                },
              }}
              useNativeAndroidPickerStyle={false}
              pickerStyleIOS={{
                backgroundColor: colors.card,
                borderColor: colors.border,
              }}
              Icon={() =>
                loadingGeo ? (
                  <ActivityIndicator size="small" color={colors.tint} style={{ marginTop: 13 }} />
                ) : (
                  <Ionicons
                    name="chevron-down"
                    size={20}
                    color={colors.tint}
                    style={{ marginTop: 13 }}
                  />
                )
              }
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Suburb (Optional)</ThemedText>
          <View
            style={[
              styles.dropdownContainer,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: formData.city ? 1 : 0.5,
              },
            ]}
          >
            <RNPickerSelect
              items={suburbs}
              onValueChange={(value) =>
                setFormData({ ...formData, suburb: value })
              }
              value={formData.suburb}
              placeholder={{ label: "Select Suburb (Optional)", value: null }}
              enabled={!!formData.city && !loadingGeo}
              style={{
                inputIOS: {
                  color: colors.text,
                  fontSize: 16,
                  paddingVertical: 12,
                },
                inputAndroid: {
                  color: colors.text,
                  fontSize: 16,
                  paddingVertical: 12,
                },
              }}
              useNativeAndroidPickerStyle={false}
              pickerStyleIOS={{
                backgroundColor: colors.card,
                borderColor: colors.border,
              }}
              Icon={() => (
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={colors.tint}
                  style={{ marginTop: 13 }}
                />
              )}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Street Number</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="123"
            placeholderTextColor={colors.textSecondary}
            value={formData.streetNumber}
            onChangeText={(text) =>
              setFormData({ ...formData, streetNumber: text })
            }
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>
            Street Name <ThemedText style={{ color: "#FF6B6B" }}>*</ThemedText>
          </ThemedText>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="Main Street"
            placeholderTextColor={colors.textSecondary}
            value={formData.streetName}
            onChangeText={(text) =>
              setFormData({ ...formData, streetName: text })
            }
          />
        </View>

        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Postal Code</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="4001"
            placeholderTextColor={colors.textSecondary}
            value={formData.postalCode}
            onChangeText={(text) =>
              setFormData({ ...formData, postalCode: text })
            }
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Label</ThemedText>
          <View
            style={[
              styles.dropdownContainer,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <RNPickerSelect
              items={[
                { label: "Home", value: "Home" },
                { label: "Work", value: "Work" },
                { label: "Other", value: "Other" },
              ]}
              onValueChange={(value) =>
                setFormData({ ...formData, label: value })
              }
              value={formData.label}
              style={{
                inputIOS: {
                  color: colors.text,
                  fontSize: 16,
                  paddingVertical: 12,
                },
                inputAndroid: {
                  color: colors.text,
                  fontSize: 16,
                  paddingVertical: 12,
                },
              }}
              useNativeAndroidPickerStyle={false}
              pickerStyleIOS={{
                backgroundColor: colors.card,
                borderColor: colors.border,
              }}
              Icon={() => (
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={colors.tint}
                  style={{ marginTop: 13 }}
                />
              )}
            />
          </View>
        </View>

        {buildFullAddress() && (
          <View
            style={[
              styles.previewContainer,
              { backgroundColor: colors.tint + "10", borderColor: colors.tint },
            ]}
          >
            <Ionicons name="information-circle" size={18} color={colors.tint} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <ThemedText style={[styles.previewLabel, { color: colors.tint }]}>
                Preview
              </ThemedText>
              <ThemedText style={styles.previewText}>
                {buildFullAddress()}
              </ThemedText>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.buttonGroup}>
        {!loading && (
          <TouchableOpacity
            onPress={() => setCurrentView("list")}
            style={[
              styles.cancelButton,
              {
                backgroundColor: colors.warningRed,
                borderColor: colors.border,
              },
            ]}
            disabled={loading}
          >
            <Ionicons name="log-out" size={24} color={colors.tint} />
          </TouchableOpacity>
        )}

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
            <View
              style={[styles.saveButton, { backgroundColor: colors.button }]}
            >
              <TouchableOpacity
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: colors.tint,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={handleAddAddress}
              >
                <Ionicons name="save" size={24} color={colors.background} />
              </TouchableOpacity>

              <ThemedText
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.textSecondary,
                  textTransform: "uppercase",
                }}
              >
                save
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
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      {currentView === "list" ? renderListView() : renderFormView()}
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  addressCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginBottom: 12,
    borderRadius: 28,
    borderWidth: 1,
    gap: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  addressDetails: {
    flex: 1,
    gap: 4,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  addressText: {
    fontSize: 12,
    fontWeight: "400",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 38,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 13,
    opacity: 0.6,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 16,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  dropdownContainer: {
    borderRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 14,
    justifyContent: "center",
    height: 50,
  },
  textInput: {
    borderRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: "400",
  },
  previewContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
    borderRadius: 28,
    borderWidth: 1,
    marginBottom: 24,
  },
  previewLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  previewText: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: "space-between",
    alignItems: "center",
  },
  cancelButton: {
    height: 56,
    width: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  saveButton: {
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 32,
    flexDirection: "row",
    padding: 4,
    paddingRight: 25,
    marginBottom: 0,
    flex: 1,
  },
});