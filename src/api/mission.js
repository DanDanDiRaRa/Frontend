
import { apiRequest } from "./client";

// 장소별 AI 미션 생성 또는 조회
export function getOrGenerateMission(placeId) {
  return apiRequest(
    `/places/${encodeURIComponent(placeId)}/missions/generate`,
    {
      method: "POST",
      auth: true,
    }
  );
}


export function submitMissionProof(missionId, payload) {
  return apiRequest(
    `/missions/${encodeURIComponent(missionId)}/submit`,
    {
      method: "POST",
      auth: true,
      body: payload,
    }
  );
}

// 미션 제출 결과 조회
export function getMissionSubmissionResult(submissionId) {
  return apiRequest(
    `/missions/submissions/${encodeURIComponent(submissionId)}`,
    {
      method: "GET",
      auth: true,
    }
  );
}

export function getMyMissionSubmissions(placeId = null) {
  const query =
    placeId === null
      ? ""
      : `?place_id=${encodeURIComponent(placeId)}`;

  return apiRequest(
    `/missions/my-submissions${query}`,
    {
      method: "GET",
      auth: true,
    }
  );
}