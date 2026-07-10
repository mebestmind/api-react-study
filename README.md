이 프로젝트는 **React + FastAPI + Supabase**로 구성된 풀스택 스마트 메모장 앱입니다.

---

## **🎯 핵심 기능**

### **1. 인증 시스템**

- **회원가입**: 이메일, 비밀번호, 닉네임으로 새 사용자 등록
- **로그인**: 이메일과 비밀번호로 인증 후 JWT 토큰 발급
- **로그아웃**: 저장된 토큰 삭제
- 토큰은 `localStorage`에 저장되어 새로고침 후에도 로그인 상태 유지

### **2. 메모 CRUD 기능**n
- **조회**: 로그인한 사용자의 메모만 표시
- **생성**: 새로운 메모 작성
- **수정**: 기존 메모 내용 수정
- **삭제**: 메모 삭제
- **글자 수 자동 계산**: 메모 내용의 길이 추적

### **3. 보안 기능**

- **bcrypt 비밀번호 해싱**: 원문 저장 금지
- **JWT 인증**: API 요청마다 토큰 검증
- **사용자 격리**: 각 사용자는 자신의 메모만 접근 가능
- **토큰 자동 첨부**: API 요청 시 Authorization 헤더 자동 추가

---

## **🏗️ 기술 스택**

| **영역** | **기술** |
| --- | --- |
| **프론트엔드** | React, TypeScript, react-router-dom |
| **백엔드** | FastAPI, Python, Uvicorn |
| **데이터베이스** | Supabase (PostgreSQL) |
| **인증** | JWT (python-jose) |
| **비밀번호** | bcrypt |

---

## **📂 프로젝트 구조**

```
api-react-study/
├── frontend/                    # React 앱
│   └── src/
│       ├── pages/              # LoginPage, SignupPage, MemoPage
│       ├── components/          # ProtectedRoute (권한 보호)
│       ├── contexts/            # AuthContext (토큰 관리)
│       └── services/            # api.ts (API 통신)
│
└── backend/                     # FastAPI 서버
    ├── main.py                 # 메인 API 엔드포인트
    ├── auth.py                 # 인증 유틸 함수
    └── requirements.txt         # 의존성
```

---

## **🔌 API 엔드포인트**

| **Method** | **Endpoint** | **기능** | **인증** |
| --- | --- | --- | --- |
| `POST` | `/signup` | 회원가입 | ❌ |
| `POST` | `/login` | 로그인 | ❌ |
| `GET` | `/memos` | 메모 목록 조회 | ✅ |
| `POST` | `/memos` | 메모 생성 | ✅ |
| `PUT` | `/memos/{id}` | 메모 수정 | ✅ |
| `DELETE` | `/memos/{id}` | 메모 삭제 | ✅ |

---

## **🔐 인증 흐름**

1. **회원가입** → `POST /signup` → 데이터베이스 저장
2. **로그인** → `POST /login` → JWT 토큰 발급
3. **토큰 저장** → `localStorage`에 `access_token` 저장
4. **API 요청** → 모든 요청에 `Authorization: Bearer <token>` 헤더 자동 첨부
5. **토큰 검증** → 백엔드에서 토큰 검증 후 사용자 ID 확인
6. **데이터 격리** → 해당 사용자의 메모만 조회/수정/삭제

---

## **📊 데이터베이스 구조**

### **users 테이블**

```sql
id | email | hashed_password | nickname | created_at
```

### **memos 테이블**

```sql
id | content | text_length | user_id | created_at
```

**관계**: 1명의 사용자 ← → 여러 개의 메모

---

## **✨ 주요 특징**

✅ **사용자별 데이터 격리** - 다른 사용자의 메모 접근 불가

✅ **JWT 기반 인증** - 안전한 API 보호

✅ **비밀번호 해싱** - bcrypt로 보안 강화

✅ **라우팅 보호** - 미인증 사용자는 `/` 접근 불가

✅ **자동 토큰 관리** - localStorage를 통한 지속적인 로그인 상태

이 프로젝트는 풀스택 웹 개발의 **인증, 인가, 데이터 보호**의 핵심 개념을 실제로 구현한 학습용 프로젝트입니다!

---

## 관리 및 배포 가이드

아래 내용은 로컬에서 프로젝트 생성(React, Python) 및 GitHub에 소스 업로드하는 기본 절차를 정리한 것입니다.

### 1. 프로젝트 생성

#### React (TypeScript 템플릿)
프론트엔드 디렉토리 `frontend`를 자동 생성합니다.

```bash
npx create-react-app frontend --template typescript
cd frontend
npm start   # 개발 서버 시작
# 서버 중지: Ctrl + C
```

#### Python
로컬에 Python 가상환경을 만들어 사용합니다.

```bash
mkdir python_study   # 디렉토리 생성 (필수)
cd python_study
python -m venv venv
# 가상환경 활성화
# Windows: venv\\Scripts\\activate
# macOS / Linux: source venv/bin/activate
```

---

### 2. GitHub 소스 업로드 방법

1. 변경된 모든 파일을 준비 영역(staging area)에 올립니다.
```bash
git add .
```

2. (최초 설정) Git 줄바꿈, 사용자 정보 설정 (필요한 경우 한 번만 실행)
```bash
git config --global core.autocrlf true             # Windows에서 CRLF 자동 변환
git config --global user.email "내이메일@주소.com"
git config --global user.name "내이름"
```

3. 변경사항을 커밋합니다.
```bash
git commit -m "feat: 프로젝트 기본 디렉토리 구조 및 환경 세팅 완료"
```

4. 원격 저장소로 푸시합니다.
```bash
git push origin main
```

#### 충돌이나 최신 변경사항이 있어 푸시가 안 될 때
먼저 원격 변경사항을 내려받아 병합한 뒤 다시 푸시합니다.

```bash
# 1) 원격 변경사항을 내려받아 자동 병합 (--no-edit: 병합 메시지 편집 생략)
git pull origin main --no-edit

# 2) 병합한 내용을 다시 푸시
git push origin main
```

---

### 3. 저장소 로컬로 복제하기 (클론)

로컬에서 작업할 디렉토리 위치로 이동한 뒤 실행합니다.

```bash
# 잘못 생성된 디렉토리 삭제 (주의: 폴더 전체 삭제)
rm -rf python-react-study

# 저장소 복제
git clone https://github.com/본인의유저네임/리포지토리이름.git
cd 리포지토리이름
```

---

### 4. GitHub 커밋 메시지 규칙 (권장)

커밋 메시지는 나중에 쉽게 이해할 수 있게 머릿말(type)을 붙여 작성합니다.

- feat: 새로운 기능 추가  
  예) feat: React 로그인 화면 UI 구현

- fix: 버그 수정  
  예) fix: Supabase 데이터 불러오기 에러 수정

- docs: 문서 작업  
  예) docs: 개발 환경 문서 업데이트

- study: 학습 및 예제 코드  
  예) study: 파이썬 기초 문법 예제 작성

커밋 메시지는 가능한 한 간결하고 무엇을 변경했는지 명확히 적습니다.
