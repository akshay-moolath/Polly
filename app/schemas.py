from pydantic import BaseModel

#user create schema 
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    
#user info schema
class UserOut(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True

class LoginSchema(BaseModel):
    username: str
    password: str
