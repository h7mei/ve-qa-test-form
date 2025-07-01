import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type QATestReport = {
  id?: string;
  tester_name: string;
  test_date: string;
  application_version: string;
  test_environment: string;
  auth_tests: Record<string, { status: string; notes: string }>;
  main_section_tests: Record<string, { status: string; notes: string }>;
  side_mission_tests: Record<string, { status: string; notes: string }>;
  leaderboard: { status: string; notes: string; type: string };
  toko: { status: string; notes: string };
  komunitas: { status: string; notes: string };
  hasil_user: { status: string; notes: string };
  sertifikat: { status: string; notes: string };
  user_profile: { status: string; notes: string };
  created_at?: string;
  updated_at?: string;
};
