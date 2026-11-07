

const TOKEN_KEY = "memory_coordinates_token";

export function saveToken(token) {
  // 이전 로그인과 토큰이 다르면 제출 번호 초기화
  if (sessionStorage.getItem(TOKEN_KEY) !== token) {
    clearMissionSubmissionIds();
  }

  sessionStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  clearMissionSubmissionIds();
  sessionStorage.removeItem(TOKEN_KEY);
}



const MISSION_SUBMISSION_PREFIX =
  "memory_coordinates_mission_submission_";

// 현재 브라우저 세션에 저장된 미션 제출 번호 정리
function clearMissionSubmissionIds() {
  for (let i = sessionStorage.length - 1; i >= 0; i--) {
    const key = sessionStorage.key(i);

    if (key?.startsWith(MISSION_SUBMISSION_PREFIX)) {
      sessionStorage.removeItem(key);
    }
  }
}
