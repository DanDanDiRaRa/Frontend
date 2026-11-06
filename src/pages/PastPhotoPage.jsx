
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getHistoricalPhotos } from "../api/placeDetail";
import Button from "../components/Button";

import "./MyPage.css";
import "./PlacePages.css";

function PastPhotoPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [retryCount, setRetryCount] = useState(0);

  const [result, setResult] = useState({
    key: null,
    data: null,
    error: "",
    status: null,
  });

  const [selection, setSelection] = useState({
    placeId: id,
    index: 0,
  });

  const requestKey = `${id}-${retryCount}`;
  const isLoading = result.key !== requestKey;

  // 과거 사진 목록 조회
  useEffect(() => {
    let active = true;

    getHistoricalPhotos(id)
      .then((data) => {
        if (!active) return;

        if (!data || !Array.isArray(data.photos)) {
          throw new Error(
            "과거 사진 응답 형식이 올바르지 않습니다."
          );
        }

        setResult({
          key: requestKey,
          data,
          error: "",
          status: null,
        });
      })
      .catch((error) => {
        if (!active) return;

        setResult({
          key: requestKey,
          data: null,
          error:
            error.message ||
            "과거 사진을 불러오지 못했습니다.",
          status: error.status ?? null,
        });
      });

    return () => {
      active = false;
    };
  }, [id, requestKey]);

  if (isLoading) {
    return (
      <div>
        <h1 className="page-title">
          이 장소의 과거 기록
        </h1>
        <p role="status">
          과거 사진을 불러오는 중입니다...
        </p>
      </div>
    );
  }

  if (result.error) {
    return (
      <div>
        <h1 className="page-title">
          이 장소의 과거 기록
        </h1>

        <div className="info-box" role="alert">
          <strong>사진을 불러오지 못했습니다.</strong>
          <p>{result.error}</p>

          {result.status === 403 && (
            <p>
              이 장소의 방문 인증을 먼저 완료해 주세요.
            </p>
          )}
        </div>

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
          onClick={() =>
            navigate(`/place/${id}/verify`)
          }
        >
          방문 인증 화면으로
        </Button>
      </div>
    );
  }

  const data = result.data;
  const photos = data.photos;

  if (!data.has_photos || photos.length === 0) {
    return (
      <div>
        <h1 className="page-title">
          {data.place_name}의 과거 기록
        </h1>

        <div className="info-box">
          <p>
            {data.empty_message ||
              "아직 등록된 과거 사진이 없습니다."}
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={() => navigate(`/place/${id}`)}
        >
          장소 상세로 돌아가기
        </Button>
      </div>
    );
  }

  const currentIndex =
    selection.placeId === id
      ? Math.min(selection.index, photos.length - 1)
      : 0;

  const photo = photos[currentIndex];

  const source = photo.source ?? "";
  const sourceUrl =
    source.match(/https?:\/\/[^\s)]+/)?.[0] ?? null;

  const sourceName = source
    .replace(/\(https?:\/\/[^)]*\)/, "")
    .trim();

  const changePhoto = (nextIndex) => {
    setSelection({
      placeId: id,
      index: nextIndex,
    });
  };

  return (
    <div>
      <span className="badge">과거의 기록</span>

      <h1 className="page-title">
        {data.place_name}의 과거 기록
      </h1>

      <p className="page-desc">
        오래된 사진 속 장소의 모습을 살펴보세요.
      </p>

      {/* 현재 사진 */}
      <div
        className="photo-box"
        style={{
          height: "auto",
          minHeight: 0,
          aspectRatio: "auto",
          padding: 12,
          overflow: "visible",
        }}
      >
        <img
          key={photo.id}
          src={photo.image_url}
          alt={photo.caption || `${data.place_name} 과거 사진`}
          style={{
            display: "block",
            width: "100%",
            maxHeight: 360,
            objectFit: "contain",
            borderRadius: 8,
          }}
        />
      </div>

      {/* 사진 탐색 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginTop: 12,
          marginBottom: 16,
        }}
      >
        <Button
          variant="secondary"
          disabled={currentIndex === 0}
          onClick={() =>
            changePhoto(currentIndex - 1)
          }
        >
          이전 사진
        </Button>

        <span
          aria-live="polite"
          style={{
            whiteSpace: "nowrap",
            flexShrink: 0,
            minWidth: 48,
            textAlign: "center",
          }}
        >
          {currentIndex + 1} / {photos.length}
        </span>

        <Button
          variant="secondary"
          disabled={currentIndex === photos.length - 1}
          onClick={() =>
            changePhoto(currentIndex + 1)
          }
        >
          다음 사진
        </Button>
      </div>

      {/* 사진 설명 */}
      <div className="info-box">
        <strong>사진 속 이야기</strong>
        <p>
          {photo.caption || "등록된 사진 설명이 없습니다."}
        </p>
      </div>

      {/* 촬영 정보 */}
      <div className="info-box">
        <div className="info-row">
          <span>촬영 시기</span>
          <span>{photo.taken_year || "미상"}</span>
        </div>

        <div className="info-row">
          <span>출처</span>
          <span>{sourceName || "출처 정보 없음"}</span>
        </div>

        {sourceUrl && (
          <p>
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              원문 및 출처 확인
            </a>
          </p>
        )}
      </div>

      <Button
        onClick={() =>
          navigate(`/place/${id}/mission`)
        }
      >
        미션 확인하기
      </Button>
    </div>
  );
}

export default PastPhotoPage;
