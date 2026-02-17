import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Message } from '../types';
import { dummyMessages } from '../../data/dummyData';

// ─── Fetch Messages ───────────────────────────────────────────
export const fetchMessagesThunk = createAsyncThunk(
  'chat/fetchMessages',
  async (conversationId: string) => {
    await new Promise((res) => setTimeout(res, 500));
    // In real app: const res = await axios.get(`/api/chat/${conversationId}/messages`)
    return {
      conversationId,
      messages: dummyMessages.filter((m) => m.conversationId === conversationId),
    };
  }
);

// ─── Send Message ─────────────────────────────────────────────
export const sendMessageThunk = createAsyncThunk(
  'chat/sendMessage',
  async (payload: {
    conversationId: string;
    senderId: string;
    receiverId: string;
    message: string;
  }) => {
    await new Promise((res) => setTimeout(res, 300));
    // In real app: const res = await axios.post('/api/chat/send', payload)
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      conversationId: payload.conversationId,
      senderId: payload.senderId,
      receiverId: payload.receiverId,
      message: payload.message,
      timestamp: new Date().toISOString(),
      read: false,
    };
    dummyMessages.push(newMessage);
    return newMessage;
  }
);