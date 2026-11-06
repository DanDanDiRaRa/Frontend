
const TOKEN_KEY = 'memory_coordinates_token';

// 로그인 성공 시 토큰 저장
export function saveToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

// 저장된 토큰 가져오기
export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

// 로그아웃 시 토큰 삭제
export function removeToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}
