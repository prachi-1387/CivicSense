
import sys
from pathlib import Path

# Add the backend folder to Python's import path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import analytics.routes as analytics_routes
from datetime import datetime
from fastapi.testclient import TestClient
from main import app
from analytics.database import get_db
client = TestClient(app)


def test_health_check():
    response = client.get("/api/analytics/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy",
        "service": "analytics"
    }
def test_analytics_routes_exist():
    response = client.get("/openapi.json")

    assert response.status_code == 200

    paths = response.json()["paths"]

    expected_routes = [
        "/api/analytics/overview",
        "/api/analytics/categories",
        "/api/analytics/priorities",
        "/api/analytics/trends",
        "/api/analytics/resolution-time"
    ]

    for route in expected_routes:
        assert route in paths
    from analytics.database import get_db


class FakeResult:
    def mappings(self):
        return self

    def all(self):
        return [{
            "total_complaints": 100,
            "resolved_complaints": 60,
            "pending_complaints": 40,
            "resolution_rate": 60.0
        }]


class FakeDatabase:
    def execute(self, query):
        return FakeResult()


def override_get_db():
    yield FakeDatabase()


def test_analytics_overview():
    app.dependency_overrides[get_db] = override_get_db

    try:
        response = client.get("/api/analytics/overview")

        assert response.status_code == 200
        assert response.json() == {
            "total_complaints": 100,
            "resolved_complaints": 60,
            "pending_complaints": 40,
            "resolution_rate": 60.0
        }
    finally:
        app.dependency_overrides.clear()
def test_analytics_categories(monkeypatch):
    app.dependency_overrides[get_db] = override_get_db

    monkeypatch.setattr(
        analytics_routes,
        "execute_query",
        lambda db, query: [
            {"category": "Garbage", "total_complaints": 12}
        ]
    )

    try:
        response = client.get("/api/analytics/categories")

        assert response.status_code == 200
        assert response.json() == [
            {"category": "Garbage", "total_complaints": 12}
        ]
    finally:
        app.dependency_overrides.clear()


def test_analytics_priorities(monkeypatch):
    app.dependency_overrides[get_db] = override_get_db

    monkeypatch.setattr(
        analytics_routes,
        "execute_query",
        lambda db, query: [
            {"priority_level": "High", "total_complaints": 8}
        ]
    )

    try:
        response = client.get("/api/analytics/priorities")

        assert response.status_code == 200
        assert response.json() == [
            {"priority_level": "High", "total_complaints": 8}
        ]
    finally:
        app.dependency_overrides.clear()


def test_analytics_trends(monkeypatch):
    app.dependency_overrides[get_db] = override_get_db

    monkeypatch.setattr(
        analytics_routes,
        "execute_query",
        lambda db, query: [
            {
                "month": datetime(2026, 11, 1),
                "total_complaints": 20
            }
        ]
    )

    try:
        response = client.get("/api/analytics/trends")

        assert response.status_code == 200
        assert response.json() == [
            {"month": "2026-11", "total_complaints": 20}
        ]
    finally:
        app.dependency_overrides.clear()


def test_analytics_resolution_time(monkeypatch):
    app.dependency_overrides[get_db] = override_get_db

    monkeypatch.setattr(
        analytics_routes,
        "execute_query",
        lambda db, query: [
            {
                "resolved_complaints": 15,
                "average_resolution_hours": 24.5
            }
        ]
    )

    try:
        response = client.get("/api/analytics/resolution-time")

        assert response.status_code == 200
        assert response.json() == {
            "resolved_complaints": 15,
            "average_resolution_hours": 24.5
        }
    finally:
        app.dependency_overrides.clear()