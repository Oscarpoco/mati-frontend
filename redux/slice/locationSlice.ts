import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { API_URL } from "@/constants/api";
import axios from "axios";

export type Location = {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  label?: string;
  isDefault?: boolean;
  createdAt: number;
};

export type LocationState = {
  locations: Location[];
  selectedLocation: Location | null;
  loading: boolean;
  error: string | null;
};

const initialState: LocationState = {
  locations: [],
  selectedLocation: null,
  loading: false,
  error: null,
};

// ✅ STANDARDIZE ALL ENDPOINTS
const API_ENDPOINTS = {
  updateUser: (uid: string) => `${API_URL}/auth/update/${uid}`,
  fetchUser: (uid: string) => `${API_URL}/auth/user/${uid}`,
  removeAddress: (uid: string, locationId: string) => 
    `${API_URL}/auth/${uid}/address/${locationId}`,
  setDefault: (uid: string, locationId: string) => 
    `${API_URL}/auth/${uid}/address/${locationId}/default`,
};

// ✅ HELPER: Extract addresses from API response
const extractAddresses = (userData: any): Location[] => {
  try {
    // Handle different response formats
    const data = userData?.data || userData?.user || userData;
    
    // Validate address array
    const addresses = Array.isArray(data?.address) ? data.address : [];
    
    // Type-check each address
    return addresses.filter(
      (addr: any): addr is Location =>
        addr &&
        typeof addr.id === "string" &&
        typeof addr.address === "string" &&
        typeof addr.latitude === "number" &&
        typeof addr.longitude === "number"
    );
  } catch (error) {
    console.error("❌ Error extracting addresses:", error);
    return [];
  }
};

// ✅ HELPER: Update state from user data
const updateStateFromUserData = (state: LocationState, userData: any) => {
  const addresses = extractAddresses(userData);
  state.locations = addresses;

  // Find default location
  const defaultLocation = addresses.find((loc) => loc.isDefault);

  if (defaultLocation) {
    state.selectedLocation = defaultLocation;
  } else if (addresses.length > 0) {
    state.selectedLocation = addresses[0];
  } else {
    state.selectedLocation = null;
  }
};

// 🔹 ADD LOCATION ASYNC THUNK
export const addLocationToUser = createAsyncThunk(
  "location/addLocationToUser",
  async (
    {
      uid,
      location,
      token,
    }: { uid: string; location: Location; token: string },
    { rejectWithValue }
  ) => {
    try {
      console.log("📍 Adding location:", location);

      // Step 1: Add location
      await axios.put(
        API_ENDPOINTS.updateUser(uid),
        { address: [location] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Step 2: Fetch updated user data
      const userResponse = await axios.get(
        API_ENDPOINTS.fetchUser(uid),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Location added successfully");
      return userResponse.data;
    } catch (error: any) {
      console.error("❌ Add location error:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      return rejectWithValue(
        error?.response?.data?.message || "Failed to add location"
      );
    }
  }
);

// 🔹 FETCH USER BY ID
export const fetchUserById = createAsyncThunk(
  "location/fetchUserById",
  async (
    { uid, token }: { uid: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      console.log("📍 Fetching user locations...");

      const response = await axios.get(
        API_ENDPOINTS.fetchUser(uid),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ User fetched successfully");
      return response.data;
    } catch (error: any) {
      console.error("❌ Fetch user error:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

// 🔹 REMOVE LOCATION
export const removeLocationFromUser = createAsyncThunk(
  "location/removeLocationFromUser",
  async (
    {
      uid,
      locationId,
      token,
    }: { uid: string; locationId: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      console.log("📍 Removing location:", locationId);

      // Step 1: Remove location
      await axios.delete(
        API_ENDPOINTS.removeAddress(uid, locationId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Step 2: Fetch updated user
      const userResponse = await axios.get(
        API_ENDPOINTS.fetchUser(uid),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Location removed successfully");
      return userResponse.data;
    } catch (error: any) {
      console.error("❌ Remove location error:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      return rejectWithValue(
        error?.response?.data?.message || "Failed to remove location"
      );
    }
  }
);

// 🔹 SET DEFAULT LOCATION
export const setDefaultLocation = createAsyncThunk(
  "location/setDefaultLocation",
  async (
    {
      uid,
      locationId,
      token,
    }: { uid: string; locationId: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      console.log("📍 Setting default location:", locationId);

      // Step 1: Set as default
      await axios.put(
        API_ENDPOINTS.setDefault(uid, locationId),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Step 2: Fetch updated user
      const userResponse = await axios.get(
        API_ENDPOINTS.fetchUser(uid),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Default location set successfully");
      return userResponse.data;
    } catch (error: any) {
      console.error("❌ Set default location error:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      return rejectWithValue(
        error?.response?.data?.message || "Failed to set default location"
      );
    }
  }
);

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocations: (state, action: PayloadAction<Location[]>) => {
      state.locations = action.payload;
      const defaultLocation = state.locations.find((loc) => loc.isDefault);
      state.selectedLocation = defaultLocation || state.locations[0] || null;
    },
    selectLocation: (state, action: PayloadAction<Location | null>) => {
      state.selectedLocation = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearLocations: (state) => {
      state.locations = [];
      state.selectedLocation = null;
    },
  },
  extraReducers: (builder) => {
    // Add Location
    builder
      .addCase(addLocationToUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLocationToUser.fulfilled, (state, action) => {
        state.loading = false;
        updateStateFromUserData(state, action.payload);
      })
      .addCase(addLocationToUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch User
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        updateStateFromUserData(state, action.payload);
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Remove Location
    builder
      .addCase(removeLocationFromUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeLocationFromUser.fulfilled, (state, action) => {
        state.loading = false;
        updateStateFromUserData(state, action.payload);
      })
      .addCase(removeLocationFromUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Set Default Location
    builder
      .addCase(setDefaultLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDefaultLocation.fulfilled, (state, action) => {
        state.loading = false;
        updateStateFromUserData(state, action.payload);
      })
      .addCase(setDefaultLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setLocations, selectLocation, clearError, clearLocations } =
  locationSlice.actions;
export default locationSlice.reducer;
