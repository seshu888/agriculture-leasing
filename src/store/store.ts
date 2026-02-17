import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import landsReducer from './slices/landSlice';
import requestsReducer from './slices/requestSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lands: landsReducer,
    requests: requestsReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ─── Selectors ────────────────────────────────────────────────
export const selectAuth   = (state: RootState) => state.auth;
export const selectLands  = (state: RootState) => state.lands;
export const selectRequests = (state: RootState) => state.requests;
export const selectChat   = (state: RootState) => state.chat;

// Available lands (for seekers)
export const selectAvailableLands = (state: RootState) =>
  state.lands.lands.filter((land) => land.available);

// Owner's lands
export const selectOwnerLands =
  (ownerId: string) => (state: RootState) =>
    state.lands.lands.filter((land) => land.ownerId === ownerId);

// Filtered lands (with filters applied)
export const selectFilteredLands = (state: RootState) => {
  const { lands, filters } = state.lands;
  return lands.filter((land) => {
    if (filters.state && land.location.state !== filters.state) return false;
    if (filters.soilType && land.soilType !== filters.soilType) return false;
    if (
      land.pricePerMonth < filters.minPrice ||
      land.pricePerMonth > filters.maxPrice
    )
      return false;
    return land.available;
  });
};

// Seeker's sent requests
export const selectMyRequests =
  (seekerId: string) => (state: RootState) =>
    state.requests.requests.filter((req) => req.seekerId === seekerId);

// Owner's received requests
export const selectReceivedRequests =
  (ownerId: string) => (state: RootState) =>
    state.requests.requests.filter((req) => req.ownerId === ownerId);

// Requests for a specific land
export const selectLandRequests =
  (landId: string) => (state: RootState) =>
    state.requests.requests.filter((req) => req.landId === landId);