
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrGenerateMission } from "../api/mission";
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
    error: "",
    status: null,
  });

  const requestKey = `${id}-${retryCount}`;
  const isLoading = result.key !== requestKey;

  // 장소에 맞는 미션 생성 또는 조회
  useEffect(() => {
    let active = true;

    getOrGenerateMission(id)
      .then((data) => {
        if (!active) return;

        if (
          !data ||
          !Number.isInteger(data.mission_id) ||
          Number(data.place_id) !== Number(id) ||
          !Array.isArray(data.step_guides)
        ) {
          throw new Error(
            "미션 응답 형식이 올바르지 않습니다."
          );
        }

        setResult({
          key: requestKey,
          mission: data,
          error: "",
          status: null,
        });
      })
      .catch((error) => {
        if (!active) return;

        setResult({
          key: requestKey,
          mission: null,
          error:
            error.message ||
            "미션을 불러오지 못했습니다.",
          status: error.status ?? null,
        });
      });

    return () => {
      active = false;
    };
  }, [id, requestKey]);

  if (isLoading) {
    return (
      <div>
        <h1 className="page-title">
          장소 미션
        </h1>
        <p role="status">
          미션을 준비하고 있습니다...
        </p>
      </div>
    );
  }

  if (result.error) {
    return (
      <div>
        <h1 className="page-title">
          장소 미션
        </h1>

        <div className="info-box" role="alert">
          <strong>미션을 불러오지 못했습니다.</strong>
          <p>{result.error}</p>

          {result.status === 403 && (
            <p>
              장소 방문 인증이 필요한지 확인해 주세요.
            </p>
          )}
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
          onClick={() =>
            navigate(`/place/${id}/photos`)
          }
        >
          과거 사진으로 돌아가기
        </Button>
      </div>
    );
  }

  const mission = result.mission;

  
  // 이전에 저장된 미션 제출 번호 확인
  const storedSubmissionId = sessionStorage.getItem(
    `memory_coordinates_mission_submission_${id}`
  );

  const savedSubmissionId = Number(storedSubmissionId);

  const hasSavedSubmission =
    storedSubmissionId !== null &&
    Number.isSafeInteger(savedSubmissionId) &&
    savedSubmissionId > 0;

  // 저장된 제출 번호가 있으면 결과 화면으로 이동
  const handleContinueMission = () => {
    if (hasSavedSubmission) {
      navigate(
        `/place/${id}/mission/result?submissionId=${savedSubmissionId}`
      );
      return;
    }

    handleStartSubmit();
  };


  const handleStartSubmit = () => {
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

      {/* 실제 미션 내용 */}
      <div className="info-box">
        <strong>{mission.title}</strong>

        <p style={{ lineHeight: 1.7 }}>
          {mission.content}
        </p>
      </div>

      {/* 단계별 수행 가이드 */}
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

      {/* 미션 성공 시 예상 보상 */}
      <div className="info-box">
        <strong>미션 성공 시 보상</strong>

        <p>{mission.reward_name}</p>

        {mission.reward_detail && (
          <p style={{ fontSize: 13, opacity: 0.8 }}>
            {mission.reward_detail}
          </p>
        )}
      </div>

      
      <Button onClick={handleContinueMission}>
        {hasSavedSubmission
          ? "기존 미션 인증 결과 확인"
          : "수행 완료 · 인증으로"}
      </Button>


      <div className="gap" />

      <Button
        variant="secondary"
        onClick={() =>
          navigate(`/place/${id}/photos`)
        }
      >
        과거 사진으로 돌아가기
      </Button>
    </div>
  );
}

export default MissionPage;
