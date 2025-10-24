export interface Participant {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  referral_code: string;
  referred_by?: string;
  registration_date: string;
  progress: number;
  shares: number;
  total_actions?: number;
  total_shares?: number;
  total_referrals?: number;
  facebook_followed?: boolean;
  instagram_followed?: boolean;
  youtube_followed?: boolean;
  tiktok_followed?: boolean;
  twitter_followed?: boolean;
  facebook_channel_followed?: boolean;
}

export interface SocialAction {
  id: number;
  participant_id: number;
  platform: string;
  action_type: 'follow' | 'share';
  action_date: string;
}

export interface ContestSettings {
  id: number;
  contest_title: string;
  contest_end_date?: string;
  prize_description: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  tiktok_url: string;
  twitter_url: string;
  facebook_channel_url: string;
  updated_at: string;
}

export interface Winner {
  id: number;
  participant_id: number;
  position: number;
  draw_date: string;
  announced: boolean;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
}

export interface ContestStats {
  total: number;
  completed: number;
  total_shares: number;
  total_referrals: number;
}

export interface CityStats {
  city: string;
  count: number;
}

export interface DailyRegistration {
  date: string;
  count: number;
}

export interface SocialPlatform {
  name: string;
  url: string;
  followed: boolean;
  icon: string;
  color: string;
}

export interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  city: string;
  referredBy?: string;
}

export interface ProgressUpdate {
  platform: string;
  action: 'follow' | 'share';
}
