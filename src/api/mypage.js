
import { apiRequest } from "./client";

// 마이페이지 메인 요약 정보
export function getMyPageSummary() {
  return apiRequest("/mypage/summary", {
    method: "GET",
    auth: true,
  });
}

// 내가 방문 인증한 장소 목록
export function getMyVisitedPlaces() {
  return apiRequest("/mypage/visits", {
    method: "GET",
    auth: true,
  });
}

// 특정 방문 기록의 상세정보
export function getMyVisitDetail(visitId) {
  return apiRequest(
    `/mypage/visits/${encodeURIComponent(visitId)}`,
    {
      method: "GET",
      auth: true,
    }
  );
}

// 내 회원정보 조회
export function getMyProfile() {
  return apiRequest("/mypage/profile", {
    method: "GET",
    auth: true,
  });
}

// 내 회원정보 수정
export function updateMyProfile(data) {
  return apiRequest("/mypage/profile", {
    method: "PATCH",
    auth: true,
    body: data,
  });
}
