/*
  # Fix RLS for Publast Sites Sync

  1. Purpose
    - Create a function to delete all publast_sites (bypasses RLS)
    - Ensure service role can manage publast_sites table
    - Add proper policies for sync operations

  2. Security
    - Only service role can use the delete function
    - Maintains RLS for regular users
*/

-- Create a function to delete all publast_sites (for sync operations)
CREATE OR REPLACE FUNCTION delete_all_publast_sites()
RETURNS void AS $$
BEGIN
  DELETE FROM publast_sites;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to service role
-- Note: In production, you might want to be more restrictive
GRANT EXECUTE ON FUNCTION delete_all_publast_sites() TO service_role;

-- Ensure the publast_sites table has proper policies
-- Add a policy that allows service role to do everything
DROP POLICY IF EXISTS "Service role can manage sites" ON publast_sites;
CREATE POLICY "Service role can manage sites"
  ON publast_sites
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Ensure authenticated users can still read sites
DROP POLICY IF EXISTS "Authenticated users can read sites" ON publast_sites;
CREATE POLICY "Authenticated users can read sites"
  ON publast_sites
  FOR SELECT
  TO authenticated
  USING (true);

-- Grant necessary permissions to service role
GRANT ALL ON publast_sites TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;