export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  subscription_tier: 'free' | 'basic' | 'pro' | 'enterprise';
  subscription_status: 'active' | 'inactive' | 'cancelled' | 'trial';
  trial_ends_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SocialAccount {
  id: string;
  user_id: string;
  platform: 'instagram' | 'facebook' | 'linkedin' | 'youtube' | 'pinterest' | 'tiktok' | 'twitter' | 'snapchat' | 'twitch';
  account_id: string;
  account_name: string;
  account_avatar?: string;
  is_active: boolean;
  connected_at: string;
  last_sync_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ScheduledPost {
  id: string;
  user_id: string;
  content: string;
  media_urls: string[];
  scheduled_for: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  published_at?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface Analytics {
  id: string;
  social_account_id: string;
  date: string;
  followers_count: number;
  posts_count: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  impressions: number;
  reach: number;
  engagement_rate: number;
  created_at: string;
}
