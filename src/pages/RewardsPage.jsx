
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyRewards } from "../api/rewards";

import Card from "../components/Card";
import Button from "../components/Button";

import "./MyPage.css";

function RewardsPage() {
  const navigate = useNavigate();

  const [retryCount, setRetryCount] = useState(0);

  const [result, setResult] = useState({
    key: null,
    data: null,
    error: "",
  });

  const isLoading = result.key !== retryCount;

  // 로그인한 사용자의 보상 목록 조회
  useEffect(() => {
    let active = true;

    getMyRewards()
      .then((data) => {
        if (!active) return;

        if (!data || !Array.isArray(data.rewards)) {
          throw new Error(
            "보상 목록 응답 형식이 올바르지 않습니다."
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
            "보상 목록을 불러오지 못했습니다.",
        });
      });

    return () => {
      active = false;
    };
  }, [retryCount]);

  // 로딩
  if (isLoading) {
    return (
      <div>
        <h1 className="page-title">
          획득한 보상 내역
        </h1>

        <p role="status">
          보상 목록을 불러오는 중입니다...
        </p>
      </div>
    );
  }

  // 오류
  if (result.error) {
    return (
      <div>
        <h1 className="page-title">
          획득한 보상 내역
        </h1>

        <div className="info-box" role="alert">
          <strong>보상 목록 조회 실패</strong>
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
  const rewards = data.rewards;

  return (
    <div>
      <h1 className="page-title">
        획득한 보상 내역
      </h1>

      <p className="page-desc">
        장소 탐색과 미션 수행으로 획득한 보상을
        확인할 수 있어요.
      </p>

      {/* 총 보상 개수 */}
      <div className="info-box">
        <strong>내가 획득한 보상</strong>

        <p style={{ fontSize: 24, fontWeight: 700 }}>
          {data.total_count ?? rewards.length}개
        </p>
      </div>

      {/* 보상 없음 */}
      {rewards.length === 0 ? (
        <div className="empty">
          {data.empty_message ||
            "아직 획득한 보상이 없습니다."}
        </div>
      ) : (
        /* 실제 보상 목록 */
        rewards.map((reward, index) => {
          const rewardId = Number(reward.reward_id);

          const hasValidId =
            Number.isSafeInteger(rewardId) &&
            rewardId > 0;

          const description = [
            reward.place_name,
            reward.quantity != null
              ? `수량 ${reward.quantity}개`
              : null,
          ]
            .filter(Boolean)
            .join(" · ");

          return (
            <Card
              key={
                hasValidId
                  ? rewardId
                  : `reward-${index}`
              }
              title={
                reward.reward_name ||
                "획득한 보상"
              }
              desc={
                description ||
                reward.reward_detail ||
                "보상 상세정보"
              }
              onClick={
                hasValidId
                  ? () =>
                      navigate(
                        `/mypage/rewards/${rewardId}`
                      )
                  : undefined
              }
            />
          );
        })
      )}

      <div style={{ height: 16 }} />

      <Button onClick={() => navigate("/map")}>
        지도에서 미션 탐색
      </Button>

      <div style={{ height: 12 }} />

      <Button
        variant="secondary"
        onClick={() =>
          setRetryCount((count) => count + 1)
        }
      >
        보상 목록 새로고침
      </Button>
    </div>
  );
}

export default RewardsPage;
