# Client-Server API 아키텍처

**풀스택 구조**: 리액트(프론트엔드) ↔ 파이썬 FastAPI(서버) ↔ 데이터베이스

REST API를 통해 리액트와 파이썬 서버가 직접 통신하는 진정한 풀스택 애플리케이션 구축 가이드입니다.

---

## 📋 목차
1. [초기 세팅](#초기-세팅)
2. [프론트엔드 (React) 설정](#프론트엔드-react-설정)
3. [백엔드 (FastAPI) 설정](#백엔드-fastapi-설정)
4. [풀스택 연동 테스트](#풀스택-연동-테스트)

---

## 초기 세팅

### Step 1: 프로젝트 폴더 생성

```bash
mkdir api-react-study
cd api-react-study
```

### Step 2: 리액트 프로젝트 생성

```bash
npx create-react-app frontend --template typescript
```

### Step 3: 백엔드 폴더 및 파이썬 가상환경 설정

리액트 설치가 완료된 후, 같은 레벨에서 백엔드를 설정합니다.

```bash
# 백엔드 폴더 생성
mkdir backend
cd backend

# 파이썬 가상환경 생성 및 활성화 (Windows)
python -m venv venv
.\venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 4: 필수 패키지 설치

가상환경 활성화 상태에서 다음을 설치합니다:

```bash
pip install fastapi "uvicorn[standard]" supabase python-dotenv
```

| 패키지 | 역할 |
|--------|------|
| **FastAPI** | REST API 서버 구축 |
| **uvicorn** | FastAPI 실행 엔진 |
| **supabase** | 데이터베이스 클라이언트 |
| **python-dotenv** | 환경변수 관리 |

### 최종 폴더 구조

```
api-react-study/
├── frontend/          # React 프로젝트
│   ├── src/
│   ├── public/
│   └── package.json
└── backend/           # Python FastAPI 서버
    ├── venv/          # 파이썬 가상환경
    ├── main.py
    ├── .env
    └── requirements.txt
```

---

## 프론트엔드 (React) 설정

### REST API HTTP 메서드 규칙

리액트에서 파이썬 서버로 데이터를 요청할 때는 **목적에 따라 다른 HTTP 메서드**를 사용합니다. (업계 표준)

| 작업 | HTTP 메서드 | 설명 |
|------|------------|------|
| **조회 (Read)** | `GET` | 기본값, 데이터만 요청 |
| **생성 (Create)** | `POST` | 새 데이터를 본문에 담아 전송 |
| **수정 (Update)** | `PUT` | ID + 변경된 데이터를 함께 전송 |
| **삭제 (Delete)** | `DELETE` | 지울 데이터의 ID만 전송 |

### frontend/src/App.tsx 예시

```typescript
// GET 요청 (조회)
fetch('http://localhost:8000/items')
  .then(res => res.json())
  .then(data => console.log(data));

// POST 요청 (생성)
fetch('http://localhost:8000/items', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: '새 메모', content: '내용' })
});

// PUT 요청 (수정)
fetch('http://localhost:8000/items/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: '수정된 메모', content: '수정된 내용' })
});

// DELETE 요청 (삭제)
fetch('http://localhost:8000/items/1', { method: 'DELETE' });
```

### 프론트엔드 실행

```bash
cd frontend
npm start
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

---

## 백엔드 (FastAPI) 설정

### Step 1: 환경변수 파일 생성

`backend/.env` 파일을 생성하고 필요한 정보를 입력합니다:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### Step 2: FastAPI 메인 코드 작성

`backend/main.py` 파일을 생성하고 다음 CRUD 코드를 작성합니다:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

# CORS 설정 (리액트에서의 요청 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 데이터 모델
class Item(BaseModel):
    id: int = None
    title: str
    content: str

# GET: 모든 데이터 조회
@app.get("/")
def read_root():
    return {"message": "FastAPI 서버가 정상적으로 실행 중입니다!"}

@app.get("/items")
def get_items():
    # DB에서 모든 아이템 조회
    return []

# POST: 새 데이터 생성
@app.post("/items")
def create_item(item: Item):
    # DB에 새 아이템 저장
    return {"status": "created", "item": item}

# PUT: 데이터 수정
@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    # DB에서 ID에 해당하는 아이템 수정
    return {"status": "updated", "item_id": item_id, "item": item}

# DELETE: 데이터 삭제
@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    # DB에서 ID에 해당하는 아이템 삭제
    return {"status": "deleted", "item_id": item_id}
```

### Step 3: 서버 실행

`backend` 폴더에서 다음 명령어를 실행합니다:

```bash
uvicorn main:app --reload
```

**명령어 설명:**
- `main`: 파일명 (`main.py`)
- `app`: FastAPI 인스턴스 이름
- `--reload`: 코드 저장 시 자동으로 서버 재시작

터미널에 다음과 같은 메시지가 나타나면 성공입니다:

```
Uvicorn running on http://127.0.0.1:8000
```

---

## 풀스택 연동 테스트

### ✅ 테스트 체크리스트

**1단계: 백엔드 확인**
- 브라우저에서 `http://localhost:8000/` 접속
- 다음 메시지가 표시되면 정상:
  ```json
  {"message": "FastAPI 서버가 정상적으로 실행 중입니다!"}
  ```

**2단계: 프론트엔드 확인**
- 브라우저에서 `http://localhost:3000/` 접속 (새로고침)
- 리액트 앱이 정상으로 로드되는지 확인

**3단계: 데이터 연동 확인**
- 리액트 화면에서 새 메모 **등록** 시도
- 등록된 메모 **조회** 확인
- 메모 **수정** 기능 테스트
- 메모 **삭제** 기능 테스트

### 🎉 완성!

모든 기능이 정상적으로 작동하면 **현대식 풀스택 애플리케이션 아키텍처**를 완성하신 것입니다!

---

## 트러블슈팅

| 문제 | 해결책 |
|------|-------|
| 포트 8000이 이미 사용 중 | `uvicorn main:app --reload --port 8001` |
| CORS 에러 | 백엔드 CORS 설정 확인 |
| 파이썬 모듈 못 찾음 | `pip install` 다시 실행, 가상환경 활성화 확인 |
| 리액트가 백엔드에 연결 못함 | `localhost:8000` 접속 가능한지 먼저 확인 |

---

**Happy Coding! 🚀**
