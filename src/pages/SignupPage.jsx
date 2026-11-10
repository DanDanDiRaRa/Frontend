
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../api/auth";
import Input from "../components/Input";
import Button from "../components/Button";
import "./AuthPage.css";

function SignupPage() {
  const navigate = useNavigate();

  const [accountId, setAccountId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    const trimmedAccountId = accountId.trim();
    const trimmedNickname = nickname.trim();

    // 계정 입력 검증
    if (trimmedAccountId.length < 4 || trimmedAccountId.length > 50) {
      setError("계정은 4~50자로 입력해 주세요.");
      return;
    }

    if (/^(kakao_|apple_)/i.test(trimmedAccountId)) {
      setError("사용할 수 없는 계정 ID 형식입니다.");
      return;
    }

    // 비밀번호 검증
    if (password.length < 6 || password.length > 72) {
      setError("비밀번호는 6~72자로 입력해 주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 닉네임 필수 입력 검증
    if (!trimmedNickname) {
      setError("닉네임을 입력해 주세요.");
      return;
    }

    if (trimmedNickname.length < 2 || trimmedNickname.length > 50) {
      setError("닉네임은 2~50자로 입력해 주세요.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await signUp({
        accountId: trimmedAccountId,
        password,
        passwordConfirm,
        nickname: trimmedNickname,
      });

      alert("회원가입이 완료되었습니다. 로그인해 주세요.");
      navigate("/login", { replace: true });
    } catch (err) {
      setError(
        err.message || "회원가입 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth">
      <h1 className="auth-title">회원가입</h1>
      <p className="auth-desc">
        서비스를 시작할 계정을 만들어주세요.
      </p>

      <form className="auth-card" onSubmit={handleSignup}>
        <Input
          label="계정"
          placeholder="계정 입력 (4~50자)"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          autoComplete="username"
        />

        <Input
          label="비밀번호"
          type="password"
          placeholder="비밀번호 입력 (6~72자)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />

        <Input
          label="비밀번호 확인"
          type="password"
          placeholder="비밀번호 확인"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          autoComplete="new-password"
        />

        <Input
          label="닉네임 (필수)"
          type="text"
          placeholder="닉네임 입력 (2~50자)"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          autoComplete="nickname"
          minLength={2}
          maxLength={50}
          required
        />

        {error && (
          <p
            role="alert"
            style={{ color: "var(--color-rust, #B86A4B)" }}
          >
            {error}
          </p>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "계정 생성 중..." : "계정 생성"}
        </Button>

        <div className="auth-gap" />

        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/login")}
        >
          로그인으로 돌아가기
        </Button>
      </form>
    </div>
  );
}

export default SignupPage;
