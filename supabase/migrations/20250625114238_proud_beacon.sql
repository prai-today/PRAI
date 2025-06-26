/*
  # PRAI Database Schema Setup

  1. New Tables
    - `profiles` - Extended user profiles with publication credits
    - `publast_sites` - Cache of available publication sites from Publast API  
    - `publications` - Track publication jobs and their status

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Allow all authenticated users to read publast sites

  3. Automation
    - Auto-create profiles when users sign up
    - Grant 1 free credit for Google OAuth signups
    - Auto-update timestamps on record changes
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  free_publications_remaining integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create publast_sites table
CREATE TABLE IF NOT EXISTS publast_sites (
  id integer PRIMARY KEY,
  name text NOT NULL,
  domain text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT 'general',
  language_code text DEFAULT 'en',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create publications table
CREATE TABLE IF NOT EXISTS publications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  input_url text NOT NULL,
  core_message text NOT NULL,
  keywords text[] DEFAULT '{}',
  publast_publication_id integer,
  status text DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE publast_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate them
DO $$
BEGIN
  -- Profiles policies
  DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
  CREATE POLICY "Users can read own profile"
    ON profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  CREATE POLICY "Users can update own profile"
    ON profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

  DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
  CREATE POLICY "Users can insert own profile"
    ON profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

  -- Publast sites policies
  DROP POLICY IF EXISTS "Authenticated users can read sites" ON publast_sites;
  CREATE POLICY "Authenticated users can read sites"
    ON publast_sites
    FOR SELECT
    TO authenticated
    USING (true);

  -- Publications policies
  DROP POLICY IF EXISTS "Users can read own publications" ON publications;
  CREATE POLICY "Users can read own publications"
    ON publications
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can create own publications" ON publications;
  CREATE POLICY "Users can create own publications"
    ON publications
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can update own publications" ON publications;
  CREATE POLICY "Users can update own publications"
    ON publications
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);
END $$;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
  is_google_signup boolean DEFAULT false;
  free_credits integer DEFAULT 0;
BEGIN
  -- Check if this is a Google OAuth signup
  -- Google OAuth users have provider = 'google' in auth.identities
  SELECT EXISTS (
    SELECT 1 FROM auth.identities 
    WHERE user_id = NEW.id AND provider = 'google'
  ) INTO is_google_signup;
  
  -- Grant 1 free credit for Google signups
  IF is_google_signup THEN
    free_credits := 1;
  END IF;

  INSERT INTO profiles (
    id,
    email,
    full_name,
    avatar_url,
    free_publications_remaining
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url',
    free_credits
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at (drop first to avoid conflicts)
DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS publast_sites_updated_at ON publast_sites;
CREATE TRIGGER publast_sites_updated_at
  BEFORE UPDATE ON publast_sites
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS publications_updated_at ON publications;
CREATE TRIGGER publications_updated_at
  BEFORE UPDATE ON publications
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS publications_user_id_idx ON publications(user_id);
CREATE INDEX IF NOT EXISTS publications_status_idx ON publications(status);
CREATE INDEX IF NOT EXISTS publications_created_at_idx ON publications(created_at DESC);
CREATE INDEX IF NOT EXISTS publast_sites_category_idx ON publast_sites(category);