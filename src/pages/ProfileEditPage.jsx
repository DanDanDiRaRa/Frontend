
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getMyProfile,
  updateMyProfile,
} from "../api/mypage";

import Button from "../components/Button";

import "./MyPage.css";
import "./PlacePages.css";

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: 12,
  borderRadius: 8,
  border: "1px solid #bbb",
  background: "transparent",
  color: "inherit",
  font: "inherit",
};

function ProfileEditPage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  const [nickname, setNickname] = useState("");
  const [extraInfo, setExtraInfo] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");

  const [retryCount, setRetryCount] = useState(0);

  // 기존 회원정보 불러오기
  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const data = await getMyProfile();

        if (!active) return;

        if (
          !data ||
          typeof data.account_id !== "string" ||
          (data.nickname != null &&
            typeof data.nickname !== "string") ||
          (data.extra_info != null &&
            typeof data.extra_info !== "string")
        ) {
          throw new Error(
            "회원정보 응답 형식이 올바르지 않습니다."
          );
        }

        setProfile(data);

        // 입력창에 기존 정보 표시
        setNickname(data.nickname ?? "");
        setExtraInfo(data.extra_info ?? "");

        setLoadError("");
      } catch (error) {
        if (!active) return;

        setLoadError(
          error.message ||
            "회원정보를 불러오지 못했습니다."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [retryCount]);

  // 회원정보 저장
  const handleSave = async () => {
    if (saving || !profile) return;

    setSaveError("");

    const trimmedNickname = nickname.trim();
    const trimmedExtraInfo = extraInfo.trim();

    // 닉네임 유효성 검사
    const nicknameLength = [
      ...trimmedNickname,
    ].length;

    if (
      nicknameLength < 2 ||
      nicknameLength > 50
    ) {
      setSaveError(
        "닉네임은 2자 이상 50자 이하로 입력해 주세요."
      );
      return;
    }

    // 추가 정보 유효성 검사
    if ([...trimmedExtraInfo].length > 255) {
      setSaveError(
        "추가 정보는 255자 이하로 입력해 주세요."
      );
      return;
    }

    // 변경 사항이 없는 경우
    if (
      trimmedNickname === (profile.nickname ?? "") &&
      trimmedExtraInfo === (profile.extra_info ?? "")
    ) {
      navigate("/mypage/profile");
      return;
    }

    setSaving(true);

    try {
      const saved = await updateMyProfile({
        nickname: trimmedNickname,
        extra_info: trimmedExtraInfo,
      });

      // 서버가 실제로 수정 결과를 반환했는지 검증
      if (
        !saved ||
        saved.account_id !== profile.account_id ||
        saved.nickname !== trimmedNickname
      ) {
        throw new Error(
          "회원정보 저장 응답을 확인할 수 없습니다."
        );
      }

      // 저장 성공 후 조회 화면으로 이동
      navigate("/mypage/profile", {
        replace: true,
      });
    } catch (error) {
      setSaveError(
        error.message ||
          "회원정보 저장에 실패했습니다. 다시 시도해 주세요."
      );
    } finally {
      setSaving(false);
    }
  };

  // API 재조회
  const handleRetry = () => {
    setLoading(true);
    setLoadError("");
    setRetryCount((count) => count + 1);
  };

  if (loading) {
    return (
      <div>
        <h1 className="page-title">
          회원정보 수정
        </h1>

        <div className="info-box" role="status">
          회원정보를 불러오는 중입니다...
        </div>
      </div>
    );
  }

  if (loadError || !profile) {
    return (
      <div>
        <h1 className="page-title">
          회원정보 수정
        </h1>

        <div className="info-box" role="alert">
          <strong>회원정보 조회 실패</strong>
          <p>{loadError}</p>
        </div>

        <Button onClick={handleRetry}>
          다시 시도
        </Button>

        <div className="gap" />

        <Button
          variant="secondary"
          onClick={() => navigate("/mypage/profile")}
        >
          회원정보로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div>
      <span className="badge">
        계정 관리
      </span>

      <h1 className="page-title">
        회원정보 수정
      </h1>

      <p className="page-desc">
        닉네임과 추가 정보를 변경할 수 있어요.
      </p>

      {/* 수정할 수 없는 계정 정보 */}
      <div className="info-box">
        <strong>계정 ID</strong>

        <p>{profile.account_id}</p>

        <p style={{ fontSize: 13, opacity: 0.7 }}>
          계정 ID는 변경할 수 없습니다.
        </p>
      </div>

      {/* 닉네임 수정 */}
      <div className="info-box">
        <label
          htmlFor="profile-nickname"
          style={{
            display: "block",
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          닉네임
        </label>

        <input
          id="profile-nickname"
          type="text"
          value={nickname}
          onChange={(event) => {
            setNickname(event.target.value);
            setSaveError("");
          }}
          maxLength={50}
          placeholder="닉네임을 입력해 주세요"
          disabled={saving}
          style={inputStyle}
        />

        <p
          style={{
            fontSize: 12,
            opacity: 0.7,
            textAlign: "right",
            marginTop: 8,
          }}
        >
          {[...nickname].length} / 50자
        </p>
      </div>

      {/* 추가 정보 수정 */}
      <div className="info-box">
        <label
          htmlFor="profile-extra-info"
          style={{
            display: "block",
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          추가 정보
        </label>

        <textarea
          id="profile-extra-info"
          value={extraInfo}
          onChange={(event) => {
            setExtraInfo(event.target.value);
            setSaveError("");
          }}
          maxLength={255}
          rows={5}
          placeholder="관심 있는 장소나 나의 탐색 이야기를 작성해 보세요"
          disabled={saving}
          style={{
            ...inputStyle,
            resize: "vertical",
          }}
        />

        <p
          style={{
            fontSize: 12,
            opacity: 0.7,
            textAlign: "right",
            marginTop: 8,
          }}
        >
          {[...extraInfo].length} / 255자
        </p>
      </div>

      {/* 저장 오류 */}
      {saveError && (
        <div className="info-box" role="alert">
          <strong>저장할 수 없습니다.</strong>

          <p>{saveError}</p>
        </div>
      )}

      {/* 저장 버튼 */}
      <Button
        disabled={saving}
        onClick={handleSave}
      >
        {saving
          ? "변경사항 저장 중..."
          : "변경사항 저장"}
      </Button>

      <div className="gap" />

      <Button
        variant="secondary"
        disabled={saving}
        onClick={() => navigate("/mypage/profile")}
      >
        취소
      </Button>
    </div>
  );
}

export default ProfileEditPage;
