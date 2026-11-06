
import { useEffect, useRef, useState } from "react";

let sdkPromise = null;

// 카카오맵 SDK를 한 번만 불러오는 함수
function loadKakaoMapSdk() {
  if (window.kakao?.maps?.Map) {
    return Promise.resolve(window.kakao);
  }

  if (!sdkPromise) {
    const key = import.meta.env.VITE_KAKAO_MAP_KEY;

    if (!key) {
      return Promise.reject(
        new Error("카카오맵 JavaScript 키가 설정되지 않았습니다.")
      );
    }

    sdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");

      script.src =
        `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(key)}&autoload=false`;

      script.async = true;

      script.onload = () => {
        if (!window.kakao?.maps?.load) {
          reject(new Error("카카오맵 SDK를 초기화하지 못했습니다."));
          return;
        }

        window.kakao.maps.load(() => {
          resolve(window.kakao);
        });
      };

      script.onerror = () => {
        script.remove();
        reject(new Error("카카오맵 SDK를 불러오지 못했습니다."));
      };

      document.head.appendChild(script);
    }).catch((error) => {
      sdkPromise = null;
      throw error;
    });
  }

  return sdkPromise;
}

function KakaoMap() {
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    loadKakaoMapSdk()
      .then((kakao) => {
        if (!active || !mapRef.current) return;

        // 초기 지도 중심: 대구
        const options = {
          center: new kakao.maps.LatLng(
            35.8714,
            128.6014
          ),
          level: 7,
        };

        new kakao.maps.Map(mapRef.current, options);

        setIsLoading(false);
      })
      .catch((err) => {
        if (!active) return;

        setError(err.message);
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <div
        className="photo-box"
        style={{ padding: 0, overflow: "hidden" }}
      >
        <div
          ref={mapRef}
          style={{
            width: "100%",
            height: "320px",
          }}
        />
      </div>

      {isLoading && (
        <p role="status">지도를 불러오는 중입니다...</p>
      )}

      {error && (
        <p role="alert" style={{ color: "#B86A4B" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default KakaoMap;
