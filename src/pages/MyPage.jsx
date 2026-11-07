
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { logOut } from "../api/auth";
import { getMyPageSummary } from "../api/mypage";

import Card from "../components/Card";
import Button from "../components/Button";

import "./MyPage.css";

function MyPage() {
  const navigate = useNavigate();

  const [showLogout, setShowLogout] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [retryCount, setRetryCount] = useState(0);

  const [result, setResult] = useState({
    key: null,
    data: null,
    error: "",
  });

  const isLoading = result.key !== retryCount;

  // 마이페이지 요약 정보 조회
  useEffect(() => {
    let active = true;

    getMyPageSummary()
      .then((data) => {
        if (!active) return;

        if (
          !data ||
          typeof data.account_id !== "string" ||
          !Number.isInteger(data.visited_place_count) ||
          !Number.isInteger(data.total_reward_count)
        ) {
          throw new Error(
            "마이페이지 응답 형식이 올바르지 않습니다."
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
            "마이페이지 정보를 불러오지 못했습니다.",
        });
      });

    return () => {
      active = false;
    };
  }, [retryCount]);

  const summary = isLoading ? null : result.data;

  const nickname =
    summary?.nickname?.trim() ||
    summary?.account_id ||
    "탐색가";

  // 기존 로그아웃 기능 유지
  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await logOut();
    } catch (error) {
      console.warn("서버 로그아웃 요청 실패:", error);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div>
      <h1 className="page-title">
        내 기록과 보상
      </h1>

      <p className="page-desc">
        내가 탐색한 장소와 획득한 보상을 확인해 보세요.
      </p>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="info-box" role="status">
          마이페이지 정보를 불러오는 중입니다...
        </div>
      )}

      {/* API 오류 */}
      {!isLoading && result.error && (
        <div className="info-box" role="alert">
          <strong>정보를 불러오지 못했습니다.</strong>
          <p>{result.error}</p>

          <Button
            onClick={() =>
              setRetryCount((count) => count + 1)
            }
          >
            다시 시도
          </Button>
        </div>
      )}

      {/* 실제 사용자 요약 */}
      {summary && (
        <div className="info-box">
          <strong>{nickname}님의 탐색 기록</strong>

          <p
            style={{
              fontSize: 13,
              opacity: 0.7,
              marginTop: 8,
            }}
          >
            계정: {summary.account_id}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginTop: 16,
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 10,
                background: "rgba(128, 128, 128, 0.08)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 13 }}>
                방문한 장소
              </div>

              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  marginTop: 6,
                }}
              >
                {summary.visited_place_count}
              </div>
            </div>

            <div
              style={{
                padding: 14,
                borderRadius: 10,
                background: "rgba(128, 128, 128, 0.08)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 13 }}>
                획득한 보상
              </div>

              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  marginTop: 6,
                }}
              >
                {summary.total_reward_count}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 기존 메뉴 유지 */}
      <Card
        index="01"
        title="방문 장소"
        desc={
          summary
            ? `방문 완료한 장소 ${summary.visited_place_count}곳`
            : "방문한 장소 목록 확인"
        }
        onClick={() => navigate("/mypage/places")}
      />

      <Card
        index="02"
        title="내 보상"
        desc={
          summary
            ? `획득한 보상 ${summary.total_reward_count}개`
            : "획득한 보상 내역 확인"
        }
        onClick={() => navigate("/mypage/rewards")}
      />

      <Card
        index="03"
        title="회원정보"
        desc="정보 조회 및 수정"
        onClick={() => navigate("/mypage/profile")}
      />

      <div style={{ height: 16 }} />

      <Button
        variant="secondary"
        onClick={() => setShowLogout(true)}
      >
        로그아웃
      </Button>

      {/* 기존 로그아웃 모달 유지 */}
      {showLogout && (
        <div className="modal-bg">
          <div className="modal">
            <strong>로그아웃하시겠어요?</strong>
            <p>현재 계정에서 로그아웃합니다.</p>

            <Button
              variant="secondary"
              disabled={isLoggingOut}
              onClick={() => setShowLogout(false)}
            >
              취소
            </Button>

            <div style={{ height: 8 }} />

            <Button
              disabled={isLoggingOut}
              onClick={handleLogout}
            >
              {isLoggingOut
                ? "로그아웃 중..."
                : "로그아웃"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPage;
