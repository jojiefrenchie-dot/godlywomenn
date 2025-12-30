-- Create Users table
CREATE TABLE IF NOT EXISTS public.users (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text,
    email text UNIQUE NOT NULL,
    password text NOT NULL,
    image text,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can read their own data" ON public.users
    FOR SELECT
    USING (auth.uid() = id);

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE
    USING (auth.uid() = id);

-- Create policy to allow admin to manage all users
CREATE POLICY "Admin can manage all users" ON public.users
    FOR ALL
    USING (auth.uid() IN (
        SELECT id FROM auth.users
        WHERE email IN ('YOUR-EMAIL-HERE@example.com')
    ));