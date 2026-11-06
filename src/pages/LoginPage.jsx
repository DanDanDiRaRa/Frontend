
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logIn } from "../api/auth";
import Input from "../components/Input";
import Button from "../components/Button";
import "./AuthPage.css";

function LoginPage() {
  const navigate = useNavigate();

  const [accountId, setAccountId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    if (!accountId.trim() || !password) {
      setError("계정과 비밀번호를 입력해 주세요.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await logIn({
        accountId: accountId.trim(),
        password,
      });

      navigate("/map", { replace: true });
    } catch (err) {
      setError(
        err.message || "로그인 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth">
      <p className="auth-eyebrow">오늘의 길에서</p>
      <h1 className="auth-title">
        오래된 기억을 발견해요.
      </h1>
      <p className="auth-desc">
        기억을 따라, 장소를 탐색하세요
      </p>

      <form className="auth-card" onSubmit={handleLogin}>
        <Input
          label="계정"
          placeholder="계정을 입력해 주세요"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          autoComplete="username"
        />

        <Input
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력해 주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {error && (
          <p
            role="alert"
            style={{ color: "var(--color-rust)" }}
          >
            {error}
          </p>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "로그인 중..." : "로그인"}
        </Button>

        <div className="auth-gap" />

        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/signup")}
        >
          회원가입
        </Button>
      </form>
    </div>
  );
}

export default LoginPage;
