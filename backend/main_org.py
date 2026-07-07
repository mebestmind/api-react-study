import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client

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

# 4. API 라우터 (엔드포인트) 설정

# [Read] 모든 메모 불러오기
@app.get("/memos")
def get_memos():
    try:
        response = supabase.table('memos').select('*').order('created_at').execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# [Create] 새 메모 추가하기
@app.post("/memos")
def create_memo(memo: MemoBase):
    try:
        # 백엔드의 역할: 리액트가 보낸 텍스트를 받아서 '글자 수'를 직접 계산합니다.
        text_length = len(memo.content)
        
        new_data = {
            "content": memo.content,
            "text_length": text_length
        }
        response = supabase.table('memos').insert(new_data).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# [Update] 메모 수정하기
@app.put("/memos/{memo_id}")
def update_memo(memo_id: int, memo: MemoBase):
    try:
        text_length = len(memo.content)
        
        update_data = {
            "content": memo.content,
            "text_length": text_length
        }
        response = supabase.table('memos').update(update_data).eq('id', memo_id).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# [Delete] 메모 삭제하기
@app.delete("/memos/{memo_id}")
def delete_memo(memo_id: int):
    try:
        response = supabase.table('memos').delete().eq('id', memo_id).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 서버 기본 작동 확인용 엔드포인트
@app.get("/")
def read_root():
    return {"message": "FastAPI 서버가 정상적으로 실행 중입니다!"}