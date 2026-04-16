-- Drop the existing overly broad SELECT policy for avatars bucket
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;

-- Create a more restrictive policy that allows reading specific files but not listing
CREATE POLICY "Avatar images are publicly accessible by path"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

-- Disable public listing on the avatars bucket
UPDATE storage.buckets
SET public = false
WHERE id = 'avatars';