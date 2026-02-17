import { createAsyncThunk } from '@reduxjs/toolkit';
import type { LeaseRequest } from '../types';
import { dummyRequests } from '../../data/dummyData';

// ─── Fetch All Requests ───────────────────────────────────────
export const fetchRequestsThunk = createAsyncThunk(
  'requests/fetchAll',
  async () => {
    await new Promise((res) => setTimeout(res, 800));
    // In real app: const res = await axios.get('/api/requests')
    return dummyRequests;
  }
);

// ─── Fetch Requests By Seeker ─────────────────────────────────
export const fetchMyRequestsThunk = createAsyncThunk(
  'requests/fetchBySeeker',
  async (seekerId: string) => {
    await new Promise((res) => setTimeout(res, 600));
    // In real app: const res = await axios.get(`/api/requests?seekerId=${seekerId}`)
    return dummyRequests.filter((r) => r.seekerId === seekerId);
  }
);

// ─── Fetch Requests By Owner ──────────────────────────────────
export const fetchReceivedRequestsThunk = createAsyncThunk(
  'requests/fetchByOwner',
  async (ownerId: string) => {
    await new Promise((res) => setTimeout(res, 600));
    // In real app: const res = await axios.get(`/api/requests?ownerId=${ownerId}`)
    return dummyRequests.filter((r) => r.ownerId === ownerId);
  }
);

// ─── Create Request ───────────────────────────────────────────
export const createRequestThunk = createAsyncThunk(
  'requests/create',
  async (req: Omit<LeaseRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    await new Promise((res) => setTimeout(res, 1000));
    // In real app: const res = await axios.post('/api/requests', req)
    const newRequest: LeaseRequest = {
      ...req,
      id: `req_${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dummyRequests.push(newRequest);
    return newRequest;
  }
);

// ─── Update Request Status ────────────────────────────────────
export const updateRequestStatusThunk = createAsyncThunk(
  'requests/updateStatus',
  async (payload: { requestId: string; status: 'approved' | 'rejected' }) => {
    await new Promise((res) => setTimeout(res, 800));
    // In real app: await axios.patch(`/api/requests/${payload.requestId}`, { status: payload.status })
    return payload;
  }
);