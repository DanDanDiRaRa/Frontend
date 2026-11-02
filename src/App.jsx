import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import MapPage from "./pages/MapPage";
import MyPage from "./pages/MyPage";
import SignupPage from "./pages/SignupPage";
import VisitedPlacesPage from "./pages/VisitedPlacesPage";
import RewardsPage from "./pages/RewardsPage";
import PlaceDetailPage from "./pages/PlaceDetailPage";
import VerifyPage from "./pages/VerifyPage";
import VerifyResultPage from "./pages/VerifyResultPage";
import PastPhotoPage from "./pages/PastPhotoPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/places" element={<VisitedPlacesPage />} />
        <Route path="/mypage/rewards" element={<RewardsPage />} />
        <Route path="/place/:id" element={<PlaceDetailPage />} />
        <Route path="/place/:id/verify" element={<VerifyPage />} />
        <Route path="/place/:id/result" element={<VerifyResultPage />} />
        <Route path="/place/:id/photos" element={<PastPhotoPage />} />
      </Route>
    </Routes>
  );
}

export default App;