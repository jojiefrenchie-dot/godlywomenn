import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
}

// Create Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

const sampleArticle = {
  title: "Welcome to GodlyWomen",
  slug: "welcome-to-godlywomen",
  content: `# Welcome to GodlyWomen

We're excited to launch this platform dedicated to sharing inspiring stories of faithful women throughout history. 

## Our Mission

Our mission is to preserve and share the incredible stories of women who have made a significant impact through their faith, courage, and dedication to God's calling.

## Join Us

We invite you to join us on this journey of discovery and inspiration. Share your own stories, read about others, and be part of this growing community.`,
  excerpt: "Welcome to GodlyWomen - a platform dedicated to sharing inspiring stories of faithful women throughout history.",
  status: "published",
  published_at: new Date().toISOString()
};

async function seedArticles() {
  try {
    console.log('Getting admin user...');
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'admin@example.com')
      .single();

    if (userError) {
      throw userError;
    }

    if (!users) {
      throw new Error('Admin user not found. Please run create-admin first.');
    }

    console.log('Found admin user:', users.id);

    console.log('Getting default category...');
    const { data: categories, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', 'other')
      .single();

    if (categoryError) {
      throw categoryError;
    }

    console.log('Creating welcome article...');
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .upsert({
        ...sampleArticle,
        author_id: users.id,
        category_id: categories.id
      })
      .select()
      .single();

    if (articleError) {
      throw articleError;
    }

    console.log('Successfully created welcome article!');
    console.log(article);

  } catch (error) {
    console.error('Error seeding articles:', error);
    process.exit(1);
  }
}

// Run the seeding
seedArticles();