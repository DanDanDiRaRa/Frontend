
import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { getMissionSubmissionResult } from "../api/mission";
import { claimReward } from "../api/rewards";
import Button from "../components/Button";

import "./MyPage.css";
import "./PlacePages.css";

function RewardResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // 미션 결과 화면에서 전달받은 제출 번호
  const storedId = sessionStorage.getItem(
    `memory_coordinates_mission_submission_${id}`
  );

  const rawSubmissionId =
    location.state?.submissionId ?? storedId;

  const submissionId = Number(rawSubmissionId);

  const validId =
    Number.isSafeInteger(submissionId) &&
    submissionId > 0;

  const [retryCount, setRetryCount] = useState(0);

  const [result, setResult] = useState({
    key: null,
    data: null,
    error: "",
  });

  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState("");
  const [claimResult, setClaimResult] = useState(null);

  const requestKey = `${id}-${submissionId}-${retryCount}`;
  const rewardKey = `${id}-${submissionId}`;

  const loading = validId && result.key !== requestKey;

  const reward =
    claimResult?.key === rewardKey
      ? claimResult.data
      : null;

  // 실제 미션 인증 결과 확인
  useEffect(() => {
    if (!validId) return;

    let active = true;

    getMissionSubmissionResult(submissionId)
      .then((data) => {
        if (!active) return;

        if (
          !data ||
          Number(data.submission_id) !== submissionId ||
          Number(data.place_id) !== Number(id) ||
          typeof data.status !== "string" ||
          typeof data.can_claim_reward !== "boolean"
        ) {
          throw new Error(
            "미션 인증 결과가 올바르지 않습니다."
          );
        }

        setResult({
          key: requestKey,
          data,
          error: "",
        });
      })
      .catch((error) => {
        if (!active) return;

        setResult({
          key: requestKey,
          data: null,
          error:
            error.message ||
            "미션 인증 결과를 불러오지 못했습니다.",
        });
      });

    return () => {
      active = false;
    };
  }, [id, submissionId, validId, requestKey]);

  const submission = loading ? null : result.data;

  const canClaim =
    submission?.status === "SUCCESS" &&
    submission.can_claim_reward === true;

  // 실제 보상 지급 요청
  const handleClaimReward = async () => {
    if (!canClaim || claiming || reward) return;

    setClaiming(true);
    setClaimError("");

    try {
      const data = await claimReward(submissionId);

      if (
        !Number.isSafeInteger(data?.reward_id) ||
        data.reward_id <= 0 ||
        Number(data.place_id) !== Number(id)
      ) {
        throw new Error(
          "보상 지급 응답 형식이 올바르지 않습니다."
        );
      }

      setClaimResult({
        key: rewardKey,
        data,
      });
    } catch (error) {
      setClaimError(
        error.message ||
        "보상 지급에 실패했습니다. 다시 확인해 주세요."
      );
    } finally {
      setClaiming(false);
    }
  };

  // 제출 번호가 없는 경우
  if (!validId) {
    return (
      <div>
        <h1 className="page-title">보상 수령</h1>

        <div className="info-box">
          <strong>미션 제출 기록을 확인할 수 없습니다.</strong>
          <p>
            미션 인증 결과 화면에서 다시 이동해 주세요.
          </p>
        </div>

        <Button
          onClick={() =>
            navigate(`/place/${id}/mission/result`)
          }
        >
          미션 결과 확인
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <h1 className="page-title">보상 수령</h1>
        <p role="status">
          보상 수령 가능 여부를 확인하는 중입니다...
        </p>
      </div>
    );
  }

  if (result.error) {
    return (
      <div>
        <h1 className="page-title">보상 수령</h1>

        <div className="info-box" role="alert">
          <p>{result.error}</p>
        </div>

        <Button
          onClick={() =>
            setRetryCount((count) => count + 1)
          }
        >
          다시 조회
        </Button>
      </div>
    );
  }

  // 지급 성공 후 화면
  if (reward) {
    return (
      <div>
        <span className="badge">지급 완료</span>

        <h1 className="page-title">
          보상 지급 완료!
        </h1>

        <p className="page-desc">
          미션 수행 보상이 지급되었습니다.
        </p>

        <div className="info-box">
          <strong>{reward.reward_name}</strong>

          <p>{reward.reward_detail}</p>

          <div className="info-row">
            <span>획득 장소</span>
            <span>{reward.place_name}</span>
          </div>

          <div className="info-row">
            <span>보상 수량</span>
            <span>{reward.quantity}개</span>
          </div>

          <div className="info-row">
            <span>보상 번호</span>
            <span>{reward.reward_id}</span>
          </div>
        </div>

        <Button
          onClick={() =>
            navigate(
              `/mypage/rewards/${reward.reward_id}`
            )
          }
        >
          획득한 보상 보기
        </Button>

        <div className="gap" />

        <Button
          variant="secondary"
          onClick={() => navigate("/map")}
        >
          새로운 장소 탐색
        </Button>
      </div>
    );
  }

  return (
    <div>
      <span className="badge">미션 보상</span>

      <h1 className="page-title">
        미션 보상 수령
      </h1>

      <p className="page-desc">
        미션 인증 결과를 확인한 후
        보상을 받을 수 있습니다.
      </p>

      <div className="info-box">
        <strong>미션 인증 결과</strong>

        <div className="info-row">
          <span>인증 상태</span>
          <span>{submission.status}</span>
        </div>

        <div className="info-row">
          <span>제출 번호</span>
          <span>{submission.submission_id}</span>
        </div>

        <div className="info-row">
          <span>보상 수령</span>
          <span>
            {canClaim ? "가능" : "현재 불가"}
          </span>
        </div>

        {submission.ai_feedback && (
          <p>{submission.ai_feedback}</p>
        )}
      </div>

      {claimError && (
        <div className="info-box" role="alert">
          <strong>보상 지급 실패</strong>
          <p>{claimError}</p>

          <p>
            이미 지급된 보상이라면
            내 보상 내역을 확인해 주세요.
          </p>
        </div>
      )}

      {canClaim ? (
        <Button
          onClick={handleClaimReward}
          disabled={claiming}
        >
          {claiming
            ? "보상 지급 처리 중..."
            : "보상 수령하기"}
        </Button>
      ) : (
        <div className="info-box">
          현재 보상을 수령할 수 없습니다.
          이미 지급된 보상인지 내 보상 내역에서
          확인해 주세요.
        </div>
      )}

      <div className="gap" />

      <Button
        variant="secondary"
        onClick={() =>
          navigate("/mypage/rewards")
        }
      >
        내 보상 내역
      </Button>
    </div>
  );
}

export default RewardResultPage;
