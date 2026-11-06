
import { getToken } from './token';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || '/api/v1';

export async function apiRequest(path, options = {}) {
  const {
    method = 'GET',
    body,
    token,
    auth = true,
    headers = {},
  } = options;

  const requestHeaders = { ...headers };

  // 저장된 JWT 토큰을 자동으로 가져오기
  const accessToken = token ?? getToken();

  // 인증이 필요한 API에 토큰 첨부
  if (auth && accessToken) {
    requestHeaders.Authorization = `Bearer ${accessToken}`;
  }

  // 일반 JSON 요청
  if (body !== undefined && !(body instanceof FormData)) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body:
      body === undefined
        ? undefined
        : body instanceof FormData
          ? body
          : JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  // HTTP 오류 처리
  if (!response.ok) {
    let message = '요청 처리 중 오류가 발생했습니다.';

    if (typeof data?.detail === 'string') {
      message = data.detail;
    } else if (Array.isArray(data?.detail)) {
      message = data.detail
        .map((error) => error.msg)
        .join('\n');
    }

    const error = new Error(message);
    error.status = response.status;

    throw error;
  }

  return data;
}
