// Supabase client was removed in favor of a Django backend.
// If code still imports this file it's a leftover — update the code to use the Django API.
export function _supabaseRemoved() {
  throw new Error('Supabase client removed. Update code to use the Django backend (NEXT_PUBLIC_DJANGO_API)');
}