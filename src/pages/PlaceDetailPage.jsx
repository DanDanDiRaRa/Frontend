
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPlaceDetail } from "../api/placeDetail";
import Button from "../components/Button";

import "./MyPage.css";
import "./PlacePages.css";

function PlaceDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [retryCount, setRetryCount] = useState(0);
  const [result, setResult] = useState({
    key: null,
    place: null,
    error: "",
  });

  const requestKey = `${id}-${retryCount}`;
  const isLoading = result.key !== requestKey;

  useEffect(() => {
    let active = true;

    getPlaceDetail(id)
      .then((data) => {
        if (!active) return;

        const place = data?.place ?? data?.data ?? data;

        if (
          !place ||
          typeof place !== "object" ||
          Array.isArray(place)
        ) {
          throw new Error(
            "장소 상세 응답 형식이 올바르지 않습니다."
          );
        }

        setResult({
          key: requestKey,
          place,
          error: "",
        });
      })
      .catch((err) => {
        if (!active) return;

        setResult({
          key: requestKey,
          place: null,
          error:
            err.message ||
            "장소 정보를 불러오지 못했습니다.",
        });
      });

    return () => {
      active = false;
    };
  }, [id, requestKey]);

  // 데이터 로딩 중
  if (isLoading) {
    return (
      <div>
        <h1 className="page-title">장소 정보</h1>
        <p role="status">
          장소 정보를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  // API 오류 발생
  if (result.error) {
    return (
      <div>
        <h1 className="page-title">장소 정보</h1>
        <p role="alert">{result.error}</p>

        <Button
          onClick={() =>
            setRetryCount((count) => count + 1)
          }
        >
          다시 시도
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

  const place = result.place;

  const name =
    place.name ??
    place.place_name ??
    `장소 ${id}`;

  const address =
    place.address ??
    "주소 정보가 없습니다.";

  const description =
    place.description ??
    place.summary ??
    place.short_description ??
    "";

  const imageUrl = place.image_url ?? null;
  const imageSource = place.image_source ?? null;

  // 백엔드에서 전달하는 방문 완료 여부
  const isVisited = place.is_visited === true;

  // 모든 계정이 방문 인증 화면을 거치도록 처리
  const handleVerify = () => {
    navigate(`/place/${id}/verify`);
  };

  return (
    <div>
      <span className="badge">
        {isVisited ? "방문 인증 완료" : "추천 장소"}
      </span>

      <div className="photo-box">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${name} 대표 이미지`}
            loading="lazy"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "inherit",
            }}
          />
        ) : (
          "장소 이미지 준비 중"
        )}
      </div>

      {imageUrl && imageSource && (
        <p
          style={{
            fontSize: 12,
            opacity: 0.7,
            marginTop: 8,
            marginBottom: 16,
            overflowWrap: "anywhere",
          }}
        >
          이미지 출처: {imageSource}
        </p>
      )}

      <h1 className="page-title">{name}</h1>

      <p className="page-desc">{address}</p>

      {typeof description === "string" &&
        description.trim() && (
          <div className="info-box">
            <strong>이 장소에 담긴 이야기</strong>
            <p>{description}</p>
          </div>
        )}

      <div className="info-box">
        <strong>
          {isVisited
            ? "이미 방문 인증한 장소예요!"
            : "이 장소에 방문하면"}
        </strong>

        <p>
          {isVisited
            ? "방문 인증 과정을 다시 체험하고, 과거 사진과 미션을 확인할 수 있어요."
            : "위치를 인증하면 연결된 과거 사진과 장소 관련 미션을 확인할 수 있어요."}
        </p>
      </div>

      {/* 일반 계정과 심사용 계정 모두 인증 화면 이동 */}
      <Button onClick={handleVerify}>
        {isVisited
          ? "방문 인증 과정 체험하기"
          : "장소 방문 인증하기"}
      </Button>

      <div className="gap" />

      <Button
        variant="secondary"
        onClick={() => navigate("/map")}
      >
        지도에서 다시 보기
      </Button>
    </div>
  );
}

export default PlaceDetailPage;
