import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import "./MyPage.css";
import "./PlacePages.css";

function MissionPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div>
      <span className="badge">장소 미션</span>
      <h1 className="page-title">장소 관련 미션</h1>
      <p className="page-desc">추천 장소 {id}</p>

      <div className="info-box">
        <strong>미션 수행 안내</strong>
        <div className="step">
          <span className="step-num">1</span>
          <span>미션 내용을 확인해 주세요</span>
        </div>
        <div className="step">
          <span className="step-num">2</span>
          <span>안내에 따라 미션을 수행해요</span>
        </div>
        <div className="step">
          <span className="step-num">3</span>
          <span>완료 후 인증 자료를 제출해요</span>
        </div>
      </div>

      <Button onClick={() => navigate(`/place/${id}/mission/submit`)}>
        수행 완료 · 인증으로
      </Button>
      <div className="gap" />
      <Button variant="secondary" onClick={() => navigate(`/place/${id}/photos`)}>
        과거 사진으로 돌아가기
      </Button>
    </div>
  );
}

export default MissionPage;