import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "@/constants/api";

export type Location = {
  latitude: number;
  longitude: number;
  address: string;
};

export type Request = {
  id: string;
  uid: string;
  phoneNumber: string;
  name: string;
  customerId: string;
  litres: number;
  location: Location;
  price: number;
  distance: number;
  date: string;
  status: "pending" | "confirmed" | "delivered";
  createdAt: number;
  deliveredAt?: number;
};

export type RequestState = {
  currentRequest: Request | null;
  customerRequests: Request[];
  loading: boolean;
  error: string | null;
  success: boolean;
};

const initialState: RequestState = {
  currentRequest: null,
  customerRequests: [],
  loading: false,
  error: null,
  success: false,
};

// 🔹 CREATE REQUEST
export const createRequest = createAsyncThunk(
  "requests/createRequest",
  async (
    { litres, location, token, uid, date }: { litres: number; location: Location; token: string; uid: string, date: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${API_URL}/customer/request/${uid}`,
        { litres, location, date },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("❌ Create request error:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      return rejectWithValue(
        error?.response?.data?.message || "Failed to create request"
      );
    }
  }
);

// 🔹 GET REQUEST BY ID
export const getRequestById = createAsyncThunk(
  "requests/getRequestById",
  async (
    { requestId, token }: { requestId: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${API_URL}/customer/request/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("❌ Get request error:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch request"
      );
    }
  }
);

// 🔹 GET CUSTOMER REQUESTS
export const getCustomerRequests = createAsyncThunk(
  "requests/getCustomerRequests",
  async (
    { token, uid }: { token: string, uid: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${API_URL}/customer/requests/${uid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("MY REQUESTS DATA", response.data)

      return response.data;
    } catch (error: any) {
      console.error("❌ Get customer requests error:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch customer requests"
      );
    }
  }
);

// 🔹 CONFIRM DELIVERY
export const confirmDelivery = createAsyncThunk(
  "requests/confirmDelivery",
  async (
    { requestId, token }: { requestId: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${API_URL}/requests/confirm-delivery`,
        { requestId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("❌ Confirm delivery error:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      return rejectWithValue(
        error?.response?.data?.message || "Failed to confirm delivery"
      );
    }
  }
);

const requestSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetCurrentRequest: (state) => {
      state.currentRequest = null;
    },
  },
  extraReducers: (builder) => {
    // CREATE REQUEST
    builder
      .addCase(createRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentRequest = action.payload;
      })
      .addCase(createRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });

    // GET REQUEST BY ID
    builder
      .addCase(getRequestById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRequestById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRequest = action.payload;
      })
      .addCase(getRequestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // GET CUSTOMER REQUESTS
    builder
      .addCase(getCustomerRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomerRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.customerRequests = action.payload;
      })
      .addCase(getCustomerRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // CONFIRM DELIVERY
    builder
      .addCase(confirmDelivery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmDelivery.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (state.currentRequest) {
          state.currentRequest.status = "delivered";
          state.currentRequest.deliveredAt = Date.now();
        }
      })
      .addCase(confirmDelivery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccess, resetCurrentRequest } = requestSlice.actions;
export default requestSlice.reducer;