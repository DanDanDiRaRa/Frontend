
import {
  Outlet,
  useLocation,
} from "react-router-dom";

import BottomTab from "./BottomTab";
import "./Layout.css";

function Layout() {
  const { pathname } = useLocation();

  const isAuthPage = [
    "/",
    "/login",
    "/signup",
  ].includes(pathname);

  return (
    <div className="app">
      <header className="app-header">
        기억의 좌표
      </header>

      <main
        className={
          isAuthPage
            ? "app-main app-main--no-tab"
            : "app-main"
        }
      >
        <Outlet />
      </main>

      {!isAuthPage && <BottomTab />}
    </div>
  );
}

export default Layout;
