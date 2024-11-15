import datetime
from database import Base
from sqlalchemy import Column, Integer, String, DateTime, Boolean

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    email = Column(String(255), unique=True)
    password = Column(String(255))
    is_authenticated = Column(Boolean, default=False)
    is_active = Column(Boolean, default=False)
    is_anonymous = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.now())
    updated_at = Column(DateTime, onupdate=datetime.datetime.now(), default=datetime.datetime.now())

    def __init__(self, name: str = None, email: str = None, password: str = None):
        self.name = name
        self.email = email
        self.password = password

    def get_id(self):
        return str(self.id)
