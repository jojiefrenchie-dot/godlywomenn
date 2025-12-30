-- Enable the pgnet extension (requires superuser privileges)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a function to execute SQL (requires superuser privileges)
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS void AS $$
BEGIN
  EXECUTE sql;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;