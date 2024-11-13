import datetime
from database import Base
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
#import Account

class Transaction(Base):
    __tablename__ = 'transactions'
    id = Column(Integer, primary_key=True)
    reference = Column(String(255), unique=True)
    type = Column(String(255))
    amount = Column(Float)
    balance = Column(Float)
    account_id = Column(Integer, ForeignKey('accounts.id',ondelete='CASCADE'))
    created_at = Column(DateTime, default=datetime.datetime.now())
    updated_at = Column(DateTime, onupdate=datetime.datetime.now(), default=datetime.datetime.now())
    account = relationship("Account", backref="transactions")

    
