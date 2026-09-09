"""Test Vehicle endpoints."""

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_get_vehicles_empty():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/vehicles")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
