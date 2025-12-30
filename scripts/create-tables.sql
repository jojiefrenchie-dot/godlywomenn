-- Create Categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL UNIQUE,
    slug text NOT NULL UNIQUE,
    description text,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read categories" ON public.categories;
DROP POLICY IF EXISTS "Admin can manage categories" ON public.categories;

-- Create policies
CREATE POLICY "Anyone can read categories" ON public.categories
    FOR SELECT
    USING (true);

CREATE POLICY "Admin can manage categories" ON public.categories
    FOR ALL
    USING (auth.uid() IN (
        SELECT id FROM auth.users
        WHERE email IN ('your-admin-email@example.com')
    ));