import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initializeDatabase() {
  try {
    // Initialize Supabase client with service role key
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

    // Read the SQL files
    const extensionsSQL = fs.readFileSync(join(__dirname, 'enable-extensions.sql'), 'utf8');
    const articlesSQL = fs.readFileSync(join(__dirname, 'articles-schema.sql'), 'utf8');
    const authSQL = fs.readFileSync(join(__dirname, 'auth-policies.sql'), 'utf8');

    // Execute extensions SQL
    console.log('Enabling extensions...');
    const { error: extError } = await supabase.rpc('exec_sql', { sql: extensionsSQL });
    if (extError) {
      console.error('Error enabling extensions:', extError);
      return;
    }

    // Execute articles schema SQL
    console.log('Creating schema...');
    const { error: schemaError } = await supabase.rpc('exec_sql', { sql: articlesSQL });
    if (schemaError) {
      console.error('Error creating schema:', schemaError);
      return;
    }

    // Execute auth policies SQL
    console.log('Applying auth policies...');
    const { error: authError } = await supabase.rpc('exec_sql', { sql: authSQL });
    if (authError) {
      console.error('Error applying auth policies:', authError);
      return;
    }

    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

initializeDatabase();