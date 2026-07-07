import React, { createContext, useContext, useState, ReactNode } from 'react';

// Context 가 제공할 값들의 타입 정의
interface AuthContextType {
  token: string | null;      // 저장된 출입증(JWT)
  isLoggedIn: boolean;       // 로그인 상태 여부
  login: (token: string) => void;   // 로그인 시 토큰 저장
  logout: () => void;                // 로그아웃 시 토큰 삭제
}

// Context 생성 (초기값 undefined → useAuth 에서 안전장치로 체크)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 앱 전체를 감싸서 로그인 상태를 공유하는 Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  // 새로고침해도 로그인이 유지되도록 localStorage 에서 초기값을 읽어옴
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('access_token')
  );

  // 로그인: 토큰을 상태와 localStorage 양쪽에 저장
  const login = (newToken: string) => {
    localStorage.setItem('access_token', newToken);
    setToken(newToken);
  };

  // 로그아웃: 토큰을 상태와 localStorage 양쪽에서 삭제
  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
  };

  const value: AuthContextType = {
    token,
    isLoggedIn: !!token,   // 토큰이 있으면 true, 없으면 false
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 어디서든 로그인 상태·함수를 꺼내 쓰는 커스텀 훅
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // <AuthProvider> 바깥에서 useAuth 를 쓰면 이 에러가 납니다
    throw new Error('useAuth 는 AuthProvider 안에서만 사용할 수 있습니다.');
  }
  return context;
}