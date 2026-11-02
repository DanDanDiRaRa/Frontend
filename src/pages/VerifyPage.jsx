import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import "./MyPage.css";
import "./PlacePages.css";

function VerifyPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div>
      <h1 className="page-title">장소 방문 확인</h1>

      <div className="info-box">
        <strong>방문할 장소</strong>
        추천 장소 {id}
      </div>

      <div className="info-box">
        <strong>방문 인증 방식</strong>
        인증 방식은 팀에서 추후 결정합니다. 위치 · 사진 · QR 등의 방식은 아직
        확정되지 않았어요.
      </div>

      <Button onClick={() => navigate(`/place/${id}/result?status=success`)}>
        방문 인증 요청
      </Button>
      <div className="gap" />
      <Button variant="secondary" onClick={() => navigate(`/place/${id}`)}>
        장소 상세로 돌아가기
      </Button>
    </div>
  );
}

export default VerifyPage;