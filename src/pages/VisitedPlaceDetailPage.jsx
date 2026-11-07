
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getMyVisitDetail } from "../api/mypage";
import Button from "../components/Button";

import "./MyPage.css";
import "./PlacePages.css";

// 날짜를 한국 시간으로 표시
function formatDate(value) {
  if (!value) return "날짜 정보 없음";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "날짜 정보 없음";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(date);
}

const STATUS_LABELS = {
  SUCCESS: "인증 성공",
  FAILED: "인증 실패",
  PENDING: "심사 대기",
  ERROR: "인증 오류",
};

const VERIFY_METHOD_LABELS = {
  GPS: "GPS 위치 인증",
  PHOTO: "사진 인증",
};

function VisitedPlaceDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // 여기서 id는 장소 ID가 아니라 방문 기록 ID
  const visitId = Number(id);

  const validVisitId =
    /^[1-9]\d*$/.test(id ?? "") &&
    Number.isSafeInteger(visitId);

  const [retryCount, setRetryCount] = useState(0);

  const [result, setResult] = useState({
    key: null,
    data: null,
    error: "",
  });

  const requestKey = `${id}-${retryCount}`;
  const isLoading =
    validVisitId && result.key !== requestKey;

  // 방문 기록 상세 조회
  useEffect(() => {
    if (!validVisitId) return;

    let active = true;

    getMyVisitDetail(visitId)
      .then((data) => {
        if (!active) return;

        if (
          !data ||
          Number(data.visit_id) !== visitId ||
          !data.place ||
          !Number.isSafeInteger(
            Number(data.place.place_id)
          ) ||
          !Array.isArray(data.mission_histories)
        ) {
          throw new Error(
            "방문 상세 응답 형식이 올바르지 않습니다."
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
            "방문 상세정보를 불러오지 못했습니다.",
        });
      });

    return () => {
      active = false;
    };
  }, [visitId, validVisitId, requestKey]);

  // 잘못된 방문 기록 ID
  if (!validVisitId) {
    return (
      <div>
        <h1 className="page-title">방문 장소 상세</h1>

        <div className="info-box">
          올바르지 않은 방문 기록 번호입니다.
        </div>

        <Button
          onClick={() => navigate("/mypage/places")}
        >
          방문 장소 목록으로
        </Button>
      </div>
    );
  }

  // 로딩
  if (isLoading) {
    return (
      <div>
        <h1 className="page-title">방문 장소 상세</h1>

        <p role="status">
          방문 기록을 불러오는 중입니다...
        </p>
      </div>
    );
  }

  // API 오류
  if (result.error) {
    return (
      <div>
        <h1 className="page-title">방문 장소 상세</h1>

        <div className="info-box" role="alert">
          <strong>방문 기록 조회 실패</strong>
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
          onClick={() => navigate("/mypage/places")}
        >
          방문 장소 목록으로
        </Button>
      </div>
    );
  }

  const visit = result.data;
  const place = visit.place;
  const histories = visit.mission_histories;

  const imageSource = place.image_source || "";
  const sourceUrl =
    imageSource.match(/https?:\/\/[^\s)]+/)?.[0] ?? null;

  const sourceName = imageSource
    .replace(/\(https?:\/\/[^)]*\)/, "")
    .trim();

  return (
    <div>
      <span className="badge">
        인증한 방문 장소
      </span>

      <h1 className="page-title">
        {place.name}
      </h1>

      <p className="page-desc">
        내가 방문하고 기록한 장소입니다.
      </p>

      {/* 실제 장소 대표 이미지 */}
      {place.image_url ? (
        <div
          style={{
            padding: 12,
            borderRadius: 12,
            background: "rgba(128,128,128,0.08)",
          }}
        >
          <img
            src={place.image_url}
            alt={`${place.name} 대표 사진`}
            style={{
              display: "block",
              width: "100%",
              maxHeight: 300,
              objectFit: "contain",
              borderRadius: 8,
            }}
          />
        </div>
      ) : (
        <div className="info-box">
          등록된 장소 대표 사진이 없습니다.
        </div>
      )}

      {/* 이미지 출처 */}
      {sourceName && (
        <p
          style={{
            fontSize: 12,
            opacity: 0.75,
            marginTop: 8,
          }}
        >
          {sourceName}

          {sourceUrl && (
            <>
              {" · "}
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                출처 원문 보기
              </a>
            </>
          )}
        </p>
      )}

      {/* 장소 상세정보 */}
      <div className="info-box">
        <strong>장소 상세정보</strong>

        <div className="info-row">
          <span>장소명</span>
          <span>{place.name}</span>
        </div>

        <div className="info-row">
          <span>주소</span>
          <span>{place.address || "주소 정보 없음"}</span>
        </div>

        {place.description && (
          <p style={{ lineHeight: 1.7 }}>
            {place.description}
          </p>
        )}
      </div>

      {/* 방문 인증 정보 */}
      <div className="info-box">
        <strong>나의 방문 인증</strong>

        <div className="info-row">
          <span>인증 방식</span>
          <span>
            {VERIFY_METHOD_LABELS[visit.verify_method] ||
              visit.verify_method ||
              "정보 없음"}
          </span>
        </div>

        <div className="info-row">
          <span>방문 인증일</span>
          <span>{formatDate(visit.verified_at)}</span>
        </div>

        <div className="info-row">
          <span>방문 기록 번호</span>
          <span>{visit.visit_id}</span>
        </div>
      </div>

      {/* 해당 장소의 미션 수행 기록 */}
      <h2
        style={{
          fontSize: 18,
          marginTop: 24,
          marginBottom: 12,
        }}
      >
        미션 수행 내역
      </h2>

      {histories.length === 0 ? (
        <div className="info-box">
          <strong>아직 수행한 미션이 없습니다.</strong>

          <p>
            이 장소의 과거 사진을 확인하고
            미션에 도전해 보세요.
          </p>

          <Button
            onClick={() =>
              navigate(`/place/${place.place_id}/mission`)
            }
          >
            장소 미션 확인하기
          </Button>
        </div>
      ) : (
        histories.map((history, index) => {
          const submissionId = Number(
            history.submission_id
          );

          const validSubmissionId =
            Number.isSafeInteger(submissionId) &&
            submissionId > 0;

          const failed =
            history.status === "FAILED" ||
            history.status === "ERROR";

          return (
            <div
              className="info-box"
              key={
                validSubmissionId
                  ? submissionId
                  : `history-${index}`
              }
            >
              <span
                className={
                  failed
                    ? "badge badge-fail"
                    : "badge"
                }
              >
                {STATUS_LABELS[history.status] ||
                  history.status ||
                  "상태 확인"}
              </span>

              <p>
                <strong>
                  {history.mission_title ||
                    "장소 미션"}
                </strong>
              </p>

              <p
                style={{
                  fontSize: 12,
                  opacity: 0.7,
                }}
              >
                제출일: {formatDate(history.submitted_at)}
              </p>

              {/* 내가 제출했던 관찰 기록 */}
              {history.proof_text && (
                <div style={{ marginTop: 12 }}>
                  <strong>제출한 관찰 기록</strong>

                  <p style={{ lineHeight: 1.7 }}>
                    {history.proof_text}
                  </p>
                </div>
              )}

              {/* 실제 미션 심사 피드백 */}
              {history.ai_feedback && (
                <div style={{ marginTop: 12 }}>
                  <strong>미션 심사 결과</strong>

                  <p style={{ lineHeight: 1.7 }}>
                    {history.ai_feedback}
                  </p>
                </div>
              )}

              {validSubmissionId && (
                <Button
                  variant="secondary"
                  onClick={() =>
                    navigate(
                      `/place/${place.place_id}/mission/result?submissionId=${submissionId}`
                    )
                  }
                >
                  인증 결과 자세히 보기
                </Button>
              )}
            </div>
          );
        })
      )}

      <div className="gap" />

      <Button
        onClick={() => navigate("/mypage/places")}
      >
        방문 장소 목록으로
      </Button>

      <div className="gap" />

      <Button
        variant="secondary"
        onClick={() =>
          navigate(`/place/${place.place_id}`)
        }
      >
        장소 상세 페이지로
      </Button>
    </div>
  );
}

export default VisitedPlaceDetailPage;
