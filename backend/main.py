import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm


import auth  # 비밀번호 해싱 / JWT 발급·검증 담당 (auth.py)

# ... 기존 supabase, app, CORS 설정은 그대로 ...


# 1. 환경 변수 로드 (.env 파일)
load_dotenv()
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

# Supabase 클라이언트 생성
supabase: Client = create_client(url, key)

# FastAPI 앱 생성
app = FastAPI()

# 2. CORS 설정 (아주 중요!)
# 리액트(3000번 포트)가 파이썬(8000번 포트)에 데이터를 요청할 수 있도록 허락해주는 설정입니다.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 리액트 앱의 주소
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE 모두 허용
    allow_headers=["*"],
)

# 3. 데이터 모델 정의
# 리액트에서 전송해오는 JSON 데이터의 구조를 파이썬에게 알려줍니다.
class MemoBase(BaseModel):
    content: str
    
# 회원가입 때 받을 데이터    
class UserCreate(BaseModel):
    email: str
    password: str
    nickname: str | None = None
    
    
# ==========================================================
#  인증 (회원가입 / 로그인)
# ==========================================================

# [Signup] 회원가입
@app.post("/signup")
def signup(user: UserCreate):
    try:
        # 이미 가입된 이메일인지 확인
        exists = supabase.table('users').select('id').eq('email', user.email).execute()
        if exists.data:
            raise HTTPException(status_code=400, detail="이미 가입된 이메일입니다.")

        new_user = {
            "email": user.email,
            "hashed_password": auth.hash_password(user.password),  # 암호화해서 저장
            "nickname": user.nickname,
        }
        response = supabase.table('users').insert(new_user).execute()
        return {"message": "회원가입 성공", "user_id": response.data[0]['id']}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# [Login] 로그인 → 출입증(JWT) 발급
@app.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends()):
    try:
        # form.username = 이메일, form.password = 비밀번호
        result = supabase.table('users').select('*').eq('email', form.username).execute()
        if not result.data:
            raise HTTPException(status_code=401, detail="이메일 또는 비밀번호가 틀렸습니다.")

        user = result.data[0]
        if not auth.verify_password(form.password, user['hashed_password']):
            raise HTTPException(status_code=401, detail="이메일 또는 비밀번호가 틀렸습니다.")

        token = auth.create_access_token(user['id'])
        return {"access_token": token, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    
        

# 4. API 라우터 (엔드포인트) 설정


# ==========================================================
#  메모 CRUD (로그인 필요 + 본인 메모만)
# ==========================================================

# [Read] 내 메모만 불러오기
# [Read] 내 메모만 불러오기
@app.get("/memos")
def get_memos(current_user: int = Depends(auth.get_current_user)):
    try:
        response = (
            supabase.table('memos')
            .select('*')
            .eq('user_id', current_user)      # 내 메모만 필터링
            .order('created_at')
            .execute()
        )
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# [Create] 새 메모 추가 (주인 이름표 붙여서 저장)
@app.post("/memos")
def create_memo(memo: MemoBase, current_user: int = Depends(auth.get_current_user)):
    try:
        new_data = {
            "content": memo.content,
            "text_length": len(memo.content),
            "user_id": current_user,          # 누가 썼는지 기록
        }
        response = supabase.table('memos').insert(new_data).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# [Update] 메모 수정 (본인 메모만)
@app.put("/memos/{memo_id}")
def update_memo(memo_id: int, memo: MemoBase, current_user: int = Depends(auth.get_current_user)):
    try:
        update_data = {
            "content": memo.content,
            "text_length": len(memo.content),
        }
        response = (
            supabase.table('memos')
            .update(update_data)
            .eq('id', memo_id)
            .eq('user_id', current_user)      # 남의 메모는 수정 불가
            .execute()
        )
        if not response.data:
            raise HTTPException(status_code=404, detail="메모를 찾을 수 없거나 권한이 없습니다.")
        return response.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# [Delete] 메모 삭제 (본인 메모만)
@app.delete("/memos/{memo_id}")
def delete_memo(memo_id: int, current_user: int = Depends(auth.get_current_user)):
    try:
        response = (
            supabase.table('memos')
            .delete()
            .eq('id', memo_id)
            .eq('user_id', current_user)      # 남의 메모는 삭제 불가
            .execute()
        )
        if not response.data:
            raise HTTPException(status_code=404, detail="메모를 찾을 수 없거나 권한이 없습니다.")
        return response.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 서버 기본 작동 확인용 엔드포인트
@app.get("/")
def read_root():
    return {"message": "FastAPI 서버가 정상적으로 실행 중입니다!"}