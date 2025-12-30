-- Create Articles table
CREATE TABLE IF NOT EXISTS public.articles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    content text NOT NULL,
    excerpt text,
    featured_image text,
    author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    category_id uuid REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
    status text DEFAULT 'draft',
    view_count int DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    published_at timestamptz
);

-- Enable RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read published articles" ON public.articles;
DROP POLICY IF EXISTS "Authors can manage their articles" ON public.articles;
DROP POLICY IF EXISTS "Admins can manage all articles" ON public.articles;

-- Create policies
CREATE POLICY "Anyone can read published articles" ON public.articles
    FOR SELECT
    USING (status = 'published');

CREATE POLICY "Authors can manage their articles" ON public.articles
    FOR ALL
    USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all articles" ON public.articles
    FOR ALL
    USING (auth.uid() IN (
        SELECT id FROM auth.users
        WHERE email IN ('admin@example.com')
    ));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.articles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();