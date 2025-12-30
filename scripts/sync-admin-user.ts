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

async function createUserRecord() {
  try {
    // Get the admin user from auth
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      throw authError;
    }

    const adminUser = users.find(u => u.email === 'admin@example.com');
    if (!adminUser) {
      console.error('No admin user found in auth');
      return;
    }

    console.log('Found admin user:', adminUser.id);

    // Insert the user record in the public.users table
    const { data: userData, error: insertError } = await supabase
      .from('users')
      .insert({
        id: adminUser.id,
        email: adminUser.email || 'admin@example.com',
        name: 'Admin'
      } as any)
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting user record:', insertError);
      return;
    }

    console.log('Successfully created user record:', userData);

  } catch (error) {
    console.error('Error creating user record:', error);
    process.exit(1);
  }
}

// Run the script
createUserRecord();