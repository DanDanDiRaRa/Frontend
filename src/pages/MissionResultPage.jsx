
import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import { getMissionSubmissionResult } from "../api/mission";
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

  const [retryCount, setRetryCount] = useState(0);

  const [result, setResult] = useState({
    key: null,
    data: null,
    error: "",
  });

  // URL 또는 저장된 제출 번호 확인
  const savedSubmissionId = sessionStorage.getItem(
    `memory_coordinates_mission_submission_${id}`
  );

  const rawSubmissionId =
    searchParams.get("submissionId") || savedSubmissionId;

  const submissionId = Number(rawSubmissionId);

  const hasValidSubmissionId =
    Number.isSafeInteger(submissionId) && submissionId > 0;

  const requestKey = `${id}-${submissionId}-${retryCount}`;

  const isLoading =
    hasValidSubmissionId && result.key !== requestKey;

  // 서버에서 실제 인증 결과 조회
  useEffect(() => {
    if (!hasValidSubmissionId) return;

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
            "미션 결과를 불러오지 못했습니다.",
        });
      });

    return () => {
      active = false;
    };
  }, [
    id,
    submissionId,
    hasValidSubmissionId,
    requestKey,
  ]);

  // 제출 번호를 모르는 경우
  if (!hasValidSubmissionId) {
    return (
      <div>
        <h1 className="page-title">
          미션 인증 결과
        </h1>

        <div className="info-box">
          <strong>조회할 인증 기록이 없습니다.</strong>

          <p>
            제출 번호를 확인할 수 없습니다.
            미션 화면에서 다시 확인해 주세요.
          </p>
        </div>

        <Button
          onClick={() =>
            navigate(`/place/${id}/mission`)
          }
        >
          미션 화면으로 돌아가기
        </Button>
      </div>
    );
  }

  // 로딩 중
  if (isLoading) {
    return (
      <div>
        <h1 className="page-title">
          미션 인증 결과
        </h1>

        <p role="status">
          실제 인증 결과를 확인하는 중입니다...
        </p>
      </div>
    );
  }

  // 결과 조회 실패
  if (result.error) {
    return (
      <div>
        <h1 className="page-title">
          미션 인증 결과
        </h1>

        <div className="info-box" role="alert">
          <strong>결과 조회 실패</strong>
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
            navigate(`/place/${id}/mission`)
          }
        >
          미션 화면으로
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

  // 서버가 실제로 보상 수령을 허용해야 함
  const canClaimReward =
    isSuccess && submission.can_claim_reward === true;

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
        제출한 미션의 실제 심사 결과입니다.
      </p>

      {/* 심사 결과 */}
      <div className="info-box" role="status">
        <strong>
          {STATUS_LABELS[status] || status}
        </strong>

        <p style={{ lineHeight: 1.7 }}>
          {submission.ai_feedback ||
            "심사 결과에 대한 추가 안내가 없습니다."}
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
          <span>보상 수령</span>
          <span>
            {canClaimReward ? "가능" : "현재 불가"}
          </span>
        </div>
      </div>

      {/* 인증 성공 + 보상 수령 가능 */}
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
          보상 수령으로
        </Button>
      )}

      {/* 심사 대기 중 */}
      {isPending && (
        <Button
          onClick={() =>
            setRetryCount((count) => count + 1)
          }
        >
          심사 결과 다시 확인
        </Button>
      )}

      {/* 심사 실패 또는 오류 */}
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
        onClick={() =>
          navigate(`/place/${id}/mission`)
        }
      >
        미션 내용 다시 보기
      </Button>
    </div>
  );
}

export default MissionResultPage;
