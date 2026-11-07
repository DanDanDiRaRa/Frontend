
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyVisitedPlaces } from "../api/mypage";

import Card from "../components/Card";
import Button from "../components/Button";

import "./MyPage.css";

function VisitedPlacesPage() {
  const navigate = useNavigate();

  const [retryCount, setRetryCount] = useState(0);

  const [result, setResult] = useState({
    key: null,
    data: null,
    error: "",
  });

  const isLoading = result.key !== retryCount;

  // 방문 인증 완료한 장소 조회
  useEffect(() => {
    let active = true;

    getMyVisitedPlaces()
      .then((data) => {
        if (!active) return;

        if (
          !data ||
          !Array.isArray(data.visits)
        ) {
          throw new Error(
            "방문 장소 목록 응답 형식이 올바르지 않습니다."
          );
        }

        setResult({
          key: retryCount,
          data,
          error: "",
        });
      })
      .catch((error) => {
        if (!active) return;

        setResult({
          key: retryCount,
          data: null,
          error:
            error.message ||
            "방문 장소를 불러오지 못했습니다.",
        });
      });

    return () => {
      active = false;
    };
  }, [retryCount]);

  // 방문 인증 날짜 표시
  const formatDate = (dateString) => {
    if (!dateString) return "날짜 정보 없음";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "날짜 정보 없음";
    }

    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Seoul",
    }).format(date);
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div>
        <h1 className="page-title">
          방문한 장소
        </h1>

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
        <h1 className="page-title">
          방문한 장소
        </h1>

        <div className="info-box" role="alert">
          <strong>방문 기록 조회 실패</strong>
          <p>{result.error}</p>
        </div>

        <Button
          onClick={() =>
            setRetryCount((count) => count + 1)
          }
        >
          다시 시도
        </Button>

        <div style={{ height: 12 }} />

        <Button
          variant="secondary"
          onClick={() => navigate("/mypage")}
        >
          마이페이지로 돌아가기
        </Button>
      </div>
    );
  }

  const data = result.data;
  const visits = data.visits;

  return (
    <div>
      <h1 className="page-title">
        방문한 장소
      </h1>

      <p className="page-desc">
        방문 인증을 완료한 장소들을 확인해 보세요.
      </p>

      {/* 방문 장소 수 */}
      <div className="info-box">
        <strong>나의 방문 기록</strong>

        <p
          style={{
            fontSize: 24,
            fontWeight: 700,
            marginTop: 8,
          }}
        >
          {data.total_count ?? visits.length}곳
        </p>
      </div>

      {/* 방문 기록 없음 */}
      {visits.length === 0 ? (
        <div className="empty">
          {data.empty_message ||
            "아직 방문 인증한 장소가 없습니다."}
        </div>
      ) : (
        /* 실제 방문 장소 목록 */
        visits.map((visit, index) => {
          const visitId = Number(visit.visit_id);

          const validVisitId =
            Number.isSafeInteger(visitId) &&
            visitId > 0;

          return (
            <Card
              key={
                validVisitId
                  ? visitId
                  : `visit-${index}`
              }
              index={String(index + 1).padStart(2, "0")}
              title={visit.place_name || "방문 장소"}
              desc={[
                visit.address_summary,
                `인증일: ${formatDate(visit.verified_at)}`,
              ]
                .filter(Boolean)
                .join(" · ")}
              onClick={
                validVisitId
                  ? () =>
                      navigate(
                        `/mypage/places/${visitId}`
                      )
                  : undefined
              }
            />
          );
        })
      )}

      <div style={{ height: 16 }} />

      <Button onClick={() => navigate("/map")}>
        새로운 장소 탐색
      </Button>

      <div style={{ height: 12 }} />

      <Button
        variant="secondary"
        onClick={() =>
          setRetryCount((count) => count + 1)
        }
      >
        방문 기록 새로고침
      </Button>
    </div>
  );
}

export default VisitedPlacesPage;
