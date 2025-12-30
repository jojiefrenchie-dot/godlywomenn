-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to published articles" ON articles;
DROP POLICY IF EXISTS "Allow authors to read own articles" ON articles;
DROP POLICY IF EXISTS "Allow authors to create articles" ON articles;
DROP POLICY IF EXISTS "Allow authors to update own articles" ON articles;

-- Enable RLS on articles table
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read published articles
CREATE POLICY "Allow public read access to published articles"
ON articles
FOR SELECT
USING (status = 'published');

-- Allow authors to read their own articles (including drafts)
CREATE POLICY "Allow authors to read own articles"
ON articles
FOR SELECT
USING (auth.uid()::uuid = author_id);

-- Allow authors to create articles
CREATE POLICY "Allow authors to create articles"
ON articles
FOR INSERT 
WITH CHECK (auth.uid()::uuid = author_id);

-- Allow authors to update their own articles
CREATE POLICY "Allow authors to update own articles"
ON articles
FOR UPDATE
USING (auth.uid()::uuid = author_id);

-- Force RLS
ALTER TABLE articles FORCE ROW LEVEL SECURITY;