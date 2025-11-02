import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "@/constants/api";

export type Provider = {
  name: string;
  phoneNumber: string;
  email: string;
  rating: number;
  totalReviews: number;
  avatar: string;
};

export type Request = {
  requestId: string;
  provider: Provider;
};

export const AcceptRequest = createAsyncThunk(
  "request/acceptRequest",
  async (
    {
      token,
      requestId,
      provider,
    }: {
      token: string;
      requestId: string;
      provider: Provider;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${API_URL}/provider/accept/${requestId}`,
        {
          requestId,
          provider,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { requestId, data: response.data };
    } catch (error: any) {
      console.log("REQUEST ACCEPTED", error);

      return rejectWithValue(
        error.response?.data?.message || "Failed to accept request"
      );
    }
  }
);

export const getAllRequests = createAsyncThunk(
  "requests/getAllRequests",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/provider/requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch requests"
      );
    }
  }
);

const customerRequestsSlice = createSlice({
  name: "requests",
  initialState: {
    requests: [] as Request[],
    fetching: false,
    error: null as string | null,
    success: false,
  },
  reducers: {
    removeRequest: (state, action: PayloadAction<string>) => {
      state.requests = state.requests.filter(
        (req) => req.requestId !== action.payload
      );
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllRequests.pending, (state) => {
        state.fetching = true;
        state.error = null;
      })
      .addCase(getAllRequests.fulfilled, (state, action) => {
        state.fetching = false;
        state.requests = action.payload.requests;
      })
      .addCase(getAllRequests.rejected, (state, action) => {
        state.fetching = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(AcceptRequest.pending, (state) => {
        state.fetching = true;
        state.error = null;
        state.success = false;
      })
      .addCase(AcceptRequest.fulfilled, (state, action) => {
        state.fetching = false;
        state.success = true;

        state.requests = state.requests.filter(
          (req) => req.requestId !== action.payload.requestId
        );
      })
      .addCase(AcceptRequest.rejected, (state, action) => {
        state.fetching = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { removeRequest, clearSuccess } = customerRequestsSlice.actions;
export default customerRequestsSlice.reducer;
