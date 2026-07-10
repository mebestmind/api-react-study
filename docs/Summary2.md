# 스마트 메모장 프로젝트 디렉토리 구조 및 사양 요약

## 1. 프로젝트 개요

이 프로젝트는 **React + FastAPI + Supabase**로 구성된 풀스택 스마트 메모장 앱이다.

기본 메모 CRUD 기능에 더해, 로그인/회원가입 기능을 직접 구현하여 **사용자별로 메모를 분리해서 관리**할 수 있도록 업그레이드했다.

---

## 2. 전체 기술 스택

| 영역 | 기술 |
| --- | --- |
| 프론트엔드 | React, TypeScript, react-router-dom |
| 백엔드 | FastAPI, Python, Uvicorn |
| 데이터베이스 | Supabase PostgreSQL |
| 인증 방식 | 직접 구현한 회원가입/로그인 + JWT |
| 비밀번호 해싱 | bcrypt |
| 환경변수 관리 | python-dotenv |
| API 통신 | fetch |
| 토큰 저장 | localStorage |

---

## 3. 전체 디렉토리 구조

```
api-react-study/
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── public/
│   └── src/
│       ├── App.tsx
│       ├── App.css
│       ├── index.tsx
│       ├── services/
│       │   └── api.ts
│       ├── contexts/
│       │   └── AuthContext.tsx
│       ├── components/
│       │   └── ProtectedRoute.tsx
│       └── pages/
│           ├── LoginPage.tsx
│           ├── SignupPage.tsx
│           └── MemoPage.tsx
│
└── backend/
    ├── main.py
    ├── auth.py
    ├── .env
    ├── requirements.txt
    └── venv/
```

---

## 4. 프로젝트 구성 요약

### 프론트엔드

프론트엔드는 사용자가 직접 보는 화면을 담당한다.

주요 기능은 다음과 같다.

- 회원가입 화면 제공
- 로그인 화면 제공
- 로그인 상태 유지
- 로그인하지 않은 사용자 차단
- 메모 조회
- 메모 작성
- 메모 수정
- 메모 삭제
- 로그아웃
- API 요청 시 JWT 토큰 자동 첨부

### 백엔드

백엔드는 프론트엔드의 요청을 받아 다음 작업을 처리한다.

- 회원가입
- 로그인
- 비밀번호 해싱
- JWT 토큰 발급
- JWT 토큰 검증
- 현재 로그인한 사용자 식별
- 사용자별 메모 조회
- 메모 생성
- 메모 수정
- 메모 삭제

### 데이터베이스

Supabase PostgreSQL을 사용한다.

기존에는 `memos` 테이블만 있었지만, 사용자 인증 기능을 추가하면서 `users` 테이블을 새로 만들고 `memos` 테이블에 `user_id` 컬럼을 추가했다.

---

## 5. 프론트엔드 디렉토리 구조

```
frontend/src/
├── App.tsx
├── App.css
├── index.tsx
├── services/
│   └── api.ts
├── contexts/
│   └── AuthContext.tsx
├── components/
│   └── ProtectedRoute.tsx
└── pages/
    ├── LoginPage.tsx
    ├── SignupPage.tsx
    └── MemoPage.tsx
```

---

## 6. 프론트엔드 파일별 역할

| 파일 | 역할 |
| --- | --- |
| `App.tsx` | 전체 라우팅 설정 |
| `index.tsx` | React 앱 진입점 |
| `App.css` | 기본 스타일 |
| `services/api.ts` | 백엔드 API 호출 함수 모음 |
| `contexts/AuthContext.tsx` | 로그인 토큰 저장 및 공유 |
| `components/ProtectedRoute.tsx` | 로그인하지 않은 사용자 접근 차단 |
| `pages/LoginPage.tsx` | 로그인 화면 |
| `pages/SignupPage.tsx` | 회원가입 화면 |
| `pages/MemoPage.tsx` | 메모 CRUD 화면 |

---

## 7. 프론트엔드 라우팅 구조

```tsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/signup" element={<SignupPage />} />

  <Route
    path="/"
    element={
      <ProtectedRoute>
        <MemoPage />
      </ProtectedRoute>
    }
  />
</Routes>
```

| 경로 | 화면 | 접근 조건 |
| --- | --- | --- |
| `/login` | 로그인 페이지 | 누구나 접근 가능 |
| `/signup` | 회원가입 페이지 | 누구나 접근 가능 |
| `/` | 메모 페이지 | 로그인한 사용자만 접근 가능 |

---

## 8. 프론트엔드 핵심 파일 사양

### App.tsx

`App.tsx`는 전체 라우팅을 담당한다.

주요 역할은 다음과 같다.

- `AuthProvider`로 앱 전체를 감싼다.
- `BrowserRouter`로 라우팅을 관리한다.
- 로그인 페이지, 회원가입 페이지, 메모 페이지를 연결한다.
- 메모 페이지는 `ProtectedRoute`로 보호한다.

---

### AuthContext.tsx

`AuthContext.tsx`는 로그인 토큰을 앱 전체에서 공유하기 위한 파일이다.

주요 역할은 다음과 같다.

- 로그인 시 토큰 저장
- 로그아웃 시 토큰 삭제
- 로그인 여부 확인
- 새로고침 후에도 localStorage에서 토큰 복원
- `login()` 함수 제공
- `logout()` 함수 제공
- `isLoggedIn` 값 제공

관리하는 값은 다음과 같다.

```tsx
token: string | null
isLoggedIn: boolean
login: (token: string) => void
logout: () => void
```

---

### ProtectedRoute.tsx

{