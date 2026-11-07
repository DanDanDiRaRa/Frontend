
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyProfile } from "../api/mypage";
import Button from "../components/Button";

import "./MyPage.css";
import "./PlacePages.css";

// 가입일을 한국 시간으로 표시
function formatDate(value) {
  if (!value) return "정보 없음";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "정보 없음";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Seoul",
  }).format(date);
}

// 가입 방식 표시
const PROVIDER_LABELS = {
  LOCAL: "일반 회원가입",
  KAKAO: "카카오 로그인",
  APPLE: "애플 로그인",
};

function ProfilePage() {
  const navigate = useNavigate();

  const [retryCount, setRetryCount] = useState(0);

  const [result, setResult] = useState({
    key: null,
    data: null,
    error: "",
  });

  const isLoading = result.key !== retryCount;

  // 회원정보 API 호출
  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const data = await getMyProfile();

        if (!active) return;

        if (
          !data ||
          typeof data.account_id !== "string"
        ) {
          throw new Error(
            "회원정보 응답 형식이 올바르지 않습니다."
          );
        }

        setResult({
          key: retryCount,
          data,
          error: "",
        });
      } catch (error) {
        if (!active) return;

        setResult({
          key: retryCount,
          data: null,
          error:
            error.message ||
            "회원정보를 불러오지 못했습니다.",
        });
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [retryCount]);

  // 로딩 화면
  if (isLoading) {
    return (
      <div>
        <h1 className="page-title">회원정보 조회</h1>

        <div className="info-box" role="status">
          회원정보를 불러오는 중입니다...
        </div>
      </div>
    );
  }

  // API 오류 화면
  if (result.error) {
    return (
      <div>
        <h1 className="page-title">회원정보 조회</h1>

        <div className="info-box" role="alert">
          <strong>회원정보 조회 실패</strong>
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
          onClick={() => navigate("/mypage")}
        >
          마이페이지로 돌아가기
        </Button>
      </div>
    );
  }

  const profile = result.data;

  const nickname =
    typeof profile.nickname === "string" &&
    profile.nickname.trim()
      ? profile.nickname
      : "설정된 닉네임 없음";

  const extraInfo =
    typeof profile.extra_info === "string" &&
    profile.extra_info.trim()
      ? profile.extra_info
      : "아직 등록된 추가 정보가 없습니다.";

  return (
    <div>
      <span className="badge">내 계정</span>

      <h1 className="page-title">
        회원정보 조회
      </h1>

      <p className="page-desc">
        내 계정 정보를 확인하고 관리할 수 있어요.
      </p>

      {/* 계정 기본 정보 */}
      <div className="info-box">
        <strong>계정 정보</strong>

        <div className="info-row">
          <span>계정 ID</span>
          <span>{profile.account_id}</span>
        </div>

        <div className="info-row">
          <span>닉네임</span>
          <span>{nickname}</span>
        </div>

        <div className="info-row">
          <span>가입 방식</span>
          <span>
            {PROVIDER_LABELS[profile.provider] ||
              profile.provider ||
              "정보 없음"}
          </span>
        </div>

        <div className="info-row">
          <span>가입일</span>
          <span>
            {formatDate(profile.created_at)}
          </span>
        </div>
      </div>

      {/* 추가 정보 */}
      <div className="info-box">
        <strong>추가 정보</strong>

        <p
          style={{
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
          }}
        >
          {extraInfo}
        </p>
      </div>

      {/* 수정 가능한 항목 안내 */}
      <div className="info-box">
        <strong>회원정보 관리</strong>

        <p style={{ lineHeight: 1.7 }}>
          닉네임과 추가 정보를 변경할 수 있습니다.
          계정 ID는 변경할 수 없습니다.
        </p>
      </div>

      <Button
        onClick={() =>
          navigate("/mypage/profile/edit")
        }
      >
        회원정보 수정
      </Button>

      <div className="gap" />

      <Button
        variant="secondary"
        onClick={() => navigate("/mypage")}
      >
        마이페이지로 돌아가기
      </Button>
    </div>
  );
}

export default ProfilePage;
