
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getRewardDetail } from "../api/rewards";
import Button from "../components/Button";

import "./MyPage.css";
import "./PlacePages.css";

function RewardDetailPage() {
  const navigate = useNavigate();
  const { rewardId } = useParams();

  const [retryCount, setRetryCount] = useState(0);

  const [result, setResult] = useState({
    key: null,
    data: null,
    error: "",
  });

  const numericRewardId = Number(rewardId);

  const validId =
    Number.isSafeInteger(numericRewardId) &&
    numericRewardId > 0;

  const requestKey = `${rewardId}-${retryCount}`;
  const isLoading = validId && result.key !== requestKey;

  // 서버에서 실제 보상 상세 정보 조회
  useEffect(() => {
    if (!validId) return;

    let active = true;

    getRewardDetail(numericRewardId)
      .then((data) => {
        if (!active) return;

        if (
          !data ||
          Number(data.reward_id) !== numericRewardId ||
          typeof data.reward_name !== "string"
        ) {
          throw new Error(
            "보상 상세 응답 형식이 올바르지 않습니다."
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
            "보상 상세 정보를 불러오지 못했습니다.",
        });
      });

    return () => {
      active = false;
    };
  }, [numericRewardId, validId, requestKey]);

  if (!validId) {
    return (
      <div>
        <h1 className="page-title">보상 상세</h1>

        <div className="info-box">
          올바르지 않은 보상 번호입니다.
        </div>

        <Button onClick={() => navigate("/mypage/rewards")}>
          내 보상 목록
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <h1 className="page-title">보상 상세</h1>

        <p role="status">
          보상 정보를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  if (result.error) {
    return (
      <div>
        <h1 className="page-title">보상 상세</h1>

        <div className="info-box" role="alert">
          <strong>보상 정보 조회 실패</strong>
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
          onClick={() => navigate("/mypage/rewards")}
        >
          내 보상 목록
        </Button>
      </div>
    );
  }

  const reward = result.data;

  // 지급 날짜를 한국어로 표시
  const issuedDate = reward.issued_at
    ? new Date(reward.issued_at)
    : null;

  const formattedDate =
    issuedDate && !Number.isNaN(issuedDate.getTime())
      ? new Intl.DateTimeFormat("ko-KR", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(issuedDate)
      : "확인되지 않음";

  return (
    <div>
      <span className="badge">
        {reward.issued_status === "COMPLETED"
          ? "지급 완료"
          : "획득 보상"}
      </span>

      <h1 className="page-title">
        {reward.reward_name}
      </h1>

      <p className="page-desc">
        {reward.place_name}에서 획득한 보상입니다.
      </p>

      {/* 보상 설명 */}
      <div className="info-box">
        <strong>보상 상세정보</strong>

        <p style={{ lineHeight: 1.7 }}>
          {reward.reward_detail ||
            "등록된 보상 설명이 없습니다."}
        </p>
      </div>

      {/* 실제 지급 정보 */}
      <div className="info-box">
        <div className="info-row">
          <span>보상 번호</span>
          <span>{reward.reward_id}</span>
        </div>

        <div className="info-row">
          <span>획득 장소</span>
          <span>{reward.place_name}</span>
        </div>

        <div className="info-row">
          <span>보상 수량</span>
          <span>{reward.quantity}개</span>
        </div>

        <div className="info-row">
          <span>지급 상태</span>
          <span>
            {reward.issued_status === "COMPLETED"
              ? "지급 완료"
              : reward.issued_status || "상태 확인 필요"}
          </span>
        </div>

        <div className="info-row">
          <span>지급 일시</span>
          <span>{formattedDate}</span>
        </div>
      </div>

      <Button
        onClick={() => navigate("/mypage/rewards")}
      >
        내 보상 목록
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

export default RewardDetailPage;
