import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();   // AuthContext 에서 로그인 상태 확인

  // 로그인 안 했으면 로그인 페이지로 돌려보냄
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 로그인 했으면 감싼 화면을 그대로 보여줌
  return <>{children}</>;
}

export default ProtectedRoute;


/*
로그인 안 한 사용자를 막는 코드

useAuth()로 지금 로그인 상태(isLoggedIn)를 확인하고, 딱 두 가지로 갈라져요.
로그인이 안 된 상태면 <Navigate to="/login" />을 반환해서 자동으로 로그인 페이지로 보내요. 여기서 replace 옵션은 "지금 페이지를 방문 기록에 남기지 말고 로그인 페이지로 바꿔치기"하라는 뜻이에요. 이렇게 하면 로그인 후 뒤로가기를 눌러도 막혀 있던 페이지로 되돌아가서 다시 튕기는 어색한 상황이 안 생겨요.
로그인이 된 상태면 {children}, 즉 감싸고 있던 실제 화면(메모 페이지)을 그대로 보여줘요.
*/