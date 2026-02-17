import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ChatState } from '../types';
import {
  fetchMessagesThunk,
  sendMessageThunk,
} from '../thunks/chatThunk';

const initialState: ChatState = {
  conversations: [],
  messages: {},
  activeConversation: null,
  loading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversation = action.payload;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const msgs = state.messages[action.payload];
      if (msgs) msgs.forEach((m) => (m.read = true));
    },
    clearChat: (state) => {
      state.activeConversation = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // ─── Fetch Messages ─────────────────────────────────────
    builder
      .addCase(fetchMessagesThunk.pending, (state) => { state.loading = true; })
      .addCase(fetchMessagesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.messages[action.payload.conversationId] = action.payload.messages;
      })
      .addCase(fetchMessagesThunk.rejected, (state) => { state.loading = false; });

    // ─── Send Message ───────────────────────────────────────
    builder
      .addCase(sendMessageThunk.pending, (state) => { state.loading = true; })
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { conversationId } = action.payload;
        if (!state.messages[conversationId]) {
          state.messages[conversationId] = [];
        }
        state.messages[conversationId].push(action.payload);
      })
      .addCase(sendMessageThunk.rejected, (state) => { state.loading = false; });
  },
});

export const { setActiveConversation, markAsRead, clearChat } = chatSlice.actions;
export default chatSlice.reducer;