-- Only create table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'categories') THEN
        -- Create categories table
        CREATE TABLE categories (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,
            description TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;
END
$$;

-- Enable RLS on categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access to categories
CREATE POLICY "Allow public read access to categories"
ON categories
FOR SELECT
USING (true);

-- Allow authenticated users with admin role to manage categories
CREATE POLICY "Allow admin to manage categories"
ON categories
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Insert categories if they don't exist
INSERT INTO categories (name, slug, description)
SELECT name, slug, description
FROM (VALUES
    ('Faith', 'faith', 'Stories of unwavering faith and trust in God'),
    ('Leadership', 'leadership', 'Women who led with wisdom and grace'),
    ('Missions', 'missions', 'Stories from the mission field'),
    ('Family', 'family', 'Balancing family life and ministry'),
    ('Prayer', 'prayer', 'The power of prayer in women''s lives')
) AS new_categories(name, slug, description)
WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE categories.slug = new_categories.slug
)
ON CONFLICT (slug) DO NOTHING;

-- Force RLS
ALTER TABLE categories FORCE ROW LEVEL SECURITY;