import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>로그인</h1>
      <p>기억을 따라, 장소를 탐색하세요</p>
      <Input label="계정" placeholder="계정을 입력해 주세요" />
      <Input label="비밀번호" type="password" placeholder="비밀번호를 입력해 주세요" />
      <Button onClick={() => navigate("/map")}>로그인</Button>
      <div style={{ height: 8 }} />
      <Button variant="secondary" onClick={() => navigate("/signup")}>회원가입</Button>
    </div>
  );
}

export default LoginPage;