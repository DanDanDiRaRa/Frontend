import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "./MyPage.css";
import "./PlacePages.css";

function RewardResultPage() {
  const navigate = useNavigate();

  return (
    <div>
      <span className="badge">지급 완료</span>
      <h1 className="page-title">보상 지급 결과</h1>
      <p className="page-desc">지급이 완료된 경우에만 보상을 표시해요.</p>

      <div className="info-box">
        <strong>보상 종류 · 미정</strong>
        지급 결과 정보 영역
      </div>

      <Button onClick={() => navigate("/mypage/rewards/1")}>
        획득한 보상 보기
      </Button>
      <div className="gap" />
      <Button variant="secondary" onClick={() => navigate("/map")}>
        새로운 장소 탐색
      </Button>
    </div>
  );
}

export default RewardResultPage;