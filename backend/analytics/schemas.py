
from pydantic import BaseModel
from typing import List


class AnalyticsOverview(BaseModel):
    total_complaints: int
    resolved_complaints: int
    pending_complaints: int
    resolution_rate: float


class CategoryAnalytics(BaseModel):
    category: str
    total_complaints: int


class PriorityAnalytics(BaseModel):
    priority_level: str
    total_complaints: int


class MonthlyAnalytics(BaseModel):
    month: str
    total_complaints: int


class ResolutionAnalytics(BaseModel):
    resolved_complaints: int
    average_resolution_hours: float
