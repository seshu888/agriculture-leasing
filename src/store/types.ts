// User Types
export interface User {
  id: string;
  name: string;
  mobile: string;
  aadhar: string;
  role: 'owner' | 'seeker';
  isVerified: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  tempMobile: string;
  tempRole: 'owner' | 'seeker' | null;
  otpVerified: boolean;
  loading: boolean;
}

// Land Types
export interface Land {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerMobile: string;
  title: string;
  location: {
    state: string;
    district: string;
    village: string;
    pincode: string;
  };
  /** Latitude for map display (optional, e.g. from Leaflet) */
  latitude?: number;
  /** Longitude for map display (optional) */
  longitude?: number;
  area: number;
  soilType: 'loamy' | 'clay' | 'sandy' | 'red' | 'black' | 'alluvial';
  waterSource: 'borewell' | 'canal' | 'river' | 'rainwater' | 'mixed';
  crops: string[];
  pricePerAcre: number;
  pricePerMonth: number;
  minLeasePeriod: number;
  maxLeasePeriod: number;
  description: string;
  images: string[];
  available: boolean;
  createdAt: string;
  facilities: string[];
}

export interface LandsState {
  lands: Land[];
  selectedLand: Land | null;
  filters: {
    state: string;
    soilType: string;
    minPrice: number;
    maxPrice: number;
  };
  loading: boolean;
}

// Lease Request Types
export interface LeaseRequest {
  id: string;
  landId: string;
  seekerId: string;
  seekerName: string;
  seekerMobile: string;
  ownerId: string;
  ownerName: string;
  ownerMobile: string;
  leasePeriod: number;
  proposedPrice: number;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface RequestsState {
  requests: LeaseRequest[];
  myRequests: LeaseRequest[];
  receivedRequests: LeaseRequest[];
  loading: boolean;
}

// Chat Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage: Message | null;
  unreadCount: number;
}

export interface ChatState {
  conversations: Conversation[];
  messages: { [conversationId: string]: Message[] };
  activeConversation: string | null;
  loading: boolean;
}

// Root State
export interface RootState {
  auth: AuthState;
  lands: LandsState;
  requests: RequestsState;
  chat: ChatState;
}