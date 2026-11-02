import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "./MyPage.css";
import "./PlacePages.css";

function ProfilePage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="page-title">회원정보 조회</h1>

      <div className="info-box">
        <strong>계정 정보</strong>
        <div className="info-row">
          <span>계정</span>
          <span>계정 정보 표시</span>
        </div>
        <div className="info-row">
          <span>닉네임</span>
          <span>정책 확정 후 표시</span>
        </div>
        <div className="info-row">
          <span>추가 정보</span>
          <span>표시 항목 미정</span>
        </div>
      </div>

      <Button onClick={() => navigate("/mypage/profile/edit")}>
        회원정보 수정
      </Button>
      <div className="gap" />
      <Button variant="secondary" onClick={() => navigate("/mypage")}>
        마이페이지로 돌아가기
      </Button>
    </div>
  );
}

export default ProfilePage;