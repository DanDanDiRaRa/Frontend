import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import "./MyPage.css";
import "./PlacePages.css";

function MissionResultPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [params] = useSearchParams();
  const status = params.get("status") || "pending";

  const labels = {
    success: "인증 성공",
    fail: "인증 거절",
    pending: "결과 대기 중",
  };

  return (
    <div>
      <span className={status === "fail" ? "badge badge-fail" : "badge"}>
        {labels[status]}
      </span>
      <h1 className="page-title">미션 인증 결과</h1>
      <p className="page-desc">승인되면 보상 지급 단계로 이동해요.</p>

      <div className="info-box">
        <strong>인증 상태</strong>
        {status === "success" && "승인되었어요."}
        {status === "fail" && "거절 사유가 여기에 표시돼요."}
        {status === "pending" && "결과를 확인하는 중이에요."}
      </div>

      {status === "success" && (
        <Button onClick={() => navigate(`/place/${id}/reward`)}>
          보상 지급 결과로
        </Button>
      )}
      {status === "success" && <div className="gap" />}
      <Button
        variant="secondary"
        onClick={() => navigate(`/place/${id}/mission/submit`)}
      >
        자료 다시 제출
      </Button>
    </div>
  );
}

export default MissionResultPage;