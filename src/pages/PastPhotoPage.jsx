import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import "./MyPage.css";
import "./PlacePages.css";

function PastPhotoPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div>
      <span className="badge">방문 인증 완료</span>
      <div className="photo-box">과거 사진 · 예시</div>
      <h1 className="page-title">이 장소의 과거 기록</h1>

      <div className="info-box">
        <div className="info-row">
          <span>촬영 시기</span>
          <span>확인된 연도 표시</span>
        </div>
        <div className="info-row">
          <span>출처</span>
          <span>원문 / 기관 정보</span>
        </div>
      </div>

      <Button onClick={() => navigate(`/place/${id}/mission`)}>
        미션 확인하기
      </Button>
    </div>
  );
}

export default PastPhotoPage;