# 서버 배포 & GitHub 업로드 가이드

이 문서는 React와 Python 프로젝트 생성 방법과 GitHub에 소스 업로드(커밋·푸시)하는 기본 절차를 정리합니다.

---

## 1. 프로젝트 생성

### React (TypeScript 템플릿)
프론트엔드 디렉토리 `frontend`를 자동 생성합니다.

```bash
npx create-react-app frontend --template typescript
cd frontend
npm start   # 개발 서버 시작
# 서버 중지: Ctrl + C
```

### Python
로컬에 Python 가상환경을 만들어 사용합니다.

```bash
mkdir python_study   # 디렉토리 생성 (필수)
cd python_study
python -m venv venv
# 가상환경 활성화
# Windows: venv\Scripts\activate
# macOS / Linux: source venv/bin/activate
```

---

## 2. GitHub 소스 업로드 방법

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

### 충돌이나 최신 변경사항이 있어 푸시가 안 될 때
먼저 원격 변경사항을 내려받아 병합한 뒤 다시 푸시합니다.

```bash
# 1) 원격 변경사항을 내려받아 자동 병합 (--no-edit: 병합 메시지 편집 생략)
git pull origin main --no-edit

# 2) 병합한 내용을 다시 푸시
git push origin main
```

---

## 3. 저장소 로컬로 복제하기 (클론)

로컬에서 작업할 디렉토리 위치로 이동한 뒤 실행합니다.

```bash
# 잘못 생성된 디렉토리 삭제 (주의: 폴더 전체 삭제)
rm -rf python-react-study

# 저장소 복제
git clone https://github.com/본인의유저네임/리포지토리이름.git
cd 리포지토리이름
```

---

## 4. GitHub 커밋 메시지 규칙 (권장)

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

---

필요하면 이 파일을 README로 옮기거나 팀 규칙에 맞게 커스터마이즈해 드리겠습니다.
