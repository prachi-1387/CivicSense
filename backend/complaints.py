
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Complaint, User, ComplaintStatusHistory
from schemas import ComplaintCreate, ComplaintStatusUpdate
from auth import get_current_user

from ai.text_classifier import predict_category
from ai.fuzzy_urgency import calculate_urgency, explain_urgency


router = APIRouter(prefix="/complaints", tags=["Complaints"])


# 1. Submit a complaint
@router.post("/")
def submit_complaint(
    complaint: ComplaintCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Step 1: Predict complaint category using NLP
    predicted_category = predict_category(complaint.description)

    # Step 2: Calculate urgency score using fuzzy logic
    urgency_score = calculate_urgency(
        complaint.severity,
        complaint.public_impact,
        complaint.safety_risk,
        complaint.duration
    )

    # Step 3: Generate explanation for the urgency score
    urgency_explanation = explain_urgency(
        complaint.severity,
        complaint.public_impact,
        complaint.safety_risk,
        complaint.duration
    )

    # Step 4: Determine priority level
    if urgency_score >= 70:
        priority_level = "High"
    elif urgency_score >= 40:
        priority_level = "Medium"
    else:
        priority_level = "Low"

    # Step 5: Create complaint with AI results
    new_complaint = Complaint(
        user_id=current_user.id,
        title=complaint.title,
        description=complaint.description,
        location=complaint.location,
        severity=complaint.severity,
        public_impact=complaint.public_impact,
        safety_risk=complaint.safety_risk,
        duration=complaint.duration,
        category=predicted_category,
        priority_score=urgency_score,
        priority_level=priority_level,
        status="submitted"
    )

    # Step 6: Save complaint in PostgreSQL
    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)

    # Step 7: Return response
    return {
        "message": "Complaint submitted successfully",
        "complaint_id": new_complaint.id,
        "title": new_complaint.title,
        "category": new_complaint.category,
        "urgency_score": new_complaint.priority_score,
        "priority_level": priority_level,
        "urgency_explanation": urgency_explanation,
        "status": new_complaint.status
    }



def format_complaint(complaint):
    # Generate explanation if all four input values are available
    if all(value is not None for value in [
        complaint.severity,
        complaint.public_impact,
        complaint.safety_risk,
        complaint.duration
    ]):
        explanation = explain_urgency(
            complaint.severity,
            complaint.public_impact,
            complaint.safety_risk,
            complaint.duration
        )
    else:
        explanation = {
            "input_explanations": [],
            "overall_summary": "Urgency explanation unavailable for this complaint."
        }

    return {
        "complaint_id": complaint.id,
        "user_id": complaint.user_id,
        "title": complaint.title,
        "description": complaint.description,
        "location": complaint.location,
        "category": complaint.category,
        "assigned_department": complaint.assigned_department,
        "severity": complaint.severity,
        "public_impact": complaint.public_impact,
        "safety_risk": complaint.safety_risk,
        "duration": complaint.duration,
        "urgency_score": complaint.priority_score,
        "priority_level": complaint.priority_level,
        "urgency_explanation": explanation,
        "status": complaint.status,
        "created_at": complaint.created_at
    }


# 2. Get complaints submitted by the logged-in citizen
@router.get("/mine")
def get_my_complaints(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    complaints = db.query(Complaint).filter(
        Complaint.user_id == current_user.id
    ).order_by(
        Complaint.created_at.desc()
    ).all()

    return [
        format_complaint(complaint)
        for complaint in complaints
    ]
# 3. Get all complaints (Admin only)

@router.get("/")
def get_all_complaints(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only admins can view all complaints"
        )

    complaints = db.query(Complaint).order_by(
        Complaint.created_at.desc()
    ).all()

    return [
        format_complaint(complaint)
        for complaint in complaints
    ]

# 4. Update complaint status (Admin only)

@router.patch("/{complaint_id}/status")
def update_complaint_status(
    complaint_id: int,
    status_data: ComplaintStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only admins can update complaint status"
        )

    complaint = db.query(Complaint).filter(
        Complaint.id == complaint_id
    ).first()

    if complaint is None:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    old_status = complaint.status

    complaint.status = status_data.status

    # Assign department when provided
    if status_data.assigned_department is not None:
        complaint.assigned_department = status_data.assigned_department

    # Record the status change in history
    history = ComplaintStatusHistory(
        complaint_id=complaint.id,
        updated_by=current_user.id,
        old_status=old_status,
        new_status=status_data.status,
        note=status_data.note
    )

    db.add(history)
    db.commit()
    db.refresh(complaint)

    return {
        "message": "Complaint updated successfully",
        "complaint_id": complaint.id,
        "old_status": old_status,
        "new_status": complaint.status,
        "assigned_department": complaint.assigned_department
    }


@router.get("/{complaint_id}/history")
def get_complaint_history(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only admins can view complaint history"
        )

    complaint = db.query(Complaint).filter(
        Complaint.id == complaint_id
    ).first()

    if complaint is None:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    history = db.query(ComplaintStatusHistory).filter(
        ComplaintStatusHistory.complaint_id == complaint_id
    ).order_by(
        ComplaintStatusHistory.created_at.asc()
    ).all()

    return [
        {
            "old_status": item.old_status,
            "new_status": item.new_status,
            "note": item.note,
            "updated_by": item.updated_by,
            "created_at": item.created_at
        }
        for item in history
    ]

