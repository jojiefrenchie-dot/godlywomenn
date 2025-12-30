-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    "emailVerified" TIMESTAMP,
    image TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Account table
CREATE TABLE IF NOT EXISTS "Account" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE,
    UNIQUE(provider, "providerAccountId")
);

-- Create Session table
CREATE TABLE IF NOT EXISTS "Session" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "sessionToken" TEXT UNIQUE NOT NULL,
    "userId" UUID NOT NULL,
    expires TIMESTAMP NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

-- Create trigger to automatically update updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_user_updated_at
    BEFORE UPDATE ON "User"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add Row Level Security (RLS) policies
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;

-- User policies
CREATE POLICY "Users can view their own data"
    ON "User"
    FOR SELECT
    USING (auth.uid()::uuid = id);

CREATE POLICY "Users can update their own data"
    ON "User"
    FOR UPDATE
    USING (auth.uid()::uuid = id);

-- Account policies
CREATE POLICY "Users can view their own accounts"
    ON "Account"
    FOR SELECT
    USING (auth.uid()::uuid = "userId");

CREATE POLICY "Users can manage their own accounts"
    ON "Account"
    FOR ALL
    USING (auth.uid()::uuid = "userId");

-- Session policies
CREATE POLICY "Users can view their own sessions"
    ON "Session"
    FOR SELECT
    USING (auth.uid()::uuid = "userId");

CREATE POLICY "Users can manage their own sessions"
    ON "Session"
    FOR ALL
    USING (auth.uid()::uuid = "userId");