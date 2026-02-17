import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { LandsState } from '../types';
import {
  fetchLandsThunk,
  fetchLandByIdThunk,
  addLandThunk,
  toggleAvailabilityThunk,
  deleteLandThunk,
} from '../thunks/landsThunk';

const initialState: LandsState = {
  lands: [],
  selectedLand: null,
  filters: { state: '', soilType: '', minPrice: 0, maxPrice: 100000 },
  loading: false,
};

const landsSlice = createSlice({
  name: 'lands',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<LandsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = { state: '', soilType: '', minPrice: 0, maxPrice: 100000 };
    },
    clearSelectedLand: (state) => {
      state.selectedLand = null;
    },
  },
  extraReducers: (builder) => {
    // ─── Fetch All Lands ────────────────────────────────────
    builder
      .addCase(fetchLandsThunk.pending, (state) => { state.loading = true; })
      .addCase(fetchLandsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.lands = action.payload;
      })
      .addCase(fetchLandsThunk.rejected, (state) => { state.loading = false; });

    // ─── Fetch Land By ID ───────────────────────────────────
    builder
      .addCase(fetchLandByIdThunk.pending, (state) => { state.loading = true; })
      .addCase(fetchLandByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedLand = action.payload;
      })
      .addCase(fetchLandByIdThunk.rejected, (state) => { state.loading = false; });

    // ─── Add Land ───────────────────────────────────────────
    builder
      .addCase(addLandThunk.pending, (state) => { state.loading = true; })
      .addCase(addLandThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.lands.push(action.payload);
      })
      .addCase(addLandThunk.rejected, (state) => { state.loading = false; });

    // ─── Toggle Availability ────────────────────────────────
    builder
      .addCase(toggleAvailabilityThunk.fulfilled, (state, action) => {
        const land = state.lands.find((l) => l.id === action.payload);
        if (land) land.available = !land.available;
      });

    // ─── Delete Land ────────────────────────────────────────
    builder
      .addCase(deleteLandThunk.fulfilled, (state, action) => {
        state.lands = state.lands.filter((l) => l.id !== action.payload);
      });
  },
});

export const { setFilters, resetFilters, clearSelectedLand } = landsSlice.actions;
export default landsSlice.reducer;