from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    username: str
    hashed_password: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserInDB(UserBase):
    id: int

    model_config = {
        "from_attributes": True
    }
