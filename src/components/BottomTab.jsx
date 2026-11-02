import { NavLink } from "react-router-dom";
import "./BottomTab.css";

function BottomTab() {
  return (
    <nav className="tab">
      <NavLink to="/map" className="tab-item">지도</NavLink>
      <NavLink to="/mypage" className="tab-item">마이페이지</NavLink>
    </nav>
  );
}

export default BottomTab;