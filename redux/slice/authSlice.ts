import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@/constants/api";

export type User = {
  uid: string;
  name: string;
  email: string;
  role: string;
  phoneNumber?: string | null;
  token: null;
};

export type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
};

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
};

// 🔹 NAMED EXPORT
export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async (_, { rejectWithValue }) => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) return null;
      return JSON.parse(userData);
    } catch (error: any) {
      console.error("Error Occured", error);
      return rejectWithValue("Failed to restore session");
    }
  }
);

// 🔹 FETCH USER BY ID
export const fetchUserById = createAsyncThunk(
  "auth/fetchUserById",
  async (
    { uid, token }: { uid: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(`${API_URL}/auth/user/${uid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userWithUid = {
        ...response.data.user, 
        uid, 
      };

      return { user: userWithUid };
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      AsyncStorage.setItem("userData", JSON.stringify(action.payload));
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      AsyncStorage.removeItem("userData");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(restoreSession.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(fetchUserById.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setAuthData, logoutUser } = authSlice.actions;
export default authSlice.reducer;
