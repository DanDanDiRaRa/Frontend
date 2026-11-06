import { apiRequest } from "./client";

// 추천 장소 목록 조회
export function getRecommendedPlaces() {
  return apiRequest("/places/recommendations", {
    method: "GET",
    auth: false,
  });
}
