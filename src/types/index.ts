export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  credits: number;
  createdAt: string;
}

export interface Wish {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  fulfilledAmount: number;
  isAnonymous: boolean;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  user?: User;
}

export interface Contribution {
  id: string;
  wishId: string;
  userId: string;
  amount: number;
  isAnonymous: boolean;
  createdAt: string;
}

export interface AffiliateLink {
  id: string;
  wishId: string;
  productName: string;
  url: string;
  commissionRate: number;
  clicks: number;
}