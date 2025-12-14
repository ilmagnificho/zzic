export type Language = 'ko' | 'en';

export const TRANSLATIONS = {
  ko: {
    // General
    login: '로그인',
    signup: '회원가입',
    email: '이메일',
    password: '비밀번호',
    nickname: '닉네임',
    cancel: '취소',
    confirm: '확인',
    
    // Auth
    auth_login_btn: '로그인',
    auth_signup_btn: '회원가입 완료',
    auth_social: '소셜 계정으로 계속하기',
    auth_guest: '게스트 모드 (체험하기)',
    auth_google_alert: 'MVP 버전에서는 이메일 로그인을 이용해주세요.',
    auth_login_required: '로그인이 필요합니다',
    auth_login_desc: '투표를 하려면 로그인이 필요합니다',
    auth_login_profile_desc: '나의 예측 기록과 자산을 확인하려면 로그인하세요.',
    auth_login_signup: '로그인 / 가입하기',

    // Home
    home_event: 'EVENT',
    home_prize: '총 상금 100만 VP',
    home_banner_1: 'ZZIC의 신은',
    home_banner_2: '누구인가?',
    home_trending: '실시간 트렌딩',
    home_close: '마감',
    home_new_topic: '새로운 주제 제안하기',
    home_disclaimer_title: 'Beta Service Disclaimer',
    home_disclaimer: '본 서비스는 가상 포인트(VP)를 사용하는 시뮬레이션 게임이며, 실제 금전적 이득이나 손실이 발생하지 않습니다. \n베타 서비스 기간 동안의 데이터는 예고 없이 초기화될 수 있습니다.',

    // Ranking
    ranking_title: '랭킹 (God of ZZIC)',
    ranking_winrate: '승률',
    
    // Detail
    detail_nav: '예측하기',
    detail_result: '결과 발표',
    detail_prob: '확률',
    detail_bet_amount: '베팅 금액',
    detail_min: '최소',
    detail_max: '최대',
    detail_login_needed: '투표를 하려면 로그인이 필요합니다',
    detail_multiplier: '배당률',
    detail_return: '예상 수익',
    detail_confirm: 'ZZIC 확정하기',
    detail_login_btn: '로그인하고 ZZIC 하기',
    detail_discussion: '토론방',
    detail_comment_placeholder: '의견을 남겨주세요...',
    detail_comment_login_placeholder: '로그인이 필요합니다.',
    detail_no_comments: '아직 작성된 의견이 없습니다.',
    detail_reply: '답글',
    detail_reply_to: '님에게 답글 작성 중...',
    detail_reply_placeholder: '답글을 입력하세요...',
    detail_cancel_reply: '취소',

    // Profile
    profile_title: '마이 페이지',
    profile_logout: '로그아웃',
    profile_rookie: '루키',
    profile_guest: '게스트',
    profile_assets: '총 보유 자산',
    profile_hit_rate: '적중률',
    profile_history_count: '참여 기록',
    profile_cache_warn: '브라우저 캐시 삭제 시 게스트 데이터가 초기화될 수 있습니다.',
    profile_recent: '최근 활동',
    profile_no_history: '아직 참여 내역이 없습니다.',
    profile_explore: '시장 둘러보기',
    profile_bet_label: '베팅액',

    // Modal - Suggest
    suggest_title: 'NEW TOPIC',
    suggest_subtitle: '여러분이 원하는 주제를 제안해주세요',
    suggest_category: '카테고리',
    suggest_input_title: '제목',
    suggest_input_desc: '설명 (선택)',
    suggest_btn: '제안 보내기',

    // Modal - Share
    share_bet_amount: '베팅 금액',
    share_return: '예상 수익',
    share_btn: '스토리 공유하기',

    // Alerts
    msg_signup_success: '회원가입 성공! 자동 로그인됩니다.',
    msg_login_fail: '이메일 또는 비밀번호가 일치하지 않습니다.',
    msg_email_exist: '이미 가입된 이메일입니다.',
    msg_email_verification: '인증 메일이 발송되었습니다. 이메일을 확인해주세요.',
    msg_bet_amount_error: '올바른 베팅 금액을 입력해주세요.',
    msg_insufficient: '보유 VP가 부족합니다.',
    msg_comment_login: '댓글을 작성하려면 로그인이 필요합니다. 로그인하시겠습니까?',
    msg_logout_confirm: 'ZZIC에서 로그아웃 하시겠습니까?',
    msg_suggest_thankyou: '제안해주셔서 감사합니다!\n관리자 검토 후 등록됩니다.',
    alert_error: '오류가 발생했습니다.',
    alert_server_error: '서버 오류가 발생했습니다.',
    alert_save_fail: '데이터 저장에 실패했습니다.'
  },
  en: {
    // General
    login: 'Login',
    signup: 'Sign Up',
    email: 'Email',
    password: 'Password',
    nickname: 'Nickname',
    cancel: 'Cancel',
    confirm: 'Confirm',
    
    // Auth
    auth_login_btn: 'Login',
    auth_signup_btn: 'Sign Up',
    auth_social: 'Continue with Social',
    auth_guest: 'Guest Mode (Try)',
    auth_google_alert: 'Please use email login for MVP.',
    auth_login_required: 'Login Required',
    auth_login_desc: 'You need to login to vote.',
    auth_login_profile_desc: 'Login to see your history and assets.',
    auth_login_signup: 'Login / Sign Up',

    // Home
    home_event: 'EVENT',
    home_prize: 'Prize 1M VP',
    home_banner_1: 'Who is the',
    home_banner_2: 'God of ZZIC?',
    home_trending: 'Trending Now',
    home_close: 'Close',
    home_new_topic: 'Suggest New Topic',
    home_disclaimer_title: 'Beta Service Disclaimer',
    home_disclaimer: 'This is a simulation using virtual points (VP). No real money involved.\nData may be reset during beta.',

    // Ranking
    ranking_title: 'Ranking (God of ZZIC)',
    ranking_winrate: 'Win Rate',
    
    // Detail
    detail_nav: 'Predict',
    detail_result: 'Result',
    detail_prob: 'Prob',
    detail_bet_amount: 'Bet Amount',
    detail_min: 'Min',
    detail_max: 'Max',
    detail_login_needed: 'Login required to vote',
    detail_multiplier: 'Odds',
    detail_return: 'Exp. Return',
    detail_confirm: 'Confirm ZZIC',
    detail_login_btn: 'Login & ZZIC',
    detail_discussion: 'Discussion',
    detail_comment_placeholder: 'Leave a comment...',
    detail_comment_login_placeholder: 'Login required.',
    detail_no_comments: 'No comments yet.',
    detail_reply: 'Reply',
    detail_reply_to: 'Replying to',
    detail_reply_placeholder: 'Write a reply...',
    detail_cancel_reply: 'Cancel',

    // Profile
    profile_title: 'My Page',
    profile_logout: 'Logout',
    profile_rookie: 'Rookie',
    profile_guest: 'Guest',
    profile_assets: 'Total Assets',
    profile_hit_rate: 'Hit Rate',
    profile_history_count: 'History',
    profile_cache_warn: 'Guest data may be lost if cache is cleared.',
    profile_recent: 'Recent Activity',
    profile_no_history: 'No history yet.',
    profile_explore: 'Explore Markets',
    profile_bet_label: 'Bet',

    // Modal - Suggest
    suggest_title: 'NEW TOPIC',
    suggest_subtitle: 'Suggest a topic you want',
    suggest_category: 'Category',
    suggest_input_title: 'Title',
    suggest_input_desc: 'Description (Optional)',
    suggest_btn: 'Send Suggestion',

    // Modal - Share
    share_bet_amount: 'Bet Amount',
    share_return: 'Exp. Return',
    share_btn: 'Share Story',

    // Alerts
    msg_signup_success: 'Sign up successful! Logging in.',
    msg_login_fail: 'Invalid email or password.',
    msg_email_exist: 'Email already registered.',
    msg_email_verification: 'Verification email sent. Please check your inbox.',
    msg_bet_amount_error: 'Invalid bet amount.',
    msg_insufficient: 'Insufficient VP.',
    msg_comment_login: 'Login required to comment. Login now?',
    msg_logout_confirm: 'Do you want to logout?',
    msg_suggest_thankyou: 'Thanks for suggestion!\nPending admin review.',
    alert_error: 'An error occurred.',
    alert_server_error: 'Server error occurred.',
    alert_save_fail: 'Failed to save data.'
  }
};