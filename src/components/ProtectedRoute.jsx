
import { useEffect, useState } from "react";
import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { checkAuthStatus } from "../api/auth";
import { getToken, removeToken } from "../api/token";
import Button from "./Button";

function ProtectedRoute() {
  const location = useLocation();

  const [authState, setAuthState] = useState(
    getToken() ? "checking" : "unauthenticated"
  );

  const [retryCount, setRetryCount] = useState(0);

  
  useEffect(() => {
    let active = true;

    // 토큰이 없다면 서버에 요청하지 않음
    if (!getToken()) {
        return;
    }

    checkAuthStatus()
        .then(() => {
        if (!active) return;

        setAuthState("authenticated");
        })
        .catch((error) => {
        if (!active) return;

        if (error.status === 401) {
            removeToken();
            setAuthState("unauthenticated");
        } else {
            setAuthState("error");
        }
        });

    return () => {
        active = false;
    };
    }, [retryCount]);


  // 서버 응답을 기다리는 동안
  if (authState === "checking") {
    return (
      <p role="status">
        로그인 상태를 확인하고 있어요...
      </p>
    );
  }

  // 서버 연결 오류
  if (authState === "error") {
    return (
      <div role="alert">
        <p>로그인 상태를 확인하지 못했습니다.</p>
        <Button
            onClick={() => {
                setAuthState("checking");
                setRetryCount((count) => count + 1);
            }}
        >
        다시 시도
        </Button>
      </div>
    );
  }

  // 인증되지 않은 사용자
  if (authState === "unauthenticated") {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // 서버 인증에 성공한 사용자
  return <Outlet />;
}

export default ProtectedRoute;
