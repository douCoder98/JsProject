import datetime
from database import Base
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
#from User import User

class Account(Base):
    __tablename__ = 'accounts'
    id = Column(Integer, primary_key=True)
    label = Column(String(255))
    amount = Column(Float)
    type = Column(String(255))
    threshold = Column(Float)
    user_id = Column(Integer, ForeignKey('users.id',ondelete='CASCADE'))
    created_at = Column(DateTime, default=datetime.datetime.now())
    updated_at = Column(DateTime, onupdate=datetime.datetime.now(), default=datetime.datetime.now())
    user = relationship("User", backref="accounts")