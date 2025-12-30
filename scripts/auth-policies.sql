-- Enable public access for registration and login
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- Allow public registration
CREATE POLICY "Enable insert for users"
ON "User"
FOR INSERT
WITH CHECK (true);

-- Allow public email lookup for authentication
CREATE POLICY "Enable public read access to email"
ON "User"
FOR SELECT
USING (true);

-- Allow users to update their own data
CREATE POLICY "Enable update for users based on id"
ON "User"
FOR UPDATE
USING (auth.uid()::uuid = id);

-- Enable RLS
ALTER TABLE "User" FORCE ROW LEVEL SECURITY;