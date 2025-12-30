import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://kpcsndebeirdjjvilyrj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwY3NuZGViZWlyZGpqdmlseXJqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDMyNTY5NiwiZXhwIjoyMDc1OTAxNjk2fQ.16iSx8P2VRr5oGcElGWMfvGvgN3uM6QUZi9IaFIcY8A',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function testConnection() {
  try {
    // Test the connection by creating a table
    console.log('Testing connection...');
    const { data, error } = await supabase
      .from('categories')
      .insert([
        {
          name: 'Devotional',
          slug: 'devotional',
          description: 'Daily devotionals and spiritual reflections'
        }
      ])
      .select();

    if (error) {
      console.error('Error:', error.message);
      return;
    }

    console.log('Successfully connected and inserted data:', data);
  } catch (error) {
    console.error('Failed to connect:', error);
  }
}

testConnection();