import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import "./MyPage.css";
import "./PlacePages.css";

function ProfileEditPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [extra, setExtra] = useState("");

  const handleSave = () => {
    if (!nickname.trim()) {
      alert("닉네임을 입력해 주세요.");
      return;
    }
    // 나중에 여기서 백엔드에 저장하는 코드가 들어가요
    navigate("/mypage/profile");
  };

  return (
    <div>
      <h1 className="page-title">회원정보 수정</h1>
      <p className="page-desc">수정 가능한 항목만 변경할 수 있어요.</p>

      <Input
        label="닉네임 (수정 항목 예시)"
        placeholder="현재 표시값"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <Input
        label="추가 정보 (정책 확정 후)"
        placeholder="입력 내용"
        value={extra}
        onChange={(e) => setExtra(e.target.value)}
      />

      <p className="page-desc">
        변경 항목과 유효성 조건은 회원 정책 확정 후 반영합니다.
      </p>

      <Button onClick={handleSave}>변경사항 저장</Button>
      <div className="gap" />
      <Button variant="secondary" onClick={() => navigate("/mypage/profile")}>
        취소
      </Button>
    </div>
  );
}

export default ProfileEditPage;