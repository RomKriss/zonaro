// ============================================================
// ZONARO — Tipuri TypeScript centrale
// ============================================================

export type UserRole = 'business' | 'admin';
export type BusinessStatus = 'unclaimed' | 'pending' | 'active' | 'suspended';
export type BusinessPlan = 'free' | 'plus' | 'pro' | 'elite';
export type SubscriptionPlan = 'plus' | 'pro' | 'elite';
export type BillingPeriod = 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired';
export type ReviewType = 'invited' | 'independent';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';
export type ClaimStatus = 'pending' | 'claimed' | 'expired';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  parent_id: string | null;
  order_index: number;
  subcategories?: Category[];
}

export interface Business {
  id: string;
  user_id: string | null;
  name: string;
  cui: string | null;
  slug: string;
  description_short: string | null;
  description_long: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  city: string;
  county: string;
  category_id: string | null;
  status: BusinessStatus;
  verified: boolean;
  plan: BusinessPlan;
  plan_expires_at: string | null;
  youtube_url: string | null;
  profile_views: number;
  phone_clicks: number;
  contact_form_sends: number;
  created_at: string;
  updated_at: string;
  // Relații populate
  category?: Category;
  photos?: Photo[];
  services?: Service[];
  reviews?: Review[];
  avg_rating?: number;
  review_count?: number;
}

export interface Photo {
  id: string;
  business_id: string;
  url: string;
  is_primary: boolean;
  order_index: number;
  created_at: string;
}

export interface Service {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  price_range: string | null;
  order_index: number;
}

export interface Review {
  id: string;
  business_id: string;
  reviewer_name: string;
  reviewer_email: string;
  rating: number;
  comment: string;
  invoice_number: string | null;
  type: ReviewType;
  status: ReviewStatus;
  owner_reply: string | null;
  invite_token: string | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  business_id: string;
  plan: SubscriptionPlan;
  billing_period: BillingPeriod;
  amount: number;
  status: SubscriptionStatus;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  started_at: string;
  expires_at: string | null;
  created_at: string;
}

export interface ClaimRequest {
  id: string;
  business_id: string;
  email: string;
  verification_code: string;
  status: ClaimStatus;
  sent_at: string;
  claimed_at: string | null;
}

export interface ContactMessage {
  id: string;
  business_id: string;
  sender_name: string;
  sender_email: string;
  sender_phone: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

// ============================================================
// Tipuri UI
// ============================================================

export interface PlanConfig {
  id: BusinessPlan;
  name: string;
  price_monthly: number;
  price_yearly: number;
  popular?: boolean;
  features: string[];
  limits: {
    photos: number;
    description_words: number;
    services: number | 'unlimited';
  };
}

export interface SearchFilters {
  query?: string;
  category?: string;
  county?: string;
  city?: string;
  verified?: boolean;
  min_rating?: number;
  plan?: BusinessPlan[];
  sort?: 'relevance' | 'rating' | 'reviews' | 'alphabetic';
  page?: number;
}

export interface SearchResult {
  businesses: Business[];
  total: number;
  page: number;
  per_page: number;
}
