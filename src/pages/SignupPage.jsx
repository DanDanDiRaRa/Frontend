import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import "./AuthPage.css";

function SignupPage() {
  const navigate = useNavigate();

  return (
    <div className="auth">
      <h1 className="auth-title">회원가입</h1>
      <p className="auth-desc">서비스를 시작할 계정을 만들어주세요.</p>

      <div className="auth-card">
        <Input label="계정" placeholder="계정 입력" />
        <Input label="비밀번호" type="password" placeholder="비밀번호 입력" />
        <Input label="비밀번호 확인" type="password" placeholder="비밀번호 확인" />
        <Button onClick={() => navigate("/login")}>계정 생성</Button>
        <div className="auth-gap" />
        <Button variant="secondary" onClick={() => navigate("/login")}>
          로그인으로 돌아가기
        </Button>
      </div>
    </div>
  );
}

export default SignupPage;