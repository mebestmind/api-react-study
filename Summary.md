Client-Server API 아키텍처

파이썬을 '서버(API)'로 띄워서 리액트와 직접 통신하는 진정한 풀스택 구조

REST API 통신 : 리액트(프론트엔드) - 파이썬(API 서버) - 데이터베이스

# 새 프로젝트(API 버전) 초기 세팅 가이드

프로젝트 폴더 : api-react-study

## 1. 최상위 프로젝트 폴더 만들기 및 이동
```
mkdir api-react-study
cd api-react-study
```
## 2. 리액트(프론트엔드) 프로젝트 생성
```
npx create-react-app frontend --template typescript
```
## 3. 파이썬(백엔드) 폴더 및 가상환경 세팅
리액트 설치가 끝나면, 같은 최상위 위치에서 파이썬 서버용 폴더를 만들고 세팅합니다.

```
# 백엔드 폴더 생성 및 이동
mkdir backend
cd backend

# 가상환경 생성 및 켜기 (윈도우 기준)
python -m venv venv
.\venv\Scripts\activate
```

## 4. FastAPI 및 필요 패키지 설치
가상환경이 켜진 (venv) 상태에서, 웹 서버를 만들어줄 FastAPI와 통신 도구들을 한 번에 설치합니다.

```
pip install fastapi "uvicorn[standard]" supabase python-dotenv
```
fastapi: API 서버를 만드는 메인 도구입니다.
uvicorn: 작성한 FastAPI 코드를 실제로 컴퓨터에서 실행시켜 주는 서버 엔진입니다.

여기까지 완료하신 후 VSCode로 api-react-study 폴더를 열어보시면 아래와 같은 깔끔한 구조가 되어 있을 것입니다.

```
api-react-study/ (최상위 폴더)
 ├── frontend/      # 리액트 화면 코드
 └── backend/       # 파이썬 FastAPI 서버 코드 (가상환경 포함)
```


# 프론트엔드 (React) 코드 작성

## frontend/src/App.tsx 파일 변경
핵심 변경 사항 요약 (REST API 표준)
리액트에서 파이썬 서버로 데이터를 요청할 때, 목적에 따라 서로 다른 HTTP 메서드(Method)를 사용하도록 작성되었습니다. 이것이 업계 표준 통신 방식입니다.

조회 (Read): GET 요청 (기본값이므로 생략됨)

생성 (Create): POST 요청 (새 데이터를 담아서 보냄)

수정 (Update): PUT 요청 (수정할 고유 id와 변경된 데이터를 함께 보냄)

삭제 (Delete): DELETE 요청 (지울 고유 id만 보냄)

## 실행 및 확인

cd frontend
npm start


# 백엔드(FastAPI) 서버 구축

1단계: 환경 변수(.env) 파일 만들기
backend 폴더 최상위 위치에 .env 파일을 만들고 기존과 동일한 정보를 넣어주세요

2단계: FastAPI 메인 코드 작성
backend 폴더 안에 main.py 라는 파일을 생성하고, 아래의 코드를 작성해 줍니다.
(리액트에서 구현한 GET, POST, PUT, DELETE 요청을 파이썬이 받아서 처리하는 완벽한 CRUD 세트입니다.)

3단계: 파이썬 서버 실행하기
이제 터미널을 열고 서버를 켜볼 차례입니다.
(주의: 파이썬 가상환경 (venv)이 켜져 있는 상태여야 하며, 현재 위치가 backend 폴더 안이어야 합니다.)
터미널에 아래 명령어를 입력합니다.

```
uvicorn main:app --reload
* `main`: 우리가 방금 만든 파일 이름(`main.py`)
* `app`: 코드 안에서 `FastAPI()`로 만든 객체 이름
* `--reload`: 코드를 수정하고 저장할 때마다 서버를 자동으로 재시작해주는 아주 편리한 옵션입니다.
```


### 🎉 드디어 풀스택 연동 테스트!

1. 브라우저 주소창에 `http://localhost:8000/` 을 입력해 보세요. `{"message": "FastAPI 서버가 정상적으로 실행 중입니다!"}` 라는 문구가 뜨면 백엔드가 성공적으로 켜진 것입니다.
2. 이제 리액트 화면(`http://localhost:3000`)이 켜져 있는 브라우저로 이동해 새로고침을 해보세요. 
3. **리액트가 파이썬에게 데이터를 요청해서, DB에 있던 메모들이 예쁘게 나타나나요?** 새로운 메모를 등록하거나 수정/삭제를 해보세요!

모든 기능이 매끄럽게 작동한다면 완전한 **현대식 풀스택 애플리케이션 아키텍처**를 여러분의 손으로 직접 완성하신 겁니다! 결과가 어떠신지 너무 궁금하네요!