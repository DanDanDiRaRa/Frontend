import { Outlet } from "react-router-dom";
import BottomTab from "./BottomTab";
import "./Layout.css";

function Layout() {
  return (
    <div className="app">
      <header className="app-header">기억의 좌표</header>
      <main className="app-main">
        <Outlet />
      </main>
      <BottomTab />
    </div>
  );
}

export default Layout;