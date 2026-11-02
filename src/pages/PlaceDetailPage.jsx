import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import "./MyPage.css";
import "./PlacePages.css";

function PlaceDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div>
      <span className="badge">방문 예정 장소</span>
      <div className="photo-box">장소 이미지 · 선택 제안</div>
      <h1 className="page-title">추천 장소 {id}</h1>
      <p className="page-desc">장소명 / 위치 정보 (실데이터 연동)</p>

      <div className="info-box">
        <strong>이 장소에 방문하면</strong>
        연결된 과거 사진과 장소 관련 미션을 확인할 수 있어요.
      </div>

      <Button onClick={() => navigate(`/place/${id}/verify`)}>
        장소 방문 인증하기
      </Button>
      <div className="gap" />
      <Button variant="secondary" onClick={() => navigate("/map")}>
        지도에서 다시 보기
      </Button>
    </div>
  );
}

export default PlaceDetailPage;