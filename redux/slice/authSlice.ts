import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type User = {
  uid: string;
  name: string;
  email: string;
  role: string;
  phoneNumber?: string | null;
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
        console.error('Error Occured', error)
      return rejectWithValue("Failed to restore session");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state, action: PayloadAction<{ user: User; token: string }>) => {
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
      });
  },
  
});

export const { setAuthData, logoutUser } = authSlice.actions;
export default authSlice.reducer;
