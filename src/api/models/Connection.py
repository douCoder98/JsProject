
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from database import Base
from datetime import datetime
class Connection(Base):
    __tablename__ = 'connections'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    ip_address = Column(String(50))
    connection_date = Column(DateTime, default=datetime.now())
    status = Column(String(20))  
    suspected = Column(Boolean, default=False)