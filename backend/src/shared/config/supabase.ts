import { createClient } from "@supabase/supabase-js";
import { SUPABASE_SERVICE_KEY, SUPABASE_URL } from "./env";

const supabaseUrl = SUPABASE_URL;
const supabaseServiceKey = SUPABASE_SERVICE_KEY;


export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  },
});

