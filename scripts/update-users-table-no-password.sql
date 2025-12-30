-- Drop the existing users table
DROP TABLE IF EXISTS public.users;

-- Create Users table linked to auth.users
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    name text,
    email text UNIQUE NOT NULL,
    image text,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;