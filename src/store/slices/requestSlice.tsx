import { createSlice } from '@reduxjs/toolkit';
import type { RequestsState } from '../types';
import {
  fetchRequestsThunk,
  fetchMyRequestsThunk,
  fetchReceivedRequestsThunk,
  createRequestThunk,
  updateRequestStatusThunk,
} from '../thunks/requestThunk';

const initialState: RequestsState = {
  requests: [],
  myRequests: [],
  receivedRequests: [],
  loading: false,
};

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ─── Fetch All Requests ─────────────────────────────────
    builder
      .addCase(fetchRequestsThunk.pending, (state) => { state.loading = true; })
      .addCase(fetchRequestsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchRequestsThunk.rejected, (state) => { state.loading = false; });

    // ─── Fetch My Requests (Seeker) ─────────────────────────
    builder
      .addCase(fetchMyRequestsThunk.pending, (state) => { state.loading = true; })
      .addCase(fetchMyRequestsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.myRequests = action.payload;
      })
      .addCase(fetchMyRequestsThunk.rejected, (state) => { state.loading = false; });

    // ─── Fetch Received Requests (Owner) ────────────────────
    builder
      .addCase(fetchReceivedRequestsThunk.pending, (state) => { state.loading = true; })
      .addCase(fetchReceivedRequestsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.receivedRequests = action.payload;
      })
      .addCase(fetchReceivedRequestsThunk.rejected, (state) => { state.loading = false; });

    // ─── Create Request ─────────────────────────────────────
    builder
      .addCase(createRequestThunk.pending, (state) => { state.loading = true; })
      .addCase(createRequestThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.requests.push(action.payload);
        state.myRequests.push(action.payload);
      })
      .addCase(createRequestThunk.rejected, (state) => { state.loading = false; });

    // ─── Update Request Status ──────────────────────────────
    builder
      .addCase(updateRequestStatusThunk.pending, (state) => { state.loading = true; })
      .addCase(updateRequestStatusThunk.fulfilled, (state, action) => {
        state.loading = false;
        const update = (arr: typeof state.requests) => {
          const req = arr.find((r) => r.id === action.payload.requestId);
          if (req) {
            req.status = action.payload.status;
            req.updatedAt = new Date().toISOString();
          }
        };
        update(state.requests);
        update(state.receivedRequests);
      })
      .addCase(updateRequestStatusThunk.rejected, (state) => { state.loading = false; });
  },
});

export default requestsSlice.reducer;