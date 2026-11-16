from fastapi import FastAPI, HTTPException
from sqlalchemy import text
from database import engine
from auth import router as auth_router
from complaints import router as complaints_router

app = FastAPI(
    title="CivicSense API",
    description="AI-powered Civic Complaint Management System",
    version="1.0.0"
)
app.include_router(auth_router)
app.include_router(complaints_router)

@app.get("/")
def home():
    return {
        "message": "Welcome to CivicSense API",
        "status": "Backend is running successfully"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }
@app.get("/db-check")
def database_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "success",
            "message": "CivicSense database connected successfully!"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database connection failed: {str(e)}"
        )