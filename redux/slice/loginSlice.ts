import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "@/constants/api";
import { setAuthData } from "./authSlice";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    { email, password }: { email: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      // IF SUCCESSFUL → SAVE TO GLOBAL AUTH
      dispatch(setAuthData(response.data));

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed. Try again."
      );
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState: { loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      });
  },
});

export default loginSlice.reducer;
