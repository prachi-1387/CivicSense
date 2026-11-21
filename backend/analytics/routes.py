
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from .database import get_db
from . import queries

router = APIRouter(
    prefix="/api/analytics",
    tags=["Analytics"]
)


def execute_query(db: Session, query: str):
    result = db.execute(text(query))
    return result.mappings().all()


@router.get("/overview")
def get_overview(db: Session = Depends(get_db)):
    try:
        result = execute_query(db, queries.OVERVIEW_QUERY)
        return dict(result[0])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    try:
        return [
            dict(row)
            for row in execute_query(db, queries.CATEGORY_QUERY)
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/priorities")
def get_priorities(db: Session = Depends(get_db)):
    try:
        return [
            dict(row)
            for row in execute_query(db, queries.PRIORITY_QUERY)
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/trends")
def get_trends(db: Session = Depends(get_db)):
    try:
        rows = execute_query(db, queries.TRENDS_QUERY)

        return [
            {
                "month": row["month"].strftime("%Y-%m"),
                "total_complaints": row["total_complaints"]
            }
            for row in rows
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/resolution-time")
def get_resolution_time(db: Session = Depends(get_db)):
    try:
        result = execute_query(
            db,
            queries.RESOLUTION_TIME_QUERY
        )
        return dict(result[0])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
