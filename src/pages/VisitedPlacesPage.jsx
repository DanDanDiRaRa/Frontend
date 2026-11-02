import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import "./MyPage.css";

const places = [
  { id: 1, name: "방문 장소 1", desc: "장소명 · 위치 요약 (예시)" },
  { id: 2, name: "방문 장소 2", desc: "장소명 · 위치 요약 (예시)" },
  { id: 3, name: "방문 장소 3", desc: "장소명 · 위치 요약 (예시)" },
];

function VisitedPlacesPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="page-title">지금까지 방문한 장소</h1>

      {places.length === 0 ? (
        <div className="empty">아직 방문한 장소가 없어요.</div>
      ) : (
        places.map((p, i) => (
          <Card key={p.id} index={i + 1} title={p.name} desc={p.desc} />
        ))
      )}

      <div style={{ height: 16 }} />
      <Button onClick={() => navigate("/map")}>장소 탐색하기</Button>
    </div>
  );
}

export default VisitedPlacesPage;