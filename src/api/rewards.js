import { apiRequest } from "./client";

// 미션 인증 완료 후 보상 수령
export function claimReward(submissionId) {
  return apiRequest("/rewards/claim", {
    method: "POST",
    auth: true,
    body: {
      submission_id: submissionId,
    },
  });
}

// 지급된 보상 상세 조회
export function getRewardDetail(rewardId) {
  return apiRequest(
    `/rewards/${encodeURIComponent(rewardId)}`,
    {
      method: "GET",
      auth: true,
    }
  );
}

// 로그인한 사용자의 보상 목록 조회
export function getMyRewards() {
  return apiRequest("/mypage/rewards", {
    method: "GET",
    auth: true,
  });
}
