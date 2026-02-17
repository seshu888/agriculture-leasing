import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Land } from '../types';
import { dummyLands } from '../../data/dummyData';

// ─── Fetch All Lands ──────────────────────────────────────────
export const fetchLandsThunk = createAsyncThunk(
  'lands/fetchAll',
  async () => {
    await new Promise((res) => setTimeout(res, 800));
    // In real app: const res = await axios.get('/api/lands')
    return dummyLands;
  }
);

// ─── Fetch Land By ID ─────────────────────────────────────────
export const fetchLandByIdThunk = createAsyncThunk(
  'lands/fetchById',
  async (id: string) => {
    await new Promise((res) => setTimeout(res, 500));
    // In real app: const res = await axios.get(`/api/lands/${id}`)
    const land = dummyLands.find((l) => l.id === id);
    if (!land) throw new Error('Land not found');
    return land;
  }
);

// ─── Add Land ─────────────────────────────────────────────────
export const addLandThunk = createAsyncThunk(
  'lands/add',
  async (land: Omit<Land, 'id' | 'createdAt'>) => {
    await new Promise((res) => setTimeout(res, 1000));
    // In real app: const res = await axios.post('/api/lands', land)
    const newLand: Land = {
      ...land,
      id: `land_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    dummyLands.push(newLand);
    return newLand;
  }
);

// ─── Toggle Availability ──────────────────────────────────────
export const toggleAvailabilityThunk = createAsyncThunk(
  'lands/toggleAvailability',
  async (id: string) => {
    await new Promise((res) => setTimeout(res, 500));
    // In real app: await axios.patch(`/api/lands/${id}/toggle`)
    return id;
  }
);

// ─── Delete Land ──────────────────────────────────────────────
export const deleteLandThunk = createAsyncThunk(
  'lands/delete',
  async (id: string) => {
    await new Promise((res) => setTimeout(res, 500));
    // In real app: await axios.delete(`/api/lands/${id}`)
    return id;
  }
);