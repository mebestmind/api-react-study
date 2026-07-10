이 프로젝트는 **React + FastAPI + Supabase**로 구성된 풀스택 스마트 메모장 앱입니다.

---

## **🎯 핵심 기능**

### **1. 인증 시스템**

- **회원가입**: 이메일, 비밀번호, 닉네임으로 새 사용자 등록
- **로그인**: 이메일과 비밀번호로 인증 후 JWT 토큰 발급
- **로그아웃**: 저장된 토큰 삭제
- 토큰은 `localStorage`에 저장되어 새로고침 후에도 로그인 상태 유지

### **2. 메모 CRUD 기능**
- **조회**: 로그인한 사용자의 메모만 표시
- **생성**: 새로운 메모 작성
- **수정**: 기존 메모 내용 수정
- **삭제**: 메모 삭제
- **글자 수 자동 계산**: 메모 내용의 길이 추적

### **3. 보안 기능**n

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

## 관리 문서

프로젝트의 로컬 생성, 배포 및 GitHub 업로드 절차 등 관리·배포 가이드는 별도 문서로 분리되어 있습니다.  
자세한 내용은 [관리 및 배포 가이드](./docs/manage.md)를 확인하세요.
