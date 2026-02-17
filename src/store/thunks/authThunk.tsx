import { createAsyncThunk } from '@reduxjs/toolkit';
import type { User } from '../types';
import { dummyUsers } from '../../data/dummyData';

// ─── Send OTP ─────────────────────────────────────────────────
export const sendOTPThunk = createAsyncThunk(
  'auth/sendOTP',
  async (payload: { mobile: string; role: 'owner' | 'seeker' }) => {
    // Simulate API delay
    await new Promise((res) => setTimeout(res, 1000));
    // In real app: await axios.post('/api/auth/send-otp', payload)
    return payload;
  }
);

// ─── Verify OTP ───────────────────────────────────────────────
export const verifyOTPThunk = createAsyncThunk(
  'auth/verifyOTP',
  async (otp: string) => {
    await new Promise((res) => setTimeout(res, 1000));
    // In real app: await axios.post('/api/auth/verify-otp', { otp })
    if (otp.length !== 6) throw new Error('Invalid OTP');
    return otp;
  }
);

// ─── Verify Aadhar ────────────────────────────────────────────
export const verifyAadharThunk = createAsyncThunk(
  'auth/verifyAadhar',
  async (payload: {
    aadhar: string;
    name: string;
    mobile: string;
    role: 'owner' | 'seeker' | null;
  }) => {
    await new Promise((res) => setTimeout(res, 1500));
    // In real app: await axios.post('/api/auth/verify-aadhar', payload)

    // Check if user exists in dummy data
    const existing = dummyUsers.find((u) => u.mobile === payload.mobile);
    if (existing) return existing;

    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: payload.name,
      mobile: payload.mobile,
      aadhar: payload.aadhar,
      role: payload.role!,
      isVerified: true,
      createdAt: new Date().toISOString(),
    };
    dummyUsers.push(newUser);
    return newUser;
  }
);