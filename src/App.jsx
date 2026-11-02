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
import MissionPage from "./pages/MissionPage";
import MissionSubmitPage from "./pages/MissionSubmitPage";
import MissionResultPage from "./pages/MissionResultPage";
import RewardResultPage from "./pages/RewardResultPage";
import RewardDetailPage from "./pages/RewardDetailPage";
import VisitedPlaceDetailPage from "./pages/VisitedPlaceDetailPage";
import ProfilePage from "./pages/ProfilePage";
import ProfileEditPage from "./pages/ProfileEditPage";

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
        <Route path="/place/:id/mission" element={<MissionPage />} />
        <Route path="/place/:id/mission/submit" element={<MissionSubmitPage />} />
        <Route path="/place/:id/mission/result" element={<MissionResultPage />} />
        <Route path="/place/:id/reward" element={<RewardResultPage />} />
        <Route path="/mypage/rewards/:rewardId" element={<RewardDetailPage />} />
        <Route path="/mypage/places/:id" element={<VisitedPlaceDetailPage />} />
        <Route path="/mypage/profile" element={<ProfilePage />} />
        <Route path="/mypage/profile/edit" element={<ProfileEditPage />} />
      </Route>
    </Routes>
  );
}

export default App;