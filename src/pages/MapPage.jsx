import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import "./MyPage.css";
import "./PlacePages.css";

const places = [
  { id: 1, name: "추천 장소 A", desc: "장소명 · 위치 정보 (예시)" },
  { id: 2, name: "추천 장소 B", desc: "장소명 · 위치 정보 (예시)" },
  { id: 3, name: "추천 장소 C", desc: "장소명 · 위치 정보 (예시)" },
];

function MapPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="page-title">지도 / 추천 장소</h1>
      <div className="photo-box">기록 지도 · 예시 (지도 SDK 연동 예정)</div>

      {places.map((p) => (
        <Card
          key={p.id}
          title={p.name}
          desc={p.desc}
          onClick={() => navigate(`/place/${p.id}`)}
        />
      ))}
    </div>
  );
}

export default MapPage;