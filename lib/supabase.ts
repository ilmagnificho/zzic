import { createClient } from '@supabase/supabase-js';

// 환경 변수 안전하게 가져오기
const getEnv = (key: string) => {
  // 1. Vite / Modern Browsers (import.meta.env)
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {}

  // 2. Node.js / Webpack (process.env)
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      // @ts-ignore
      return process.env[key];
    }
  } catch (e) {}
  
  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ [ZZIC] Supabase 환경 변수가 설정되지 않았습니다. (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)");
}

// URL이 없으면 createClient가 에러를 발생시키므로 더미 URL을 사용합니다.
// 이 경우 실제 인증/DB 기능은 작동하지 않지만, 앱이 크래시되지 않고 UI 렌더링은 가능합니다.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);