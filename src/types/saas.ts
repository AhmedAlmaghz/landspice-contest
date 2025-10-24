// src/types/saas.ts
// أنواع البيانات الأساسية لنظام SaaS

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  COMPANY_ADMIN = 'company_admin',
  COMPANY_MANAGER = 'company_manager',
  COMPANY_VIEWER = 'company_viewer',
  PARTICIPANT = 'participant',
}

export enum SubscriptionPlan {
  FREE = 'free',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CANCELLED = 'cancelled',
  SUSPENDED = 'suspended',
}

export enum ContestStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ENDED = 'ended',
  CANCELLED = 'cancelled',
}

export enum ActionType {
  FOLLOW = 'follow',
  LIKE = 'like',
  SHARE = 'share',
  SUBSCRIBE = 'subscribe',
  CUSTOM = 'custom',
}

export enum VerificationMethod {
  MANUAL = 'manual',
  API = 'api',
  WEBHOOK = 'webhook',
}

// ============ Company Types ============
export interface Company {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  logo_url?: string;
  description?: string;
  website_url?: string;
  subscription_plan: SubscriptionPlan;
  subscription_status: SubscriptionStatus;
  subscription_start_date: Date;
  subscription_end_date?: Date;
  settings?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface CreateCompanyInput {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  website_url?: string;
  description?: string;
}

export interface UpdateCompanyInput {
  name?: string;
  phone?: string;
  country?: string;
  city?: string;
  logo_url?: string;
  description?: string;
  website_url?: string;
  settings?: Record<string, any>;
}

// ============ Contest Types ============
export interface Contest {
  id: string;
  company_id: string;
  title: string;
  description?: string;
  banner_url?: string;
  start_date: Date;
  end_date: Date;
  prize_description?: string;
  max_participants?: number;
  require_email_verification: boolean;
  status: ContestStatus;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface CreateContestInput {
  title: string;
  description?: string;
  banner_url?: string;
  start_date: Date;
  end_date: Date;
  prize_description?: string;
  max_participants?: number;
  require_email_verification?: boolean;
}

export interface UpdateContestInput {
  title?: string;
  description?: string;
  banner_url?: string;
  start_date?: Date;
  end_date?: Date;
  prize_description?: string;
  max_participants?: number;
  require_email_verification?: boolean;
}

export interface ContestWithDetails extends Contest {
  platforms: SocialPlatform[];
  participantCount: number;
}

// ============ Social Platform Types ============
export interface SocialPlatform {
  id: string;
  contest_id: string;
  name: string;
  display_name: string;
  url: string;
  icon_url?: string;
  action_type: ActionType;
  action_description?: string;
  auto_verify: boolean;
  verification_method: VerificationMethod;
  order_index: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AddPlatformInput {
  name: string;
  display_name: string;
  url: string;
  icon_url?: string;
  action_type: ActionType;
  action_description?: string;
  auto_verify?: boolean;
  verification_method?: VerificationMethod;
  order_index?: number;
}

export interface UpdatePlatformInput {
  display_name?: string;
  url?: string;
  icon_url?: string;
  action_type?: ActionType;
  action_description?: string;
  auto_verify?: boolean;
  verification_method?: VerificationMethod;
  is_active?: boolean;
}

// ============ Participant Types ============
export interface Participant {
  id: string;
  contest_id: string;
  company_id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  referral_code: string;
  referred_by?: string;
  progress: number;
  shares: number;
  referrals: number;
  email_verified: boolean;
  verified_at?: Date;
  registration_date: Date;
  last_activity_date?: Date;
}

export interface CreateParticipantInput {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  referred_by?: string;
}

// ============ Social Action Types ============
export interface SocialAction {
  id: string;
  participant_id: string;
  platform_id: string;
  contest_id: string;
  action_type: ActionType;
  is_verified: boolean;
  verification_method?: VerificationMethod;
  verified_at?: Date;
  verification_data?: Record<string, any>;
  action_date: Date;
}

export interface VerificationResult {
  verified: boolean;
  reason?: string;
  error?: string;
  verification_data?: Record<string, any>;
}

// ============ Winner Types ============
export interface Winner {
  id: string;
  contest_id: string;
  participant_id: string;
  position: number;
  prize_description?: string;
  draw_date: Date;
  announced: boolean;
  announced_at?: Date;
}

// ============ Auth Types ============
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  company_id?: string;
  permissions: string[];
}

export interface AuthToken {
  user: AuthUser;
  token: string;
  expiresAt: Date;
}

// ============ API Response Types ============
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============ Stats Types ============
export interface ContestStats {
  total_participants: number;
  total_verified: number;
  total_shares: number;
  total_referrals: number;
  completion_rate: number;
  average_progress: number;
}

export interface CompanyStats {
  total_contests: number;
  active_contests: number;
  total_participants: number;
  total_revenue: number;
}
