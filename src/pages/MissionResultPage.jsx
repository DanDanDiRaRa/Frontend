
import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import {
  getMyMissionSubmissions,
  getMissionSubmissionResult,
} from "../api/mission";

import Button from "../components/Button";

import "./MyPage.css";
import "./PlacePages.css";

const STATUS_LABELS = {
  SUCCESS: "인증 성공",
  FAILED: "인증 실패",
  PENDING: "심사 대기 중",
  ERROR: "인증 오류",
};

function MissionResultPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const requestedId = searchParams.get("submissionId");

  const [retryCount, setRetryCount] = useState(0);

  const [result, setResult] = useState({
    key: null,
    data: null,
    empty: false,
    error: "",
  });

  const requestKey = `${id}-${requestedId ?? "latest"}-${retryCount}`;
  const isLoading = result.key !== requestKey;

  // 서버에 저장된 실제 미션 기록 조회
  useEffect(() => {
    let active = true;

    async function loadResult() {
      try {
        // 1. 현재 사용자의 해당 장소 제출 목록 조회
        const history = await getMyMissionSubmissions(id);

        if (!history || !Array.isArray(history.submissions)) {
          throw new Error(
            "미션 제출 목록 형식이 올바르지 않습니다."
          );
        }

        const submissions = history.submissions.filter(
          (item) => Number(item.place_id) === Number(id)
        );

        // 제출 내역이 없는 경우
        if (submissions.length === 0) {
          if (active) {
            setResult({
              key: requestKey,
              data: null,
              empty: true,
              error: "",
            });
          }
          return;
        }

        let selectedSubmission;

        // 2. URL에 제출 번호가 있다면 해당 기록 선택
        if (requestedId !== null) {
          const numericId = Number(requestedId);

          if (
            !/^[1-9]\d*$/.test(requestedId) ||
            !Number.isSafeInteger(numericId)
          ) {
            throw new Error("올바르지 않은 제출 번호입니다.");
          }

          selectedSubmission = submissions.find(
            (item) => Number(item.submission_id) === numericId
          );

          if (!selectedSubmission) {
            throw new Error(
              "현재 계정에서 해당 미션 제출 기록을 찾을 수 없습니다."
            );
          }
        } else {
          // 3. 제출 번호가 없다면 성공 기록을 우선 사용
          selectedSubmission =
            submissions.find(
              (item) => item.status === "SUCCESS"
            ) ?? submissions[0];
        }

        // 4. 선택된 제출의 최신 심사 결과 조회
        const detail = await getMissionSubmissionResult(
          selectedSubmission.submission_id
        );

        if (
          !detail ||
          Number(detail.submission_id) !==
            Number(selectedSubmission.submission_id) ||
          Number(detail.mission_id) !==
            Number(selectedSubmission.mission_id) ||
          Number(detail.place_id) !== Number(id) ||
          typeof detail.status !== "string" ||
          typeof detail.can_claim_reward !== "boolean"
        ) {
          throw new Error(
            "미션 인증 결과 형식이 올바르지 않습니다."
          );
        }

        if (!active) return;

        // 보상 ID는 제출 목록 API에서 제공
        setResult({
          key: requestKey,
          data: {
            ...detail,
            reward_id: selectedSubmission.reward_id ?? null,
          },
          empty: false,
          error: "",
        });
      } catch (error) {
        if (!active) return;

        setResult({
          key: requestKey,
          data: null,
          empty: false,
          error:
            error.message ||
            "미션 결과를 불러오지 못했습니다.",
        });
      }
    }

    loadResult();

    return () => {
      active = false;
    };
  }, [id, requestedId, requestKey]);

  // 로딩
  if (isLoading) {
    return (
      <div>
        <h1 className="page-title">미션 인증 결과</h1>
        <p role="status">
          기존 미션 인증 기록을 확인하고 있습니다...
        </p>
      </div>
    );
  }

  // 오류
  if (result.error) {
    return (
      <div>
        <h1 className="page-title">미션 인증 결과</h1>

        <div className="info-box" role="alert">
          <strong>미션 결과 조회 실패</strong>
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
          onClick={() => navigate(`/place/${id}/mission`)}
        >
          미션 화면으로 돌아가기
        </Button>
      </div>
    );
  }

  // 제출 내역이 없는 경우
  if (result.empty) {
    return (
      <div>
        <h1 className="page-title">미션 인증 결과</h1>

        <div className="info-box">
          <strong>아직 제출한 미션이 없습니다.</strong>
          <p>
            장소 미션을 수행한 뒤 인증 자료를 제출해 주세요.
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

  const submission = result.data;
  const status = submission.status;

  const isSuccess = status === "SUCCESS";
  const isFailed = status === "FAILED";
  const isPending = status === "PENDING";
  const isError = status === "ERROR";

  const rewardId = Number(submission.reward_id);

  const hasReward =
    submission.reward_id != null &&
    Number.isSafeInteger(rewardId) &&
    rewardId > 0;

  const canClaimReward =
    isSuccess &&
    submission.can_claim_reward === true &&
    !hasReward;

  return (
    <div>
      <span
        className={
          isFailed || isError
            ? "badge badge-fail"
            : "badge"
        }
      >
        {STATUS_LABELS[status] || "결과 확인"}
      </span>

      <h1 className="page-title">
        미션 인증 결과
      </h1>

      <p className="page-desc">
        서버에 저장된 실제 미션 심사 결과입니다.
      </p>

      {/* 인증 결과 */}
      <div className="info-box" role="status">
        <strong>
          {STATUS_LABELS[status] || status}
        </strong>

        <p style={{ lineHeight: 1.7 }}>
          {submission.ai_feedback ||
            "추가 심사 안내가 없습니다."}
        </p>
      </div>

      {/* 제출 정보 */}
      <div className="info-box">
        <div className="info-row">
          <span>제출 번호</span>
          <span>{submission.submission_id}</span>
        </div>

        <div className="info-row">
          <span>미션 번호</span>
          <span>{submission.mission_id}</span>
        </div>

        <div className="info-row">
          <span>인증 상태</span>
          <span>{STATUS_LABELS[status] || status}</span>
        </div>

        <div className="info-row">
          <span>보상 상태</span>
          <span>
            {hasReward
              ? "수령 완료"
              : canClaimReward
                ? "수령 가능"
                : "현재 수령 불가"}
          </span>
        </div>
      </div>

      {/* 이미 보상을 받았다면 상세 보기 */}
      {hasReward && (
        <Button
          onClick={() =>
            navigate(`/mypage/rewards/${rewardId}`)
          }
        >
          획득한 보상 보기
        </Button>
      )}

      {/* 아직 받지 않은 보상 */}
      {canClaimReward && (
        <Button
          onClick={() =>
            navigate(`/place/${id}/reward`, {
              state: {
                submissionId: submission.submission_id,
              },
            })
          }
        >
          보상 수령하기
        </Button>
      )}

      {/* 심사 대기 */}
      {isPending && (
        <Button
          onClick={() =>
            setRetryCount((count) => count + 1)
          }
        >
          심사 결과 다시 확인
        </Button>
      )}

      {/* 실패 및 오류 */}
      {(isFailed || isError) && (
        <Button
          onClick={() =>
            navigate(`/place/${id}/mission/submit`)
          }
        >
          인증 자료 다시 제출
        </Button>
      )}

      <div className="gap" />

      <Button
        variant="secondary"
        onClick={() => navigate(`/place/${id}/mission`)}
      >
        미션 내용 다시 보기
      </Button>
    </div>
  );
}

export default MissionResultPage;
