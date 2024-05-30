import { createClient } from "@supabase/supabase-js"

export const supabaseUrl = "https://sqnuyqeklwbqytpjozst.supabase.co"
const supabaseKey = process.env.VITE_APP_SUPABASE_KEY

if (!supabaseKey) {
  throw new Error("Missing required environment variables")
}

const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase
