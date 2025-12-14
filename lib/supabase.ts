import { createClient } from '@supabase/supabase-js';

// Vercel 환경 변수 또는 로컬 환경 변수 사용
// Vercel 배포 시 Settings > Environment Variables에 등록해야 합니다.
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase 환경 변수가 설정되지 않았습니다.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);