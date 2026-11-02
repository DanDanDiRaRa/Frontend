import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import "./MyPage.css";
import "./PlacePages.css";

function RewardDetailPage() {
  const navigate = useNavigate();
  const { rewardId } = useParams();

  return (
    <div>
      <span className="badge">획득 보상</span>
      <div className="photo-box">보상 이미지 · 예시</div>
      <h1 className="page-title">보상명 (미정) {rewardId}</h1>
      <p className="page-desc">보상 정책 확정 후 상세 표시</p>

      <div className="info-box">
        <strong>보상 상세정보</strong>
        지급일 · 수량 · 내용: 추후 확정
      </div>

      <Button onClick={() => navigate("/mypage/rewards")}>내 보상 목록</Button>
      <div className="gap" />
      <Button variant="secondary" onClick={() => navigate("/map")}>
        새로운 장소 탐색
      </Button>
    </div>
  );
}

export default RewardDetailPage;