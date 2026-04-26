// ============================================================
// TYPES — בוחנים השקעות Frontend
// ============================================================

export type UserRole = 'investor' | 'provider' | 'admin';

export type InvestmentType =
  | 'real_estate_local'
  | 'real_estate_secondhand'
  | 'real_estate_presale'
  | 'land'
  | 'real_estate_abroad';

export type ProviderCategory =
  | 'entrepreneur'
  | 'real_estate_developer'
  | 'investment_advisor'
  | 'investor_companion'
  | 'lawyer'
  | 'appraiser'
  | 'contractor';

export type TenderStatus = 'active' | 'closed' | 'cancelled';
export type QuoteStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';
export type SubscriptionTier = 'none' | 'monthly';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  city?: string;
  verified_email: boolean;
  created_at: string;
}

export interface ProviderProfile {
  id: string;
  user_id: string;
  business_name: string;
  category: ProviderCategory;
  bio?: string;
  years_experience: number;
  deals_count: number;
  base_price?: number;
  regions_served: string[];
  avg_rating: number;
  total_reviews: number;
  subscription_tier: SubscriptionTier;
  subscription_expires?: string;
  is_approved: boolean;
  is_featured: boolean;
  gallery_urls: string[];
  license_number?: string;
  created_at: string;
  // Joined
  users?: { full_name: string; city?: string };
  past_deals_list?: PastDeal[];
  reviews?: Review[];
}

export interface Tender {
  id: string;
  investor_id?: string;
  investment_types: InvestmentType[];
  location_city?: string;
  location_country?: string;
  equity_available: string;
  investment_description: string;
  contact_name: string;
  contact_phone: string;
  contact_email?: string;
  is_registered_user: boolean;
  tracking_token: string;
  status: TenderStatus;
  created_at: string;
  // meta
  quotes_count?: number;
  is_blurred?: boolean;
}

export interface Quote {
  id: string;
  tender_id: string;
  provider_id: string;
  price: number;
  price_notes?: string;
  description: string;
  past_deal_reference?: PastDealRef;
  attachments: string[];
  status: QuoteStatus;
  purchase_type: 'single' | 'monthly';
  created_at: string;
  // Joined
  provider_profiles?: ProviderProfile;
  tenders?: Partial<Tender>;
}

export interface PastDealRef {
  title: string;
  deal_type: InvestmentType;
  location: string;
  year: number;
  investment_amount: number;
  return_percentage: number;
  duration_months: number;
}

export interface PastDeal {
  id: string;
  provider_id: string;
  title: string;
  deal_type: InvestmentType;
  location: string;
  year: number;
  investment_amount: number;
  return_percentage: number;
  duration_months: number;
  description?: string;
  images: string[];
  is_public: boolean;
  is_verified: boolean;
  created_at: string;
  // Joined
  provider_profiles?: {
    id: string;
    business_name: string;
    category: ProviderCategory;
    avg_rating: number;
    users?: { full_name: string };
  };
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  professionalism?: number;
  communication?: number;
  reliability?: number;
  provider_reply?: string;
  created_at: string;
  users?: { full_name: string };
}

export interface Message {
  id: string;
  tender_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Form types
export interface TenderFormData {
  investment_types: InvestmentType[];
  location_city?: string;
  location_country?: string;
  equity_available: string;
  investment_description: string;
  contact_name: string;
  contact_phone: string;
  contact_email?: string;
}

export interface QuoteFormData {
  price: number;
  price_notes?: string;
  description: string;
  past_deal_reference?: PastDealRef;
  attachments?: string[];
  purchase_type: 'single' | 'monthly';
  payment_id?: string;
}
