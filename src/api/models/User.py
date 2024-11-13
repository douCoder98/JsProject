import datetime
from database import Base
from sqlalchemy import Column, Integer, String, DateTime

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    email = Column(String(255), unique=True)
    password = Column(String(255))
    created_at = Column(DateTime, default=datetime.datetime.now())
    updated_at = Column(DateTime, onupdate=datetime.datetime.now(), default=datetime.datetime.now())

    def __init__(self, name=None, email=None, password=None):
        self.name = name
        self.email = email
        self.password = password

    