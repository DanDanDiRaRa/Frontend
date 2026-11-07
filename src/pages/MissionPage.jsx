
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getOrGenerateMission,
  getMyMissionSubmissions,
} from "../api/mission";

import Button from "../components/Button";
import "./MyPage.css";
import "./PlacePages.css";

function MissionPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [retryCount, setRetryCount] = useState(0);

  const [result, setResult] = useState({
    key: null,
    mission: null,
    submissions: [],
    error: "",
  });

  const requestKey = `${id}-${retryCount}`;
  const isLoading = result.key !== requestKey;

  // 미션 정보와 내 제출 기록을 함께 조회
  useEffect(() => {
    let active = true;

    async function loadMission() {
      try {
        const [mission, history] = await Promise.all([
          getOrGenerateMission(id),
          getMyMissionSubmissions(id),
        ]);

        if (!active) return;

        if (
          !mission ||
          !Number.isSafeInteger(mission.mission_id) ||
          Number(mission.place_id) !== Number(id) ||
          !Array.isArray(mission.step_guides)
        ) {
          throw new Error(
            "미션 응답 형식이 올바르지 않습니다."
          );
        }

        if (!history || !Array.isArray(history.submissions)) {
          throw new Error(
            "미션 제출 기록 형식이 올바르지 않습니다."
          );
        }

        // 현재 장소와 미션에 해당하는 제출 기록만 사용
        const submissions = history.submissions.filter(
          (item) =>
            Number(item.place_id) === Number(id) &&
            Number(item.mission_id) === mission.mission_id
        );

        setResult({
          key: requestKey,
          mission,
          submissions,
          error: "",
        });
      } catch (error) {
        if (!active) return;

        setResult({
          key: requestKey,
          mission: null,
          submissions: [],
          error:
            error.message ||
            "미션 정보를 불러오지 못했습니다.",
        });
      }
    }

    loadMission();

    return () => {
      active = false;
    };
  }, [id, requestKey]);

  if (isLoading) {
    return (
      <div>
        <h1 className="page-title">장소 미션</h1>
        <p role="status">
          미션과 인증 기록을 확인하고 있습니다...
        </p>
      </div>
    );
  }

  if (result.error) {
    return (
      <div>
        <h1 className="page-title">장소 미션</h1>

        <div className="info-box" role="alert">
          <strong>미션 정보를 불러오지 못했습니다.</strong>
          <p>{result.error}</p>
        </div>

        <Button
          onClick={() =>
            setRetryCount((count) => count + 1)
          }
        >
          다시 시도
        </Button>

        <div className="gap" />

        <Button
          variant="secondary"
          onClick={() => navigate(`/place/${id}/photos`)}
        >
          과거 사진으로 돌아가기
        </Button>
      </div>
    );
  }

  const mission = result.mission;
  const submissions = result.submissions;

  // 성공 기록이 있으면 가장 최근 성공 기록을 우선 사용
  const successfulSubmission = submissions.find(
    (item) => item.status === "SUCCESS"
  );

  const submission =
    successfulSubmission ?? submissions[0] ?? null;

  const rewardId = Number(submission?.reward_id);

  const hasReward =
    submission?.reward_id != null &&
    Number.isSafeInteger(rewardId) &&
    rewardId > 0;

  // 제출 기록에 따라 버튼 문구 결정
  const getActionLabel = () => {
    if (hasReward) {
      return "획득한 보상 보기";
    }

    if (submission?.status === "SUCCESS") {
      return "인증 결과 및 보상 확인";
    }

    if (submission?.status === "PENDING") {
      return "심사 결과 확인";
    }

    if (
      submission?.status === "FAILED" ||
      submission?.status === "ERROR"
    ) {
      return "인증 자료 다시 제출";
    }

    return "수행 완료 · 인증으로";
  };

  const handleContinueMission = () => {
    // 이미 보상을 받았다면 실제 보상 상세로 이동
    if (hasReward) {
      navigate(`/mypage/rewards/${rewardId}`);
      return;
    }

    // 성공 또는 심사 대기 기록이 있다면 결과 화면으로 이동
    if (
      submission?.status === "SUCCESS" ||
      submission?.status === "PENDING"
    ) {
      navigate(
        `/place/${id}/mission/result?submissionId=${encodeURIComponent(
          submission.submission_id
        )}`
      );
      return;
    }

    // 기록이 없거나 실패한 경우 제출 화면으로 이동
    navigate(`/place/${id}/mission/submit`, {
      state: {
        missionId: mission.mission_id,
        missionTitle: mission.title,
      },
    });
  };

  return (
    <div>
      <span className="badge">
        {mission.created_by_ai
          ? "AI 생성 미션"
          : "장소 미션"}
      </span>

      <h1 className="page-title">
        {mission.place_name} 미션
      </h1>

      <p className="page-desc">
        과거와 현재를 연결하는 탐색을 시작해 보세요.
      </p>

      {/* 미션 내용 */}
      <div className="info-box">
        <strong>{mission.title}</strong>

        <p style={{ lineHeight: 1.7 }}>
          {mission.content}
        </p>
      </div>

      {/* 수행 방법 */}
      <div className="info-box">
        <strong>미션 수행 방법</strong>

        {mission.step_guides.map((guide, index) => (
          <div
            className="step"
            key={`${mission.mission_id}-${index}`}
          >
            <span className="step-num">
              {index + 1}
            </span>

            <span>
              {guide.replace(/^\s*\d+[.)]\s*/, "")}
            </span>
          </div>
        ))}
      </div>

      {/* 예상 보상 */}
      <div className="info-box">
        <strong>미션 성공 시 보상</strong>

        <p>{mission.reward_name}</p>

        {mission.reward_detail && (
          <p style={{ fontSize: 13, opacity: 0.8 }}>
            {mission.reward_detail}
          </p>
        )}
      </div>

      {/* 기존 인증 기록 */}
      {submission && (
        <div className="info-box">
          <strong>내 미션 인증 기록</strong>

          <p>
            {submission.status === "SUCCESS"
              ? "미션 인증에 성공했어요."
              : submission.status === "FAILED"
                ? "이전 인증이 거절되었어요."
                : submission.status === "PENDING"
                  ? "미션 심사 결과를 기다리고 있어요."
                  : "이전 인증 결과를 확인해 주세요."}
          </p>

          {submission.ai_feedback && (
            <p style={{ lineHeight: 1.7 }}>
              {submission.ai_feedback}
            </p>
          )}

          {hasReward && (
            <p>이미 보상을 수령한 미션입니다.</p>
          )}
        </div>
      )}

      <Button onClick={handleContinueMission}>
        {getActionLabel()}
      </Button>

      <div className="gap" />

      <Button
        variant="secondary"
        onClick={() => navigate(`/place/${id}/photos`)}
      >
        과거 사진으로 돌아가기
      </Button>
    </div>
  );
}

export default MissionPage;
