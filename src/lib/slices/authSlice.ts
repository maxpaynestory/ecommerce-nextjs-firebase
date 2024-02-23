import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User, UserCredential } from "firebase/auth";
import { showError } from "../../helpers/utils";
import firebaseInstance from "../../firebase/firebaseClient";

export interface LoginUserRequest {
  email: string;
  password: string;
}

// authentication for all super admins
export const loginUser = createAsyncThunk<any, LoginUserRequest>(
  "auth/user",
  async (
    values: LoginUserRequest,
    { rejectWithValue }
  ): Promise<UserCredential | any> => {
    try {
      /////// place firebase login code here /////
      const response: UserCredential = await firebaseInstance.signIn(
        values.email,
        values.password
      );
      return { good: true };
    } catch (error: any) {
      return rejectWithValue("Signin Failed");
    }
  }
);

interface LoginStatus {
  error: boolean;
  errorInfo: string;
  pending: boolean;
}

interface SliceState {
  loginStatus: LoginStatus;
  user: User | null;
}

const initialState: SliceState = {
  loginStatus: {
    error: false,
    errorInfo: "",
    pending: false,
  },
  user: null,
};

export const authSlice = createSlice({
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state: SliceState) => {
        state.loginStatus.pending = true;
        state.loginStatus.error = false;
      })
      .addCase(loginUser.fulfilled, (state: SliceState, action) => {
        state.loginStatus.pending = false;
        //state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state: SliceState, action) => {
        state.loginStatus.pending = false;
        state.loginStatus.error = true;
        state.user = null;
        state.loginStatus.errorInfo = "" + action.payload;
        showError("Signin Failed");
      });
  },
  name: "auth",
  initialState: initialState,
  reducers: {
    logout: (state) => {
      firebaseInstance.signOut();
      return initialState;
    },
  },
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;
export const selectUser = (state: any) => state.auth.user;
export const selectLoginUserPending = (state: any) =>
  state.auth.loginStatus.pending;
export const selectLoginUserErrorInfo = (state: any) =>
  state.auth.loginStatus.errorInfo;
export const selectLoginUserError = (state: any) =>
  state.auth.loginStatus.error;
