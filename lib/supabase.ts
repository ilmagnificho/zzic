import { createClient } from '@supabase/supabase-js';

// .env 파일에서 환경 변수 가져오기
// Vite 환경에서는 import.meta.env를 사용합니다.
// 런타임 오류 방지를 위해 안전하게 접근
const getEnv = () => {
  try {
    // @ts-ignore: import.meta check for environment compatibility
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      return import.meta.env;
    }
  } catch (e) {
    console.warn("[ZZIC] Env load warning:", e);
  }
  return {};
};

const env = getEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

// Warning removed as requested
// if (!supabaseUrl || !supabaseAnonKey) {
//   console.warn("⚠️ [ZZIC] .env 파일에 Supabase 환경 변수가 설정되지 않았습니다. (Demo Mode)");
// }

// 환경 변수가 없으면 빈 문자열을 넣어 초기화하지만, 실제 기능은 동작하지 않음 (데모 모드 경고 표시됨)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);