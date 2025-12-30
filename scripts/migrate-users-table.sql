-- Add new columns
ALTER TABLE public.users
ADD COLUMN email text UNIQUE,
ADD COLUMN image text,
ALTER COLUMN name DROP NOT NULL,
ALTER COLUMN password DROP NOT NULL;

-- Make id reference auth.users
ALTER TABLE public.users
DROP CONSTRAINT users_pkey,
ALTER COLUMN id TYPE uuid USING id::uuid,
ADD CONSTRAINT users_pkey PRIMARY KEY (id),
ADD CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;