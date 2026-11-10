
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/client";
import Button from "./Button";

function LocationlessVerifyButton({
  placeId,
  disabled = false,
}) {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);
    setError("");

    try {
      // 위치 좌표 없이 백엔드에 방문 인증 요청
      // 실제 승인 여부는 백엔드가 계정별로 판단
      const data = await apiRequest(
        `/places/${placeId}/verify-visit`,
        {
          method: "POST",
          body: {
            verify_method: "GPS",
          },
        }
      );

      // 백엔드에서 실제 인증에 성공한 경우만 이동
      if (
        data?.status === "SUCCESS" &&
        data?.can_view_historical_photos === true
      ) {
        navigate(`/place/${placeId}/result`, {
          state: {
            verificationResult: data,
          },
        });
        return;
      }

      // 일반 계정 등 인증이 거절된 경우
      setError(
        data?.reason ||
          "인증이 승인되지 않았습니다. 일반 계정은 실제 위치 인증을 이용해 주세요."
      );
    } catch (err) {
      setError(
        err.message ||
          "방문 인증 요청 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        type="button"
        variant="secondary"
        onClick={handleVerify}
        disabled={disabled || isLoading}
      >
        {isLoading
          ? "방문 인증 확인 중..."
          : "위치 권한 없이 방문 인증하기"}
      </Button>

      {error && (
        <div
          className="info-box"
          role="alert"
          style={{ marginTop: 12 }}
        >
          <strong>방문 인증 안내</strong>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default LocationlessVerifyButton;
