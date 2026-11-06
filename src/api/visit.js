import { apiRequest } from "./client";

// GPS 기반 장소 방문 인증
export function verifyVisitByGps(
  placeId,
  latitude,
  longitude
) {
  return apiRequest(
    `/places/${encodeURIComponent(placeId)}/verify-visit`,
    {
      method: "POST",
      auth: true,
      body: {
        verify_method: "GPS",
        latitude,
        longitude,
      },
    }
  );
}


// 방문 인증용 사진 업로드
export function uploadVisitPhoto(file) {
  const formData = new FormData();

  formData.append("file", file);

  return apiRequest("/files/upload", {
    method: "POST",
    auth: true,
    body: formData,
  });
}

// 업로드된 사진으로 장소 방문 인증
export function verifyVisitByPhoto(placeId, photoUrl) {
  return apiRequest(
    `/places/${encodeURIComponent(placeId)}/verify-visit`,
    {
      method: "POST",
      auth: true,
      body: {
        verify_method: "PHOTO",
        photo_url: photoUrl,
      },
    }
  );
}

