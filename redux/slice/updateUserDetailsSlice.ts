import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { API_URL } from "@/constants/api";
import axios from "axios";

export type UserDetails = {
  uid: string;
  name: string;
  phoneNumber: string;
  email?: string;
  createdAt?: number;
  updatedAt?: number;
  rating?: number;
  role?: string;
};

export type UserDetailsState = {
  user: UserDetails | null;
  loading: boolean;
  error: string | null;
  success: boolean;
};

const initialState: UserDetailsState = {
  user: null,
  loading: false,
  error: null,
  success: false,
};

// ✅ STANDARDIZE ALL ENDPOINTS
const API_ENDPOINTS = {
  updateUser: (uid: string) => `${API_URL}/auth/update/${uid}`,
  fetchUser: (uid: string) => `${API_URL}/auth/user/${uid}`,
};

// ✅ HELPER: Extract user details from API response
const extractUserDetails = (userData: any, uidFromAuth?: string): UserDetails | null => {
  try {
    // Handle different response formats
    const data = userData?.data?.user || userData?.data || userData?.user || userData;

    // Type-check user details - uid is optional since API doesn't return it
    if ( 
      data &&
      typeof data.name === "string" &&
      typeof data.phoneNumber === "string"
    ) {
      const userDetails: UserDetails = {
        uid: data.uid, 
        name: data.name,
        phoneNumber: data.phoneNumber,
        email: data.email,
        createdAt: data.createdAt || undefined,
        updatedAt: data.updatedAt || undefined,
        rating: data.rating || undefined,
        role: data.role || undefined,
      };
      return userDetails;
    }

    console.warn("⚠️ Invalid user data format - missing name or phoneNumber:", data);
    return null;
  } catch (error) {
    console.error("❌ Error extracting user details:", error);
    return null;
  }
};

// 🔹 UPDATE USER DETAILS ASYNC THUNK
export const updateUserDetails = createAsyncThunk(
  "userDetails/updateUserDetails",
  async (
    {
      uid,
      name,
      phoneNumber,
      token,
    }: { uid: string; name: string; phoneNumber: string; token: string },
    { rejectWithValue }
  ) => {
    try {

      // Step 1: Update user details (name and phoneNumber only)
      const updateResponse = await axios.put(
        API_ENDPOINTS.updateUser(uid),
        { name, phoneNumber },
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

      // Return with uid attached for extraction
      return { ...userResponse.data};
    } catch (error: any) {
      console.error("❌ Update user details error:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update user details"
      );
    }
  }
);

// 🔹 FETCH USER DETAILS
export const fetchUserDetails = createAsyncThunk(
  "userDetails/fetchUserDetails",
  async (
    { uid, token }: { uid: string; token: string },
    { rejectWithValue }
  ) => {
    try {

      const response = await axios.get(
        API_ENDPOINTS.fetchUser(uid),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    
      // Return with uid attached for extraction
      return { ...response.data};
    } catch (error: any) {
      console.error("❌ Fetch user details error:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch user details"
      );
    }
  }
);

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    setUserDetails: (state, action: PayloadAction<UserDetails | null>) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearUserDetails: (state) => {
      state.user = null;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // ========== UPDATE USER DETAILS ==========
    builder
      .addCase(updateUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const uid = action.payload._uid;
        const userDetails = extractUserDetails(action.payload, uid);
        if (userDetails) {
          state.user = userDetails;
          console.log("✅ Redux state updated with user details:", state.user);
        } else {
          console.warn("⚠️ Failed to extract user details from API response");
        }
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
        console.error("❌ Update rejected:", state.error);
      });

    // ========== FETCH USER DETAILS ==========
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        const uid = action.payload._uid;
        const userDetails = extractUserDetails(action.payload, uid);
        if (userDetails) {
          state.user = userDetails;
          console.log("✅ Redux state updated from fetch:", state.user);
        } else {
          console.warn("⚠️ Failed to extract user details from fetch response");
        }
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("❌ Fetch rejected:", state.error);
      });
  },
});

export const { setUserDetails, clearError, clearSuccess, clearUserDetails } =
  userDetailsSlice.actions;
export default userDetailsSlice.reducer;