import { createSlice } from '@reduxjs/toolkit';
import type { AuthState } from '../types';
import {
  sendOTPThunk,
  verifyOTPThunk,
  verifyAadharThunk,
} from '../thunks/authThunk';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  tempMobile: '',
  tempRole: null,
  otpVerified: false,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loadUser: (state) => {
      const saved = localStorage.getItem('agrilease_user');
      if (saved) {
        state.user = JSON.parse(saved);
        state.isAuthenticated = true;
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.tempMobile = '';
      state.tempRole = null;
      state.otpVerified = false;
      localStorage.removeItem('agrilease_user');
    },
    resetAuthFlow: (state) => {
      state.tempMobile = '';
      state.tempRole = null;
      state.otpVerified = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // ─── Send OTP ───────────────────────────────────────────
    builder
      .addCase(sendOTPThunk.pending, (state) => { state.loading = true; })
      .addCase(sendOTPThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.tempMobile = action.payload.mobile;
        state.tempRole = action.payload.role;
      })
      .addCase(sendOTPThunk.rejected, (state) => { state.loading = false; });

    // ─── Verify OTP ─────────────────────────────────────────
    builder
      .addCase(verifyOTPThunk.pending, (state) => { state.loading = true; })
      .addCase(verifyOTPThunk.fulfilled, (state) => {
        state.loading = false;
        state.otpVerified = true;
      })
      .addCase(verifyOTPThunk.rejected, (state) => { state.loading = false; });

    // ─── Verify Aadhar ──────────────────────────────────────
    builder
      .addCase(verifyAadharThunk.pending, (state) => { state.loading = true; })
      .addCase(verifyAadharThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.tempMobile = '';
        state.tempRole = null;
        state.otpVerified = false;
        localStorage.setItem('agrilease_user', JSON.stringify(action.payload));
      })
      .addCase(verifyAadharThunk.rejected, (state) => { state.loading = false; });
  },
});

export const { loadUser, logout, resetAuthFlow } = authSlice.actions;
export default authSlice.reducer;