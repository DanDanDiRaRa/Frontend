import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import "./MyPage.css";
import "./PlacePages.css";

function VisitedPlaceDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div>
      <span className="badge">인증한 방문 장소</span>
      <div className="photo-box">방문 장소 이미지 · 예시</div>
      <h1 className="page-title">방문 장소 {id}</h1>

      <div className="info-box">
        <strong>장소 상세정보</strong>
        <div className="info-row">
          <span>장소명</span>
          <span>장소명 표시</span>
        </div>
        <div className="info-row">
          <span>위치 / 주소</span>
          <span>주소 정보 표시</span>
        </div>
      </div>

      <Button onClick={() => navigate("/mypage/places")}>
        방문 장소 목록으로
      </Button>
    </div>
  );
}

export default VisitedPlaceDetailPage;