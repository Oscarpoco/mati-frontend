import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserState = {
  name: string | null;
  loggedIn: boolean;
};

const initialState: UserState = {
  name: null,
  loggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
      state.loggedIn = true;
    },
    logout: (state) => {
      state.name = null;
      state.loggedIn = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
