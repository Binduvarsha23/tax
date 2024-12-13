import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = "https://bemupixvlyhhbciakrbq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlbXVwaXh2bHloaGJjaWFrcmJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3MTY4MDQsImV4cCI6MjA0ODI5MjgwNH0.2YjCzaRfTjyo2qI5KZ_SoyIrPbNMH9imX2j3rw1YqCw";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
