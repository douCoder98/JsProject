import datetime
from database import Base
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from flask_login import UserMixin


class User(Base ,UserMixin):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    email = Column(String(255), unique=True)
    password = Column(String(255))
    created_at = Column(DateTime, default=datetime.datetime.now())
    updated_at = Column(DateTime, onupdate=datetime.datetime.now(), default=datetime.datetime.now())

    def __init__(self, name: str = None, email: str = None, password: str = None):
        self.name = name
        self.email = email
        self.password = password

    def get_id(self):
        return str(self.id)
    def is_authenticated(self):
        return self.is_authenticated  

    def is_active(self):
        return self.is_active  

    def is_anonymous(self):
        return False  