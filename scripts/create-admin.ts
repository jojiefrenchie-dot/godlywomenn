import { createClient, type SupabaseClient } from '@supabase/supabase-js';
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

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    const email = 'admin@example.com'; // Replace with your email
    const password = 'admin123'; // Replace with your preferred password

    const { data, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return;
    }

    if (!data.user) {
      console.error('No auth user created');
      return;
    }

    const userResult = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: data.user.email || email,
        name: 'Admin'
      } as any)
      .select()
      .single();

    if (userResult.error) {
      console.error('Error creating user record:', userResult.error);
      return;
    }

    console.log('Successfully created admin user!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('User ID:', data.user.id);
    console.log('Please save these credentials!');

  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

// Run the script
createAdminUser();