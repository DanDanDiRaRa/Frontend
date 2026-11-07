
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrGenerateMission, submitMissionProof } from "../api/mission";
import { uploadVisitPhoto } from "../api/visit";
import Button from "../components/Button";

import "./MyPage.css";
import "./PlacePages.css";

function MissionSubmitPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [retryCount, setRetryCount] = useState(0);
  const [missionResult, setMissionResult] = useState({
    key: null,
    data: null,
    error: "",
  });

  const [proofText, setProofText] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const requestKey = `${id}-${retryCount}`;
  const isLoading = missionResult.key !== requestKey;

  // 제출 화면을 새로고침해도 미션을 다시 조회할 수 있게 처리
  useEffect(() => {
    let active = true;

    getOrGenerateMission(id)
      .then((data) => {
        if (!active) return;

        if (
          !data ||
          !Number.isInteger(data.mission_id) ||
          Number(data.place_id) !== Number(id)
        ) {
          throw new Error("미션 정보가 올바르지 않습니다.");
        }

        setMissionResult({
          key: requestKey,
          data,
          error: "",
        });
      })
      .catch((error) => {
        if (!active) return;

        setMissionResult({
          key: requestKey,
          data: null,
          error: error.message || "미션을 불러오지 못했습니다.",
        });
      });

    return () => {
      active = false;
    };
  }, [id, requestKey]);

  const mission = isLoading ? null : missionResult.data;

  const handleSubmit = async () => {
    if (!mission || submitting) return;

    const text = proofText.trim();

    if (!text && !file) {
      setSubmitError("사진이나 관찰 기록 중 하나를 입력해 주세요.");
      return;
    }

    if (text.length > 0 && text.length < 10) {
      setSubmitError("관찰 기록은 10자 이상 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      let imageUrl = null;

      // 사진이 있다면 먼저 파일 서버에 업로드
      if (file) {
        const uploadResult = await uploadVisitPhoto(file);

        if (!uploadResult?.file_url) {
          throw new Error("사진 업로드 주소를 받지 못했습니다.");
        }

        imageUrl = uploadResult.file_url;
      }

      // 실제 미션 인증 제출
      const result = await submitMissionProof(
        mission.mission_id,
        {
          proof_text: text || null,
          proof_image_url: imageUrl,
        }
      );

      if (
        !Number.isInteger(result?.submission_id) ||
        Number(result.mission_id) !== Number(mission.mission_id) ||
        Number(result.place_id) !== Number(id) ||
        typeof result.status !== "string"
      ) {
        throw new Error("미션 제출 응답 형식이 올바르지 않습니다.");
      }

      
      const submissionId = String(result.submission_id);

      // 같은 브라우저 세션에서 제출 결과를 다시 확인하기 위해 저장
      sessionStorage.setItem(
        `memory_coordinates_mission_submission_${id}`,
        submissionId
      );

      // 실제 제출 번호를 가지고 결과 페이지로 이동
      navigate(
        `/place/${id}/mission/result?submissionId=${encodeURIComponent(submissionId)}`
      );

    } catch (error) {
      setSubmitError(
        error.message || "미션 제출에 실패했습니다. 다시 시도해 주세요."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="page-title">미션 인증 제출</h1>
        <p role="status">미션 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (missionResult.error) {
    return (
      <div>
        <h1 className="page-title">미션 인증 제출</h1>

        <div className="info-box" role="alert">
          <p>{missionResult.error}</p>
        </div>

        <Button onClick={() => setRetryCount((count) => count + 1)}>
          다시 시도
        </Button>

        <div className="gap" />

        <Button
          variant="secondary"
          onClick={() => navigate(`/place/${id}/mission`)}
        >
          미션 화면으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div>
      <span className="badge">미션 인증</span>

      <h1 className="page-title">미션 인증 제출</h1>

      <p className="page-desc">
        현장에서 발견한 변화를 기록하거나 사진을 첨부해 주세요.
      </p>

      {/* 인증할 미션 */}
      <div className="info-box">
        <strong>인증할 미션</strong>
        <p>{mission.title}</p>
      </div>

      {/* 텍스트 인증 */}
      <div className="info-box">
        <strong>관찰 기록</strong>

        <p style={{ fontSize: 13, opacity: 0.8 }}>
          과거 사진과 비교해 달라진 점이나 남아 있는 흔적을 기록해 주세요.
        </p>

        <textarea
          value={proofText}
          disabled={submitting}
          onChange={(event) => {
            setProofText(event.target.value);
            setSubmitError("");
          }}
          placeholder="예: 과거 사진에는 흙길이 있었지만, 현재는 보행로가 정비되어 있습니다."
          rows={5}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ccc",
            fontFamily: "inherit",
            fontSize: 14,
            resize: "vertical",
          }}
        />

        <p style={{ fontSize: 12, opacity: 0.7 }}>
          {proofText.trim().length}자 입력 · 텍스트 인증은 10자 이상
        </p>
      </div>

      {/* 사진 인증 */}
      <label className="upload-box">
        <span className="upload-plus">+</span>

        <span>
          {file ? file.name : "인증 사진 추가"}
        </span>

        <span>사진은 선택 사항입니다.</span>

        <input
          type="file"
          accept="image/*"
          disabled={submitting}
          style={{ display: "none" }}
          onChange={(event) => {
            setFile(event.target.files?.[0] || null);
            setSubmitError("");
          }}
        />
      </label>

      {file && (
        <div style={{ marginTop: 8, marginBottom: 12 }}>
          <Button
            variant="secondary"
            disabled={submitting}
            onClick={() => setFile(null)}
          >
            선택한 사진 제거
          </Button>
        </div>
      )}

      {/* 제출 오류 */}
      {submitError && (
        <div className="info-box" role="alert">
          <p>{submitError}</p>
        </div>
      )}

      <Button onClick={handleSubmit} disabled={submitting}>
        {submitting ? "인증 자료 제출 중..." : "미션 인증 제출"}
      </Button>

      <div className="gap" />

      <Button
        variant="secondary"
        disabled={submitting}
        onClick={() => navigate(`/place/${id}/mission`)}
      >
        미션 내용 다시 보기
      </Button>
    </div>
  );
}

export default MissionSubmitPage;
