import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MemoPage from './pages/MemoPage';
import './App.css';

function App() {
  return (
    // 1) 앱 전체에 로그인 상태(토큰)를 공유
    <AuthProvider>
      {/* 2) 브라우저 주소(URL)에 따라 화면을 전환 */}
      <BrowserRouter>
        <Routes>
          {/* 로그인 없이 접근 가능한 페이지 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* 로그인해야만 접근 가능한 페이지 (문지기로 보호) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MemoPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;