import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import "./MyPage.css";
import "./PlacePages.css";

function VerifyResultPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [params] = useSearchParams();
  const success = params.get("status") !== "fail";

  return (
    <div>
      <span className={success ? "badge" : "badge badge-fail"}>
        {success ? "인증 성공" : "인증 실패"}
      </span>
      <h1 className="page-title">방문 인증 결과</h1>
      <p className="page-desc">
        {success
          ? "성공 시 과거 사진을 확인할 수 있어요."
          : "인증에 실패했어요. 사유를 확인하고 다시 시도해 주세요."}
      </p>

      <div className="info-box">
        <strong>인증한 장소</strong>
        추천 장소 {id}
      </div>

      {success && (
        <Button onClick={() => navigate(`/place/${id}/photos`)}>
          과거 사진 보기
        </Button>
      )}
      {success && <div className="gap" />}
      <Button
        variant="secondary"
        onClick={() => navigate(`/place/${id}/verify`)}
      >
        다시 인증
      </Button>
    </div>
  );
}

export default VerifyResultPage;