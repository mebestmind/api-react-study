# 스마트 메모장 프로젝트 디렉토리 구조 및 사양 요약

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

`ProtectedRoute.tsx`는 로그인하지 않은 사용자가 메모 페이지에 접근하지 못하도록 막는 역할을 한다.

동작 흐름은 다음과 같다.

```
isLoggedIn 확인
  ├─ false → /login 이동
  └─ true  → MemoPage 표시
```

---

### services/api.ts

`api.ts`는 메모 관련 API 요청을 한곳에서 관리한다.

주요 역할은 다음과 같다.

- localStorage에서 `access_token`을 읽는다.
- 요청마다 `Authorization: Bearer <token>` 헤더를 자동으로 붙인다.
- 메모 CRUD API 함수를 제공한다.

제공 함수는 다음과 같다.

```tsx
getMemos()
createMemo(content)
updateMemo(id, content)
deleteMemo(id)
```

메모 타입 예시는 다음과 같다.

```tsx
export interface MemoItem {
  id: number;
  created_at: string;
  content: string;
  text_length?: number;
  user_id?: number;
}
```

---

### LoginPage.tsx

`LoginPage.tsx`는 로그인 화면을 담당한다.

주요 역할은 다음과 같다.

- 이메일과 비밀번호 입력
- `/login` API 호출
- 로그인 성공 시 `access_token` 저장
- 메모 페이지 `/`로 이동

로그인 API는 JSON이 아니라 **form-urlencoded** 형식으로 요청한다.

```tsx
const body = new URLSearchParams();
body.append("username", email);
body.append("password", password);
```

요청 형식은 다음과 같다.

```
POST /login
Content-Type: application/x-www-form-urlencoded
```

---

### SignupPage.tsx

`SignupPage.tsx`는 회원가입 화면을 담당한다.

주요 역할은 다음과 같다.

- 이메일 입력
- 닉네임 입력
- 비밀번호 입력
- 비밀번호 확인 입력
- 비밀번호 일치 여부 확인
- `/signup` API 호출
- 회원가입 성공 시 로그인 페이지로 이동

요청 형식은 다음과 같다.

```
POST /signup
Content-Type: application/json
```

요청 body 예시는 다음과 같다.

```json
{
  "email": "test@example.com",
  "password": "123456",
  "nickname": "테스터"
}
```

---

### MemoPage.tsx

`MemoPage.tsx`는 로그인한 사용자의 메모 화면을 담당한다.

주요 역할은 다음과 같다.

- 메모 목록 조회
- 메모 작성
- 메모 수정
- 메모 삭제
- 로그아웃

사용 API는 다음과 같다.

```tsx
getMemos()
createMemo(inputText)
updateMemo(id, editText)
deleteMemo(id)
```

---

## 9. 백엔드 디렉토리 구조

```
backend/
├── main.py
├── auth.py
├── .env
├── requirements.txt
└── venv/
```

---

## 10. 백엔드 파일별 역할

| 파일 | 역할 |
| --- | --- |
| `main.py` | FastAPI 앱과 API 엔드포인트 정의 |
| `auth.py` | 인증 관련 유틸 함수 정의 |
| `.env` | 환경변수 저장 |
| `requirements.txt` | Python 패키지 목록 |
| `venv/` | Python 가상환경 |

---

## 11. 백엔드 패키지 사양

`requirements.txt`

```
fastapi
uvicorn[standard]
supabase
python-dotenv
bcrypt
python-jose[cryptography]
python-multipart
```

| 패키지 | 역할 |
| --- | --- |
| `fastapi` | API 서버 프레임워크 |
| `uvicorn[standard]` | FastAPI 실행 서버 |
| `supabase` | Supabase 연결 |
| `python-dotenv` | `.env` 로드 |
| `bcrypt` | 비밀번호 해싱 |
| `python-jose[cryptography]` | JWT 생성 및 검증 |
| `python-multipart` | 로그인 폼 데이터 처리 |

---

## 12. 환경변수 사양

`backend/.env`

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SECRET_KEY=your_secret_key
```

| 변수 | 역할 |
| --- | --- |
| `SUPABASE_URL` | Supabase 프로젝트 URL |
| `SUPABASE_KEY` | Supabase API Key |
| `SECRET_KEY` | JWT 서명용 비밀 키 |

주의사항:

- `.env`는 GitHub에 올리지 않는다.
- `SECRET_KEY`는 충분히 긴 랜덤 문자열을 사용한다.
- Supabase Key와 Secret Key는 외부에 노출하지 않는다.

---

## 13. auth.py 사양

`auth.py`는 인증 관련 기능을 담당한다.

주요 함수는 다음과 같다.

| 함수 | 역할 |
| --- | --- |
| `hash_password(password)` | 비밀번호를 bcrypt로 해싱 |
| `verify_password(plain_password, hashed_password)` | 입력 비밀번호와 해시 비교 |
| `create_access_token(user_id)` | JWT access token 생성 |
| `get_current_user(token)` | 토큰 검증 후 현재 사용자 ID 반환 |

비밀번호 해싱 시 bcrypt의 특성을 고려해 비밀번호를 바이트 단위로 처리한다.

```python
password.encode("utf-8")[:72]
```

---

## 14. main.py 사양

`main.py`는 FastAPI 서버의 중심 파일이다.

주요 역할은 다음과 같다.

- FastAPI 앱 생성
- CORS 설정
- Supabase 클라이언트 생성
- Pydantic 모델 정의
- 회원가입 API 정의
- 로그인 API 정의
- 메모 CRUD API 정의
- 루트 확인 API 정의

---

## 15. 백엔드 API 목록

| Method | Endpoint | 역할 | 인증 필요 |
| --- | --- | --- | --- |
| `GET` | `/` | 서버 동작 확인 | 아니오 |
| `POST` | `/signup` | 회원가입 | 아니오 |
| `POST` | `/login` | 로그인 및 JWT 발급 | 아니오 |
| `GET` | `/memos` | 내 메모 목록 조회 | 예 |
| `POST` | `/memos` | 내 메모 생성 | 예 |
| `PUT` | `/memos/{memo_id}` | 내 메모 수정 | 예 |
| `DELETE` | `/memos/{memo_id}` | 내 메모 삭제 | 예 |

---

## 16. API 상세 사양

### 서버 상태 확인

```
GET /
```

응답 예시:

```json
{
  "message": "FastAPI 서버가 정상적으로 실행 중입니다!"
}
```

---

### 회원가입

```
POST /signup
Content-Type: application/json
```

요청 body:

```json
{
  "email": "test@example.com",
  "password": "123456",
  "nickname": "테스터"
}
```

처리 흐름:

1. 이메일 중복 확인
2. 비밀번호 해싱
3. `users` 테이블에 저장

응답 예시:

```json
{
  "message": "회원가입 성공",
  "user_id": 1
}
```

---

### 로그인

```
POST /login
Content-Type: application/x-www-form-urlencoded
```

요청 body:

```
username=test@example.com&password=123456
```

처리 흐름:

1. `username` 값을 이메일로 사용
2. 사용자 조회
3. 비밀번호 검증
4. JWT 발급

응답 예시:

```json
{
  "access_token": "jwt_token_here",
  "token_type": "bearer"
}
```

---

### 내 메모 목록 조회

```
GET /memos
Authorization: Bearer <access_token>
```

처리 흐름:

1. 토큰 검증
2. 현재 사용자 ID 확인
3. `user_id`가 현재 사용자와 같은 메모만 조회

---

### 메모 생성

```
POST /memos
Authorization: Bearer <access_token>
Content-Type: application/json
```

요청 body:

```json
{
  "content": "새 메모입니다."
}
```

처리 흐름:

1. 토큰 검증
2. 현재 사용자 ID 확인
3. `content`, `text_length`, `user_id` 저장

---

### 메모 수정

```
PUT /memos/{memo_id}
Authorization: Bearer <access_token>
Content-Type: application/json
```

요청 body:

```json
{
  "content": "수정된 메모입니다."
}
```

처리 흐름:

1. 토큰 검증
2. `id`와 `user_id`가 모두 일치하는 메모만 수정

---

### 메모 삭제

```
DELETE /memos/{memo_id}
Authorization: Bearer <access_token>
```

처리 흐름:

1. 토큰 검증
2. `id`와 `user_id`가 모두 일치하는 메모만 삭제

---

## 17. 데이터베이스 사양

### users 테이블

```sql
create table users (
    id              bigint generated always as identity primary key,
    email           text unique not null,
    hashed_password text not null,
    nickname        text,
    created_at      timestamptz default now()
);
```

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| `id` | bigint | 사용자 ID |
| `email` | text | 이메일, 중복 불가 |
| `hashed_password` | text | 해싱된 비밀번호 |
| `nickname` | text | 닉네임 |
| `created_at` | timestamptz | 생성 시각 |

---

### memos 테이블

기존 `memos` 테이블에 `user_id` 컬럼을 추가한다.

```sql
alter table memos
add column user_id bigint references users(id) on delete cascade;
```

예상 구조는 다음과 같다.

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| `id` | bigint 또는 int | 메모 ID |
| `created_at` | timestamptz | 생성 시각 |
| `content` | text | 메모 내용 |
| `text_length` | int | 글자 수 |
| `user_id` | bigint | 메모 소유자 ID |

관계는 다음과 같다.

```
users 1명 ───< memos 여러 개
users.id      memos.user_id
```

---

## 18. 인증 흐름

```
회원가입
  ↓
POST /signup
  ↓
users 테이블에 사용자 저장
  ↓
로그인
  ↓
POST /login
  ↓
비밀번호 검증
  ↓
JWT access_token 발급
  ↓
프론트엔드 localStorage에 토큰 저장
  ↓
메모 페이지 접근
  ↓
api.ts가 Authorization 헤더 자동 첨부
  ↓
백엔드 get_current_user가 토큰 검증
  ↓
현재 사용자 ID 확인
  ↓
해당 사용자의 메모만 조회/생성/수정/삭제
```

---

## 19. 보안 사양

### 적용된 보안

- 비밀번호 원문 저장 금지
- bcrypt로 비밀번호 해싱
- JWT 기반 인증
- 인증 필요한 API에 토큰 검증 적용
- 메모 조회 시 `user_id` 필터링
- 메모 수정/삭제 시 `id` + `user_id` 함께 확인
- 사용자별 메모 격리
- `.env`로 민감정보 분리

### 추가로 고려할 수 있는 보안 개선

현재 학습용 구현에서는 토큰을 `localStorage`에 저장한다.

학습용으로는 구현이 간단하고 새로고침 후 로그인 유지가 쉽다는 장점이 있지만, 실제 서비스에서는 보안 요구사항에 따라 다음 방식도 고려할 수 있다.

- httpOnly cookie
- refresh token
- 토큰 만료 처리 개선
- 비밀번호 정책 강화
- Supabase RLS 추가 적용

---

## 20. 실행 방법

### 백엔드 실행

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

확인 주소:

```
http://localhost:8000/
```

---

### 프론트엔드 실행

```bash
cd frontend
npm install
npm install react-router-dom
npm start
```

확인 주소:

```
http://localhost:3000
```

---

## 21. 테스트 체크리스트

### 회원가입

- [ ]  새 이메일로 회원가입 가능
- [ ]  중복 이메일로 가입 시 에러 표시
- [ ]  비밀번호 확인이 다르면 에러 표시
- [ ]  Supabase `users` 테이블에 사용자 저장
- [ ]  `hashed_password`가 원문이 아닌 해시로 저장

### 로그인

- [ ]  올바른 계정으로 로그인 가능
- [ ]  틀린 비밀번호 입력 시 에러 표시
- [ ]  로그인 성공 시 `/`로 이동
- [ ]  localStorage에 `access_token` 저장

### 메모

- [ ]  메모 작성 가능
- [ ]  내 메모 목록 조회 가능
- [ ]  메모 수정 가능
- [ ]  메모 삭제 가능
- [ ]  Network 탭에서 Authorization 헤더 확인 가능

### 사용자 격리

- [ ]  A 계정의 메모가 B 계정에서 보이지 않음
- [ ]  B 계정의 메모가 A 계정에서 보이지 않음
- [ ]  남의 메모 ID로 수정/삭제 시 실패

### 로그아웃

- [ ]  로그아웃 시 토큰 삭제
- [ ]  로그아웃 후 `/` 접근 시 `/login`으로 이동

---

## 22. 한 줄 요약

이 프로젝트는 **React 프론트엔드, FastAPI 백엔드, Supabase 데이터베이스**로 구성된 풀스택 메모장 앱이며, 직접 구현한 **JWT 인증**을 통해 사용자별로 메모를 분리해서 관리하는 구조다.