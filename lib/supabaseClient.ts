import { createClient } from '@supabase/supabase-js';

export const getSupabase = async (supabaseToken: string) => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${supabaseToken}` } },
    }
  );
};
