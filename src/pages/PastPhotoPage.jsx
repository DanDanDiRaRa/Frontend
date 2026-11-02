import { useParams } from "react-router-dom";
import Button from "../components/Button";
import "./MyPage.css";
import "./PlacePages.css";

function PastPhotoPage() {
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

      <Button onClick={() => alert(`미션 화면은 다음 단계에서 만들어요 (장소 ${id})`)}>
        미션 확인하기
      </Button>
    </div>
  );
}

export default PastPhotoPage;