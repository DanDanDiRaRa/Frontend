import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import "./MyPage.css";
import "./PlacePages.css";

function MissionSubmitPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!file) {
      alert("인증 자료를 먼저 추가해 주세요.");
      return;
    }
    setSubmitting(true);
    // 나중에 여기서 백엔드에 제출하는 코드가 들어가요
    setTimeout(() => {
      navigate(`/place/${id}/mission/result?status=success`);
    }, 500);
  };

  return (
    <div>
      <h1 className="page-title">미션 인증 제출</h1>
      <p className="page-desc">완료한 미션을 인증해 주세요.</p>

      <div className="info-box">
        <strong>인증할 미션</strong>
        장소 관련 미션
      </div>

      <label className="upload-box">
        <span className="upload-plus">+</span>
        <span>{file ? file.name : "인증 자료 추가"}</span>
        <span>첨부 방식 / 제한: 추후 결정</span>
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => setFile(e.target.files[0] || null)}
        />
      </label>

      <Button onClick={handleSubmit} disabled={submitting}>
        {submitting ? "제출 중..." : "인증 요청"}
      </Button>
      <div className="gap" />
      <Button variant="secondary" onClick={() => navigate(`/place/${id}/mission`)}>
        미션 내용 다시 보기
      </Button>
    </div>
  );
}

export default MissionSubmitPage;