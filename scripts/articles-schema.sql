-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Categories Table
CREATE TABLE IF NOT EXISTS "Category" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Tags Table
CREATE TABLE IF NOT EXISTS "Tag" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Articles Table
CREATE TABLE IF NOT EXISTS "Article" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    author_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES "Category"(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE
);

-- Create Article Tags Junction Table
CREATE TABLE IF NOT EXISTS "ArticleTag" (
    article_id UUID REFERENCES "Article"(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES "Tag"(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

-- Create Comments Table
CREATE TABLE IF NOT EXISTS "Comment" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    article_id UUID NOT NULL REFERENCES "Article"(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES "Comment"(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for tables with updated_at
CREATE TRIGGER update_article_updated_at
    BEFORE UPDATE ON "Article"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comment_updated_at
    BEFORE UPDATE ON "Comment"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO "Category" (name, slug, description) VALUES
('Devotional', 'devotional', 'Daily devotionals and spiritual reflections'),
('Teaching', 'teaching', 'Biblical teachings and theological insights'),
('Testimony', 'testimony', 'Personal stories of faith and God''s work')
ON CONFLICT (slug) DO NOTHING;

-- Add RLS Policies
ALTER TABLE "Article" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Comment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Tag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ArticleTag" ENABLE ROW LEVEL SECURITY;

-- Article Policies
CREATE POLICY "Published articles are viewable by everyone" ON "Article"
    FOR SELECT
    USING (status = 'published' OR auth.uid() = author_id);

CREATE POLICY "Users can create articles" ON "Article"
    FOR INSERT
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own articles" ON "Article"
    FOR UPDATE
    USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own articles" ON "Article"
    FOR DELETE
    USING (auth.uid() = author_id);

-- Comment Policies
CREATE POLICY "Comments are viewable by everyone" ON "Comment"
    FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create comments" ON "Comment"
    FOR INSERT
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own comments" ON "Comment"
    FOR UPDATE
    USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own comments" ON "Comment"
    FOR DELETE
    USING (auth.uid() = author_id);

-- Category and Tag Policies (public read, admin write)
CREATE POLICY "Categories are viewable by everyone" ON "Category"
    FOR SELECT
    USING (true);

CREATE POLICY "Tags are viewable by everyone" ON "Tag"
    FOR SELECT
    USING (true);

CREATE POLICY "ArticleTags are viewable by everyone" ON "ArticleTag"
    FOR SELECT
    USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS article_author_id_idx ON "Article"(author_id);
CREATE INDEX IF NOT EXISTS article_category_id_idx ON "Article"(category_id);
CREATE INDEX IF NOT EXISTS article_status_idx ON "Article"(status);
CREATE INDEX IF NOT EXISTS comment_article_id_idx ON "Comment"(article_id);
CREATE INDEX IF NOT EXISTS comment_author_id_idx ON "Comment"(author_id);