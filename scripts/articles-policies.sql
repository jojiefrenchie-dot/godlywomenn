-- Enable RLS on articles table
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Policy for reading published articles (anyone can read published articles)
CREATE POLICY "Allow public read access to published articles"
ON articles
FOR SELECT
USING (status = 'published');

-- Policy for authors to read their own draft articles
CREATE POLICY "Allow authors to read their own articles"
ON articles
FOR SELECT
USING (author_id = auth.uid());

-- Policy for authors to create articles
CREATE POLICY "Allow authenticated users to create articles"
ON articles
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Policy for authors to update their own articles
CREATE POLICY "Allow authors to update their own articles"
ON articles
FOR UPDATE
USING (author_id = auth.uid());

-- Policy for authors to delete their own articles
CREATE POLICY "Allow authors to delete their own articles"
ON articles
FOR DELETE
USING (author_id = auth.uid());

-- Force RLS
ALTER TABLE articles FORCE ROW LEVEL SECURITY;