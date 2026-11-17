
from fastapi import FastAPI
from analytics.routes import router as analytics_router

app = FastAPI(
    title="CivicSense Analytics API",
    description="Backend APIs for CivicSense complaint analytics",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "CivicSense Analytics Backend is running!"
    }


@app.get("/api/analytics/health")
def health_check():
    return {
        "status": "healthy",
        "service": "analytics"
    }


app.include_router(analytics_router)
