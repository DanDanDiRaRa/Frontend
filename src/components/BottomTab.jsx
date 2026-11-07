
import {
  NavLink,
  useLocation,
} from "react-router-dom";

import "./BottomTab.css";

function BottomTab() {
  const { pathname } = useLocation();

  // 장소 상세, 방문 인증, 과거 사진,
  // 미션 및 보상 화면은 지도 탐색 흐름에 포함
  const isPlacePage =
    pathname.startsWith("/place/");

  return (
    <nav className="tab" aria-label="주요 메뉴">
      <NavLink
        to="/map"
        className={({ isActive }) =>
          `tab-item${
            isActive || isPlacePage
              ? " active"
              : ""
          }`
        }
      >
        지도
      </NavLink>

      <NavLink
        to="/mypage"
        className="tab-item"
      >
        마이페이지
      </NavLink>
    </nav>
  );
}

export default BottomTab;
