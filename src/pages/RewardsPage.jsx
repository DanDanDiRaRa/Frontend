import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import "./MyPage.css";

const rewards = [
  { id: 1, name: "보상 항목 1", desc: "보상명 · 요약 / 예시" },
  { id: 2, name: "보상 항목 2", desc: "보상명 · 요약 / 예시" },
  { id: 3, name: "보상 항목 3", desc: "보상명 · 요약 / 예시" },
];

function RewardsPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="page-title">획득한 보상 내역</h1>

      {rewards.length === 0 ? (
        <div className="empty">아직 획득한 보상이 없어요.</div>
      ) : (
        rewards.map((r) => (
          <Card
            key={r.id}
            title={r.name}
            desc={r.desc}
            onClick={() => navigate(`/mypage/rewards/${r.id}`)}
            />
        ))
      )}

      <div style={{ height: 16 }} />
      <Button onClick={() => navigate("/map")}>지도에서 미션 탐색</Button>
    </div>
  );
}

export default RewardsPage;