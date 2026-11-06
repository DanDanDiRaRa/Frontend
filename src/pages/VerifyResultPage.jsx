
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import Button from "../components/Button";

import "./MyPage.css";
import "./PlacePages.css";

const STATUS_MESSAGES = {
  SUCCESS: "장소 방문 인증에 성공했습니다!",
  FAILED: "장소 방문 인증에 실패했습니다.",
  PENDING: "방문 인증 결과를 기다리고 있습니다.",
  ERROR: "방문 인증 중 오류가 발생했습니다.",
};

function VerifyResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // 이전 페이지에서 전달받은 실제 서버 응답
  const result = location.state?.verificationResult;

  // 결과 없이 직접 접속한 경우
  if (
    !result ||
    Number(result.place_id) !== Number(id)
  ) {
    return (
      <div>
        <h1 className="page-title">방문 인증 결과</h1>

        <div className="info-box">
          <strong>인증 결과를 확인할 수 없습니다.</strong>
          <p>방문 인증을 다시 진행해 주세요.</p>
        </div>

        <Button
          onClick={() => navigate(`/place/${id}/verify`)}
        >
          방문 인증하러 가기
        </Button>
      </div>
    );
  }

  const success = result.status === "SUCCESS";

  const canViewPhotos =
    success &&
    result.can_view_historical_photos === true;

  return (
    <div>
      <span
        className={
          success ? "badge" : "badge badge-fail"
        }
      >
        {success ? "인증 성공" : "인증 결과"}
      </span>

      <h1 className="page-title">방문 인증 결과</h1>

      <p className="page-desc">
        {STATUS_MESSAGES[result.status] ??
          "방문 인증 결과를 확인해 주세요."}
      </p>

      <div className="info-box">
        <strong>인증한 장소</strong>
        <p>{result.place_name ?? `장소 ${id}`}</p>

        {result.reason && (
          <p>{result.reason}</p>
        )}

        {success && !canViewPhotos && (
          <p>
            과거 사진 열람 권한을 확인할 수 없습니다.
          </p>
        )}
      </div>

      {canViewPhotos && (
        <>
          <Button
            onClick={() =>
              navigate(`/place/${id}/photos`)
            }
          >
            과거 사진 보기
          </Button>

          <div className="gap" />
        </>
      )}

      <Button
        variant="secondary"
        onClick={() =>
          navigate(`/place/${id}/verify`)
        }
      >
        다시 인증
      </Button>

      <div className="gap" />

      <Button
        variant="secondary"
        onClick={() => navigate("/map")}
      >
        지도로 돌아가기
      </Button>
    </div>
  );
}

export default VerifyResultPage;
