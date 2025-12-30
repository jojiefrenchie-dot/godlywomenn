import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    },
    db: {
      schema: 'public'
    }
  }
);

async function createTables() {
  try {
    console.log('Creating tables...');
    
    // Read SQL files
    const usersSQL = readFileSync(join(__dirname, 'recreate-users-table.sql'), 'utf-8');
    const categoriesSQL = readFileSync(join(__dirname, 'articles-schema.sql'), 'utf-8');
    const articlesSQL = readFileSync(join(__dirname, 'create-articles-table.sql'), 'utf-8');
    
    // Execute SQL files using Supabase dashboard
    console.log('Please execute the following SQL in your Supabase SQL editor:');
    console.log('\n=== Users Table ===\n');
    console.log(usersSQL);
    console.log('\n=== Categories Table ===\n');
    console.log(categoriesSQL);
    console.log('\n=== Articles Table ===\n');
    console.log(articlesSQL);
    
    console.log('\nAfter executing the SQL in the Supabase dashboard:');
    console.log('1. Run create-admin to create an admin user');
    console.log('2. Run seed-categories to populate categories');
    console.log('3. Run seed-articles to create sample articles');

    console.log('All tables created! Next steps:');
    console.log('1. Run create-admin to create an admin user');
    console.log('2. Run seed-categories to populate categories');
    console.log('3. Run seed-articles to create sample articles');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the table creation
createTables();