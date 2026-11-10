
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  verifyVisitByGps,
  uploadVisitPhoto,
  verifyVisitByPhoto,
} from "../api/visit";

import Button from "../components/Button";
import LocationlessVerifyButton from "../components/LocationlessVerifyButton";

import "./MyPage.css";
import "./PlacePages.css";

const STATUS_MESSAGES = {
  SUCCESS: "장소 방문 인증에 성공했습니다!",
  FAILED: "장소 방문 인증에 실패했습니다.",
  PENDING: "방문 인증을 확인하고 있습니다.",
  ERROR: "방문 인증을 처리하지 못했습니다.",
};

function VerifyPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isVerifying, setIsVerifying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [canUsePhoto, setCanUsePhoto] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const isBusy = isVerifying || isUploading;

  // 사진 미리보기 URL 정리
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // GPS 방문 인증
  const handleVerifyGps = async () => {
    if (isBusy) return;

    setResult(null);
    setError("");
    setCanUsePhoto(false);

    if (!navigator.geolocation) {
      setError(
        "이 브라우저는 위치 확인 기능을 지원하지 않습니다."
      );
      return;
    }

    setIsVerifying(true);

    try {
      const position = await new Promise(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
              enableHighAccuracy: true,
              timeout: 20000,
              maximumAge: 0,
            }
          );
        }
      );

      const { latitude, longitude } = position.coords;

      const data = await verifyVisitByGps(
        id,
        latitude,
        longitude
      );

      if (data.status === "SUCCESS") {
        navigate(`/place/${id}/result`, {
          state: { verificationResult: data },
        });
        return;
      }

      setResult(data);

      setCanUsePhoto(
        data.status === "FAILED" ||
        data.status === "ERROR"
      );
    } catch (err) {
      if (err.code === 1) {
        setError("위치 권한이 거부되었습니다.");
      } else if (err.code === 2) {
        setError("현재 위치를 확인할 수 없습니다.");
      } else if (err.code === 3) {
        setError("위치 확인 시간이 초과되었습니다.");
      } else {
        setError(
          err.message ||
          "방문 인증 중 오류가 발생했습니다."
        );
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // 사진 파일 선택
  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("이미지 파일을 선택해 주세요.");
      return;
    }

    setPhotoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError("");
  };

  // 사진 방문 인증
  const handleVerifyPhoto = async () => {
    if (isBusy || !canUsePhoto) return;

    if (!photoFile) {
      setError("인증할 사진을 선택해 주세요.");
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      // 1. 파일 업로드
      const uploadResult = await uploadVisitPhoto(
        photoFile
      );

      // 2. 서버에서 반환된 URL 확인
      const photoUrl = uploadResult?.file_url;

      if (
        typeof photoUrl !== "string" ||
        !photoUrl
      ) {
        throw new Error(
          "사진 업로드 URL을 받지 못했습니다."
        );
      }

      // 3. PHOTO 방식 방문 인증
      const data = await verifyVisitByPhoto(
        id,
        photoUrl
      );

      // 4. 인증 결과 저장
      if (data.status === "SUCCESS") {
        navigate(`/place/${id}/result`, {
          state: { verificationResult: data },
        });
        return;
      }

      setResult(data);
    } catch (err) {
      setError(
        err.message ||
        "사진 방문 인증 중 오류가 발생했습니다."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">
        장소 방문 확인
      </h1>

      <div className="info-box">
        <strong>방문할 장소</strong>
        <p>추천 장소 {id}</p>
      </div>

      <div className="info-box">
        <strong>GPS 방문 인증</strong>
        <p>
          현재 위치를 확인해 장소와의 거리를
          비교합니다.
        </p>
        <p>
          위치 권한을 허용해 주세요.
        </p>
      </div>

      <Button
        disabled={isBusy}
        onClick={handleVerifyGps}
      >
        {isVerifying
          ? "GPS 인증 중..."
          : "현재 위치로 방문 인증하기"}
      </Button>

      <div className="gap" />

      <details>
        <summary>
          위치 정보를 제공할 수 없는 경우
        </summary>

        <p className="page-desc">
          심사용 계정은 위치 권한 없이도 방문 인증을
          진행할 수 있습니다. 일반 계정에는 실제 위치
          인증이 필요합니다.
        </p>

        <LocationlessVerifyButton placeId={id} />
      </details>

      {result && (
        <div className="info-box" role="status">
          <strong>
            {STATUS_MESSAGES[result.status] ??
              "방문 인증 결과"}
          </strong>

          <p>
            {result.place_name ?? `장소 ${id}`}
          </p>

          {result.reason && (
            <p>{result.reason}</p>
          )}

          {result.status === "SUCCESS" &&
            result.can_view_historical_photos && (
              <Button
                onClick={() =>
                  navigate(`/place/${id}/photos`)
                }
              >
                과거 사진 확인하기
              </Button>
            )}
        </div>
      )}

      {/* GPS 실패 후 사진 인증 */}
      {canUsePhoto && (
        <div className="info-box">
          <strong>사진으로 방문 인증</strong>

          <p>
            방문한 장소의 사진을 선택해 주세요.
          </p>

          <input
            type="file"
            accept="image/*"
            disabled={isBusy}
            onChange={handlePhotoChange}
          />

          {previewUrl && (
            <div style={{ marginTop: 12 }}>
              <img
                src={previewUrl}
                alt="선택한 방문 인증 사진"
                style={{
                  width: "100%",
                  maxHeight: 240,
                  objectFit: "contain",
                  borderRadius: 8,
                }}
              />
            </div>
          )}

          <div className="gap" />

          <Button
            disabled={isBusy || !photoFile}
            onClick={handleVerifyPhoto}
          >
            {isUploading
              ? "사진 인증 중..."
              : "사진으로 방문 인증하기"}
          </Button>
        </div>
      )}

      {error && (
        <div className="info-box" role="alert">
          <strong>안내</strong>
          <p>{error}</p>
        </div>
      )}

      <div className="gap" />

      <Button
        variant="secondary"
        disabled={isBusy}
        onClick={() => navigate(`/place/${id}`)}
      >
        장소 상세로 돌아가기
      </Button>
    </div>
  );
}

export default VerifyPage;
