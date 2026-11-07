
import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { getMyMissionSubmissions } from "../api/mission";
import { claimReward } from "../api/rewards";
import Button from "../components/Button";

import "./MyPage.css";
import "./PlacePages.css";

const STATUS_LABELS = {
  SUCCESS: "인증 성공",
  FAILED: "인증 실패",
  PENDING: "심사 대기 중",
  ERROR: "인증 오류",
};

function RewardResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const placeId = Number(id);
  const validPlaceId =
    Number.isSafeInteger(placeId) && placeId > 0;

  // 미션 결과 화면에서 전달한 제출 번호 (선택)
  const requestedId = location.state?.submissionId ?? null;

  const [retryCount, setRetryCount] = useState(0);

  const [result, setResult] = useState({
    key: null,
    submission: null,
    error: "",
  });

  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState("");
  const [claimResult, setClaimResult] = useState(null);

  const requestKey = `${id}-${requestedId ?? "latest"}-${retryCount}`;
  const isLoading =
    validPlaceId && result.key !== requestKey;

  // 내 미션 제출 기록과 보상 수령 상태 확인
  useEffect(() => {
    if (!validPlaceId) return;

    let active = true;

    async function loadSubmission() {
      try {
        const history = await getMyMissionSubmissions(placeId);

        if (!history || !Array.isArray(history.submissions)) {
          throw new Error(
            "미션 제출 내역 형식이 올바르지 않습니다."
          );
        }

        const submissions = history.submissions.filter(
          (item) => Number(item.place_id) === placeId
        );

        let selected = null;

        if (requestedId !== null) {
          // 전달받은 제출 번호가 있으면 해당 기록을 사용
          const submissionId = Number(requestedId);

          if (
            !Number.isSafeInteger(submissionId) ||
            submissionId <= 0
          ) {
            throw new Error("올바르지 않은 제출 번호입니다.");
          }

          selected = submissions.find(
            (item) =>
              Number(item.submission_id) === submissionId
          );

          if (!selected) {
            throw new Error(
              "현재 계정에서 해당 제출 기록을 찾을 수 없습니다."
            );
          }
        } else {
          // 없으면 가장 최근 성공 기록을 우선 사용
          selected =
            submissions.find(
              (item) => item.status === "SUCCESS"
            ) ??
            submissions[0] ??
            null;
        }

        if (!active) return;

        setResult({
          key: requestKey,
          submission: selected,
          error: "",
        });
      } catch (error) {
        if (!active) return;

        setResult({
          key: requestKey,
          submission: null,
          error:
            error.message ||
            "보상 수령 상태를 확인하지 못했습니다.",
        });
      }
    }

    loadSubmission();

    return () => {
      active = false;
    };
  }, [placeId, validPlaceId, requestedId, requestKey]);

  if (!validPlaceId) {
    return (
      <div>
        <h1 className="page-title">보상 수령</h1>
        <p>올바르지 않은 장소 번호입니다.</p>
        <Button onClick={() => navigate("/map")}>
          지도로 돌아가기
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <h1 className="page-title">보상 수령</h1>
        <p role="status">
          미션과 보상 기록을 확인하고 있습니다...
        </p>
      </div>
    );
  }

  if (result.error) {
    return (
      <div>
        <h1 className="page-title">보상 수령</h1>

        <div className="info-box" role="alert">
          <strong>보상 상태 조회 실패</strong>
          <p>{result.error}</p>
        </div>

        <Button
          onClick={() =>
            setRetryCount((count) => count + 1)
          }
        >
          다시 조회하기
        </Button>

        <div className="gap" />

        <Button
          variant="secondary"
          onClick={() =>
            navigate(`/place/${id}/mission/result`)
          }
        >
          미션 결과로 돌아가기
        </Button>
      </div>
    );
  }

  const submission = result.submission;

  if (!submission) {
    return (
      <div>
        <h1 className="page-title">보상 수령</h1>

        <div className="info-box">
          <strong>미션 제출 내역이 없습니다.</strong>
          <p>
            먼저 장소 미션을 수행하고 인증해 주세요.
          </p>
        </div>

        <Button
          onClick={() => navigate(`/place/${id}/mission`)}
        >
          미션 확인하기
        </Button>
      </div>
    );
  }

  const rewardId = Number(submission.reward_id);

  const hasReward =
    submission.reward_id != null &&
    Number.isSafeInteger(rewardId) &&
    rewardId > 0;

  const claimedReward =
    claimResult?.submissionId === submission.submission_id
      ? claimResult.data
      : null;

  const canClaim =
    submission.status === "SUCCESS" &&
    submission.can_claim_reward === true &&
    !hasReward &&
    !claimedReward;

  // 서버에 보상 지급 요청
  const handleClaimReward = async () => {
    if (!canClaim || claiming) return;

    setClaiming(true);
    setClaimError("");

    try {
      const data = await claimReward(submission.submission_id);

      if (
        !Number.isSafeInteger(data?.reward_id) ||
        data.reward_id <= 0 ||
        Number(data.place_id) !== placeId
      ) {
        throw new Error(
          "보상 지급 응답 형식이 올바르지 않습니다."
        );
      }

      setClaimResult({
        submissionId: submission.submission_id,
        data,
      });
    } catch (error) {
      setClaimError(
        error.message ||
        "보상 지급에 실패했습니다. 다시 시도해 주세요."
      );
    } finally {
      setClaiming(false);
    }
  };

  // 이미 지급받았거나 방금 지급받은 보상
  if (hasReward || claimedReward) {
    const currentRewardId =
      claimedReward?.reward_id ?? rewardId;

    return (
      <div>
        <span className="badge">지급 완료</span>

        <h1 className="page-title">
          보상 획득 완료!
        </h1>

        <p className="page-desc">
          이 미션의 보상이 정상적으로 지급되어 있습니다.
        </p>

        <div className="info-box">
          <strong>
            {claimedReward?.reward_name ||
              "획득한 보상"}
          </strong>

          {claimedReward?.reward_detail && (
            <p>{claimedReward.reward_detail}</p>
          )}

          <div className="info-row">
            <span>보상 번호</span>
            <span>{currentRewardId}</span>
          </div>

          <div className="info-row">
            <span>제출 번호</span>
            <span>{submission.submission_id}</span>
          </div>

          {claimedReward && (
            <div className="info-row">
              <span>보상 수량</span>
              <span>{claimedReward.quantity}개</span>
            </div>
          )}
        </div>

        <Button
          onClick={() =>
            navigate(`/mypage/rewards/${currentRewardId}`)
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
        미션 심사 결과에 따라 보상을 수령할 수 있어요.
      </p>

      <div className="info-box">
        <strong>미션 인증 정보</strong>

        <div className="info-row">
          <span>인증 상태</span>
          <span>
            {STATUS_LABELS[submission.status] ||
              submission.status}
          </span>
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
          <p style={{ lineHeight: 1.7 }}>
            {submission.ai_feedback}
          </p>
        )}
      </div>

      {claimError && (
        <div className="info-box" role="alert">
          <strong>보상 지급 실패</strong>
          <p>{claimError}</p>
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
          아직 보상을 수령할 수 없습니다.
          미션 인증 결과를 확인해 주세요.
        </div>
      )}

      <div className="gap" />

      <Button
        variant="secondary"
        onClick={() =>
          navigate(`/place/${id}/mission/result`)
        }
      >
        미션 인증 결과 확인
      </Button>
    </div>
  );
}

export default RewardResultPage;
