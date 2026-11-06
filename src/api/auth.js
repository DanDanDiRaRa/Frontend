
import { apiRequest } from './client';
import { saveToken } from './token';

// 회원가입 API
export function signUp({
  accountId,
  password,
  passwordConfirm,
  nickname,
}) {
  return apiRequest('/auth/signup', {
    method: 'POST',
    auth: false,
    body: {
      account_id: accountId,
      password,
      password_confirm: passwordConfirm,
      ...(nickname?.trim() && {
        nickname: nickname.trim(),
      }),
    },
  });
}

// 로그인 API
export async function logIn({ accountId, password }) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    auth: false,
    body: {
      account_id: accountId,
      password,
    },
  });

  if (!data?.access_token) {
    throw new Error('로그인 토큰을 받지 못했습니다.');
  }

  // 로그인 성공 시 JWT 저장
  saveToken(data.access_token);

  return data;
}
