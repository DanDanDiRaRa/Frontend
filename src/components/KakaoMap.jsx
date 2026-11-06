
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


function KakaoMap({ places, selectedPlaceId, onSelectPlace }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef(new Map());

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [mapReady, setMapReady] = useState(false);

  // 1. 카카오 지도 생성
  useEffect(() => {
    let active = true;

    loadKakaoMapSdk()
      .then((kakao) => {
        if (!active || !mapRef.current) return;

        const map = new kakao.maps.Map(
          mapRef.current,
          {
            center: new kakao.maps.LatLng(
              35.8714,
              128.6014
            ),
            level: 7,
          }
        );

        mapInstanceRef.current = map;

        setMapReady(true);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!active) return;

        setError(err.message);
        setIsLoading(false);
      });

    return () => {
      active = false;
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. 실제 장소 마커 생성
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    const kakao = window.kakao;
    const map = mapInstanceRef.current;

    const markers = [];
    const bounds = new kakao.maps.LatLngBounds();
    const markersById = new Map();

    for (const place of Array.isArray(places) ? places : []) {
      if (
        place.latitude == null ||
        place.longitude == null
      ) {
        continue;
      }

      const latitude = Number(place.latitude);
      const longitude = Number(place.longitude);

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        continue;
      }

      const position = new kakao.maps.LatLng(
        latitude,
        longitude
      );

      const marker = new kakao.maps.Marker({
        map,
        position,
        title: place.name ?? "추천 장소",
      });

      markers.push(marker);
      bounds.extend(position);

      const placeId = place.id ?? place.place_id;

      
      if (placeId != null) {
        markersById.set(String(placeId), marker);

        // 마커를 클릭하면 해당 장소 선택
        kakao.maps.event.addListener(marker, "click", () => {
          onSelectPlace?.(placeId);
        });
      }

    }

    // 장소가 모두 보이도록 지도 범위 조정
    if (markers.length >= 2) {
      map.setBounds(bounds, 24, 24, 24, 24);
    } else if (markers.length === 1) {
      map.setCenter(markers[0].getPosition());
    }

    markersRef.current = markersById;

    // 장소 데이터가 바뀌면 기존 마커 제거
    return () => {
      markersRef.current = new Map();

      markers.forEach((marker) => {
        marker.setMap(null);
      });
    };

    
  }, [places, mapReady, onSelectPlace]);

  
  // 3. 선택한 장소로 지도 이동 및 마커 강조
  useEffect(() => {
    if (!mapReady || selectedPlaceId == null) return;

    const map = mapInstanceRef.current;
    const kakao = window.kakao;

    const marker = markersRef.current.get(
      String(selectedPlaceId)
    );

    const selectedPlace = places.find(
      (place) =>
        String(place.id ?? place.place_id) ===
        String(selectedPlaceId)
    );

    if (!map || !marker || !selectedPlace) return;

    // 선택한 장소의 중심 좌표와 확대 수준을 함께 변경
    map.jump(marker.getPosition(), 5);

    // 선택된 마커를 다른 마커보다 위에 표시
    marker.setZIndex(10);

    // 장소명을 안전하게 텍스트로 표시
    const label = document.createElement("div");
    label.textContent =
      selectedPlace.name ??
      selectedPlace.place_name ??
      "추천 장소";

    label.style.cssText =
      "padding:8px 12px;font-size:13px;" +
      "font-weight:600;white-space:nowrap;";

    const infoWindow = new kakao.maps.InfoWindow({
      content: label,
      removable: false,
    });

    infoWindow.open(map, marker);

    // 다른 장소 선택 시 이전 강조 표시 제거
    return () => {
      infoWindow.close();
      marker.setZIndex(0);
    };
  }, [selectedPlaceId, places, mapReady]);

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
        <p role="status">
          지도를 불러오는 중입니다...
        </p>
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
