from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .db import get_db
from .crud import get_user, create_user
from .utils import verify_password, create_token
from .schema_user import UserCreate  # 引入你的 Pydantic schema

router = APIRouter()


@router.post("/login")
def login(credentials: UserCreate, db: Session = Depends(get_db)):
    user = get_user(db, credentials.username)
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": create_token(user.username)}


@router.post("/register")
def register(credentials: UserCreate, db: Session = Depends(get_db)):
    existing_user = get_user(db, credentials.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    return create_user(db, credentials)
