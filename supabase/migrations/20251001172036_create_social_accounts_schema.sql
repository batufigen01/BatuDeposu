/*
  # Social Media Management Platform Schema

  ## Overview
  This migration creates the complete database schema for a social media management platform
  with user authentication, social account connections, post scheduling, and analytics tracking.

  ## 1. New Tables
  
  ### `profiles`
  - `id` (uuid, primary key) - References auth.users
  - `email` (text) - User email
  - `full_name` (text) - User's full name
  - `subscription_tier` (text) - Subscription level: 'free', 'basic', 'pro', 'enterprise'
  - `subscription_status` (text) - Status: 'active', 'inactive', 'cancelled', 'trial'
  - `trial_ends_at` (timestamptz) - Trial expiration date
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `social_accounts`
  - `id` (uuid, primary key) - Unique account identifier
  - `user_id` (uuid, foreign key) - References profiles(id)
  - `platform` (text) - Platform name: 'instagram', 'facebook', 'linkedin', etc.
  - `account_id` (text) - Platform-specific account ID
  - `account_name` (text) - Display name/username
  - `account_avatar` (text) - Avatar URL
  - `is_active` (boolean) - Connection status
  - `connected_at` (timestamptz) - Connection timestamp
  - `last_sync_at` (timestamptz) - Last data sync timestamp
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `scheduled_posts`
  - `id` (uuid, primary key) - Unique post identifier
  - `user_id` (uuid, foreign key) - References profiles(id)
  - `content` (text) - Post content/caption
  - `media_urls` (text[]) - Array of media file URLs
  - `scheduled_for` (timestamptz) - Scheduled publication time
  - `status` (text) - Status: 'draft', 'scheduled', 'published', 'failed'
  - `published_at` (timestamptz) - Actual publication timestamp
  - `error_message` (text) - Error details if failed
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `post_targets`
  - `id` (uuid, primary key) - Unique target identifier
  - `post_id` (uuid, foreign key) - References scheduled_posts(id)
  - `social_account_id` (uuid, foreign key) - References social_accounts(id)
  - `platform_post_id` (text) - Platform-specific post ID after publishing
  - `status` (text) - Status: 'pending', 'published', 'failed'
  - `error_message` (text) - Error details if failed
  - `created_at` (timestamptz)

  ### `analytics`
  - `id` (uuid, primary key) - Unique analytics record identifier
  - `social_account_id` (uuid, foreign key) - References social_accounts(id)
  - `date` (date) - Analytics date
  - `followers_count` (integer) - Total followers
  - `posts_count` (integer) - Total posts on this date
  - `likes_count` (integer) - Total likes received
  - `comments_count` (integer) - Total comments received
  - `shares_count` (integer) - Total shares received
  - `impressions` (integer) - Total impressions
  - `reach` (integer) - Total reach
  - `engagement_rate` (numeric) - Engagement rate percentage
  - `created_at` (timestamptz)

  ## 2. Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Authenticated users required for all operations
  - Proper ownership checks on all related data

  ## 3. Indexes
  - Performance indexes on frequently queried columns
  - Foreign key indexes for join optimization
  - Composite indexes for common query patterns

  ## 4. Important Notes
  - Access tokens for OAuth are NOT stored in this schema for security
  - Token storage should be handled by a secure backend service
  - This schema focuses on metadata and user-facing data only
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'pro', 'enterprise')),
  subscription_status text DEFAULT 'trial' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'trial')),
  trial_ends_at timestamptz DEFAULT (now() + interval '14 days'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create social_accounts table
CREATE TABLE IF NOT EXISTS social_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform text NOT NULL CHECK (platform IN ('instagram', 'facebook', 'linkedin', 'youtube', 'pinterest', 'tiktok', 'twitter', 'snapchat', 'twitch')),
  account_id text NOT NULL,
  account_name text NOT NULL,
  account_avatar text,
  is_active boolean DEFAULT true,
  connected_at timestamptz DEFAULT now(),
  last_sync_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, platform, account_id)
);

-- Create scheduled_posts table
CREATE TABLE IF NOT EXISTS scheduled_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  media_urls text[] DEFAULT '{}',
  scheduled_for timestamptz NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  published_at timestamptz,
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create post_targets table
CREATE TABLE IF NOT EXISTS post_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES scheduled_posts(id) ON DELETE CASCADE,
  social_account_id uuid NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  platform_post_id text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'failed')),
  error_message text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, social_account_id)
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  social_account_id uuid NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  date date NOT NULL,
  followers_count integer DEFAULT 0,
  posts_count integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  shares_count integer DEFAULT 0,
  impressions integer DEFAULT 0,
  reach integer DEFAULT 0,
  engagement_rate numeric(5,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  UNIQUE(social_account_id, date)
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for social_accounts
CREATE POLICY "Users can view own social accounts"
  ON social_accounts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own social accounts"
  ON social_accounts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own social accounts"
  ON social_accounts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own social accounts"
  ON social_accounts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for scheduled_posts
CREATE POLICY "Users can view own scheduled posts"
  ON scheduled_posts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scheduled posts"
  ON scheduled_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scheduled posts"
  ON scheduled_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scheduled posts"
  ON scheduled_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for post_targets
CREATE POLICY "Users can view own post targets"
  ON post_targets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM scheduled_posts
      WHERE scheduled_posts.id = post_targets.post_id
      AND scheduled_posts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own post targets"
  ON post_targets FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM scheduled_posts
      WHERE scheduled_posts.id = post_targets.post_id
      AND scheduled_posts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own post targets"
  ON post_targets FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM scheduled_posts
      WHERE scheduled_posts.id = post_targets.post_id
      AND scheduled_posts.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM scheduled_posts
      WHERE scheduled_posts.id = post_targets.post_id
      AND scheduled_posts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own post targets"
  ON post_targets FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM scheduled_posts
      WHERE scheduled_posts.id = post_targets.post_id
      AND scheduled_posts.user_id = auth.uid()
    )
  );

-- RLS Policies for analytics
CREATE POLICY "Users can view own analytics"
  ON analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM social_accounts
      WHERE social_accounts.id = analytics.social_account_id
      AND social_accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own analytics"
  ON analytics FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM social_accounts
      WHERE social_accounts.id = analytics.social_account_id
      AND social_accounts.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_social_accounts_user_id ON social_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON social_accounts(platform);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_user_id ON scheduled_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_status ON scheduled_posts(status);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_scheduled_for ON scheduled_posts(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_post_targets_post_id ON post_targets(post_id);
CREATE INDEX IF NOT EXISTS idx_post_targets_social_account_id ON post_targets(social_account_id);
CREATE INDEX IF NOT EXISTS idx_analytics_social_account_id ON analytics(social_account_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_accounts_updated_at BEFORE UPDATE ON social_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_posts_updated_at BEFORE UPDATE ON scheduled_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();