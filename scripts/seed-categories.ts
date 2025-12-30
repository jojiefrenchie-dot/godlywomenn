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

// Define predefined categories
const categories = [
  {
    name: 'Testimony',
    slug: 'testimony',
    description: 'Share your personal stories of faith and God\'s work in your life'
  },
  {
    name: 'Praise',
    slug: 'praise',
    description: 'Expressions of worship and thanksgiving to God'
  },
  {
    name: 'Bible Verse',
    slug: 'bible-verse',
    description: 'Share and reflect on meaningful scripture passages'
  },
  {
    name: 'Song/Psalms',
    slug: 'song-psalms',
    description: 'Spiritual songs, hymns, and psalm interpretations'
  },
  {
    name: 'Personal Observation',
    slug: 'personal-observation',
    description: 'Share your insights and reflections on faith and life'
  },
  {
    name: 'Other',
    slug: 'other',
    description: 'Other spiritual and faith-related content'
  }
];

async function seedCategories() {
  try {
    console.log('Seeding default categories...');

    for (const category of categories) {
      try {
        const { data: existingCategory, error: fetchError } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', category.slug)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
          console.error(`Error checking category ${category.name}:`, fetchError);
          continue;
        }

        let result;
        if (existingCategory) {
          const { data, error } = await supabase
            .from('categories')
            .update(category)
            .eq('id', existingCategory.id)
            .select();
          result = { error };
        } else {
          const { data, error } = await supabase
            .from('categories')
            .insert(category)
            .select();
          result = { error };
        }

        if (result.error) {
          console.error(`Error seeding category ${category.name}:`, result.error);
        } else {
          console.log(`Successfully seeded category: ${category.name}`);
        }
      } catch (error) {
        console.error(`Error seeding category ${category.name}:`, error);
      }
    }

    console.log('Category seeding completed!');
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

// Run the seeding
seedCategories();