from sqlalchemy import (
    Column, Integer, String, Text,
    Float, DateTime, ForeignKey
)

from datetime import datetime

from database import Base


# 1. Users Table
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="citizen")
    created_at = Column(DateTime, default=datetime.utcnow)


# 2. Complaints Table
class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(80))
    location = Column(String(255))
    assigned_department = Column(String(100), nullable=True)

    severity = Column(Float, nullable=True)
    public_impact = Column(Float, nullable=True)
    safety_risk = Column(Float, nullable=True)
    duration = Column(Float, nullable=True)


    priority_score = Column(Float, default=0.0)
    priority_level = Column(String(30))
    status = Column(String(30), default="submitted")

    created_at = Column(DateTime, default=datetime.utcnow)


# 3. Complaint Status History Table
class ComplaintStatusHistory(Base):
    __tablename__ = "complaint_status_history"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(
        Integer, ForeignKey("complaints.id"), nullable=False
    )
    updated_by = Column(Integer, ForeignKey("users.id"))

    old_status = Column(String(30))
    new_status = Column(String(30), nullable=False)
    note = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)