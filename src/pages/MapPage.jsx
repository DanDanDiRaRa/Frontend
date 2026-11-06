
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRecommendedPlaces } from "../api/places";
import KakaoMap from "../components/KakaoMap";

import Card from "../components/Card";
import Button from "../components/Button";

import "./MyPage.css";
import "./PlacePages.css";

function MapPage() {
  const navigate = useNavigate();

  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;

    getRecommendedPlaces()
      .then((data) => {
        if (!active) return;

        const list = Array.isArray(data)
          ? data
          : data?.places ?? data?.recommendations ?? data?.data;

        if (!Array.isArray(list)) {
          throw new Error("장소 목록 응답 형식이 올바르지 않습니다.");
        }

        setPlaces(list);
      })
      .catch((err) => {
        if (!active) return;

        setError(
          err.message || "추천 장소를 불러오지 못했습니다."
        );
      })
      .finally(() => {
        if (!active) return;

        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [retryCount]);

  const handleRetry = () => {
    setError("");
    setIsLoading(true);
    setRetryCount((count) => count + 1);
  };

  return (
    <div>
      <h1 className="page-title">지도 / 추천 장소</h1>

      <KakaoMap places={places} />

      <h2 className="page-title">추천 장소</h2>

      {isLoading && (
        <p role="status">
          추천 장소를 불러오는 중입니다...
        </p>
      )}

      {!isLoading && error && (
        <div role="alert">
          <p>{error}</p>
          <Button onClick={handleRetry}>
            다시 시도
          </Button>
        </div>
      )}

      {!isLoading && !error && places.length === 0 && (
        <p>아직 추천할 장소가 없습니다.</p>
      )}

      {!isLoading && !error &&
        places.map((place) => {
          const placeId = place.id ?? place.place_id;

          if (placeId == null) return null;

          const placeName =
            place.name ?? place.place_name ?? "이름 없는 장소";

          const description =
            place.address ??
            place.short_description ??
            place.description ??
            place.region ??
            "장소를 눌러 자세히 알아보세요.";

          return (
            <Card
              key={placeId}
              title={placeName}
              desc={description}
              onClick={() => navigate(`/place/${placeId}`)}
            />
          );
        })}
    </div>
  );
}

export default MapPage;
