import { apiRequest } from "./client";

// 장소 ID로 상세 정보 조회
export function getPlaceDetail(placeId) {
  return apiRequest(
    `/places/${encodeURIComponent(placeId)}`,
    {
      method: "GET",
      auth: true,
    }
  );
}


 // 장소별 과거 사진 조회
export function getHistoricalPhotos(placeId) {
  return apiRequest(
    `/places/${encodeURIComponent(placeId)}/historical-photos`,
    {
      method: "GET",
      auth: true,
    }
  );
}

