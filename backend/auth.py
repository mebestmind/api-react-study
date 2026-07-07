import os
from datetime import datetime, timedelta

import bcrypt
from dotenv import load_dotenv
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

load_dotenv()

# ==========================================================
#  설정값
# ==========================================================
SECRET_KEY = os.environ.get("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# ==========================================================
#  비밀번호 관련 (bcrypt 직접 사용)
# ==========================================================

# 비밀번호를 암호화(해싱)해서 저장할 형태로 변환
def hash_password(password: str) -> str:
    # 한글은 글자당 3바이트 → 72바이트 제한에 맞춰 자름
    pw_bytes = password.encode('utf-8')[:72]
    hashed = bcrypt.hashpw(pw_bytes, bcrypt.gensalt())
    return hashed.decode('utf-8')

# 입력한 비밀번호가 저장된 해시와 일치하는지 확인
def verify_password(plain_password: str, hashed_password: str) -> bool:
    pw_bytes = plain_password.encode('utf-8')[:72]
    return bcrypt.checkpw(pw_bytes, hashed_password.encode('utf-8'))

# ==========================================================
#  토큰(JWT) 관련  ← 이 부분은 그대로
# ==========================================================

def create_access_token(user_id: int) -> str:
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(user_id), "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)) -> int:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="인증에 실패했습니다.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_error
        return int(user_id)
    except JWTError:
        raise credentials_error