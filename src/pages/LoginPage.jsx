import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import "./AuthPage.css";

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="auth">
      <p className="auth-eyebrow">오늘의 길에서</p>
      <h1 className="auth-title">오래된 기억을 발견해요.</h1>
      <p className="auth-desc">기억을 따라, 장소를 탐색하세요</p>

      <div className="auth-card">
        <Input label="계정" placeholder="계정을 입력해 주세요" />
        <Input label="비밀번호" type="password" placeholder="비밀번호를 입력해 주세요" />
        <Button onClick={() => navigate("/map")}>로그인</Button>
        <div className="auth-gap" />
        <Button variant="secondary" onClick={() => navigate("/signup")}>
          회원가입
        </Button>
      </div>
    </div>
  );
}

export default LoginPage;