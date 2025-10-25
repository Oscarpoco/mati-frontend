import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { API_URL } from "@/constants/api";

type RegisterUserData = {
  name: string;
  email: string;
  password: string;
  role?: string;
  phoneNumber?: string;
};

type RegisterState = {
  loading: boolean;
  success: boolean;
  error: string | null;
  message: string | null;
};

const initialState: RegisterState = {
  loading: false,
  success: false,
  error: null,
  message: null,
};

// ✅ Async thunk for register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: RegisterUserData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Registration failed");
      }

      return data; 
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    resetRegisterState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetRegisterState } = registerSlice.actions;
export default registerSlice.reducer;
