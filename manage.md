# 서버 Deploy & Githun upload 


React 프로젝트 생성 (frontend 디렉토리 자동생성됨.)
'''
npx create-react-app frontend --template typescript
cd frontend
npm start  # server start
# Ctrl + C   (server down)
'''

파이썬 프로젝트 생성
'''
mkdir python_study  # 디렉토리 생성 필수
cd python_study
python -m venv venv
'''

# Github 소스 업로드 방법

1. 변경된 모든 폴더와 파일을 '준비 영역'에 올립니다. (.은 모든 파일을 뜻함)
git add .
git config --global core.autocrlf true  # 윈도우 환경에서 Git 줄바꿈 문자 변환 설정
git config --global user.email "내이메일@주소.com"  # 내 이메일 설정
git config --global user.name "내이름"  # 내 이름 설정
2. 이번 변경사항이 무엇인지 기록(Commit)을 남깁니다.
git commit -m "feat: 프로젝트 기본 디렉토리 구조 및 환경 세팅 완료"
3. 내 컴퓨터의 기록을 깃허브(원격 저장소)로 전송(Push)합니다.
git push origin main
4. 혹시 Git의 파일이 더 최신버전이라서 오류 메세지가 나온다면
# 1. 깃허브의 변경사항을 내 컴퓨터로 다운로드하여 합치기
# (--no-edit 은 자동으로 병합 메시지를 작성해 귀찮은 편집기 창이 뜨는 것을 막아줍니다)
git pull origin main --no-edit
# 2. 방금 합쳐진 최신 상태를 다시 깃허브로 쏘아 올리기
git push origin main

5. 깃허브 레파지토리 저장소 로컬로 복제
로컬의 디렉토리 생성위치에서 실행
rm -rf python-react-study  # 잘못 생성된 디렉토리 통째로 강제 삭제 (윈도우/맥 공통)
git clone https://github.com/본인의유저네임/리포지토리이름.git
cd 리포지토리이름


#깃허브(GitHub) 커밋 메세지 규칙

코드를 저장(Commit)할 때는 나중에 내가 다시 봐도 알아보기 쉽게 '머릿말'을 달아서 기록합니다.
feat: 새로운 기능 추가 (예: feat: React 로그인 화면 UI 구현)
fix: 버그 수정 (예: fix: Supabase 데이터 불러오기 에러 수정)
docs: 문서 작업 (예: docs: 개발 환경 문서 업데이트)
study: 학습 및 예제 코드 (예: study: 파이썬 기초 문법 예제 작성)
