import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import "./MyPage.css";

function MyPage() {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <div>
      <h1 className="page-title">내 기록과 보상</h1>
      <p className="page-desc">계정 정보 요약 영역</p>

      <Card index="01" title="방문 장소" desc="방문한 장소 목록 확인"
        onClick={() => navigate("/mypage/places")} />
      <Card index="02" title="내 보상" desc="획득한 보상 내역 확인"
        onClick={() => navigate("/mypage/rewards")} />
      <Card index="03" title="회원정보" desc="정보 조회 및 수정"
        onClick={() => navigate("/mypage/profile")} />

      <div style={{ height: 16 }} />
      <Button variant="secondary" onClick={() => setShowLogout(true)}>
        로그아웃
      </Button>

      {showLogout && (
        <div className="modal-bg">
          <div className="modal">
            <strong>로그아웃하시겠어요?</strong>
            <p>현재 계정에서 로그아웃합니다.</p>
            <Button variant="secondary" onClick={() => setShowLogout(false)}>취소</Button>
            <div style={{ height: 8 }} />
            <Button onClick={() => navigate("/login")}>로그아웃</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPage;