"""
Test Mock API endpoint
Test 2: Mock API endpoint'in beklenen JSON'u döndürmesi
"""

import json


def test_mock_api_returns_json(client):
    """Mock API'nin JSON döndürdüğünü test et"""
    response = client.get("/api/mock/flights?origin=IST&destination=AYT&departure_date=2025-12-31")

    assert response.status_code == 200
    assert response.content_type == "application/json"

    data = json.loads(response.data)
    assert "flights" in data
    assert isinstance(data["flights"], list)


def test_mock_api_flight_structure(client):
    """Mock API'nin doğru uçuş yapısını döndürdüğünü test et"""
    response = client.get("/api/mock/flights?origin=IST&destination=AYT&departure_date=2025-12-31")

    data = json.loads(response.data)
    flights = data["flights"]

    # En az bir uçuş dönmeli
    assert len(flights) > 0

    # İlk uçuşun yapısını kontrol et
    flight = flights[0]

    required_fields = [
        "id",
        "airline",
        "flightNumber",
        "price",
        "currency",
        "departure",
        "arrival",
        "origin",
        "destination",
        "stops",
        "duration_minutes",
        "aircraft",
        "policy",
    ]

    for field in required_fields:
        assert field in flight, f"Field '{field}' missing in flight data"


def test_mock_api_missing_parameters(client):
    """Eksik parametrelerle API çağrısı"""
    # Origin eksik
    response = client.get("/api/mock/flights?destination=AYT&departure_date=2025-12-31")
    assert response.status_code == 400

    data = json.loads(response.data)
    assert "error" in data


def test_mock_api_price_format(client):
    """Fiyat formatının doğru olduğunu test et"""
    response = client.get("/api/mock/flights?origin=IST&destination=AYT&departure_date=2025-12-31")

    data = json.loads(response.data)
    flight = data["flights"][0]

    # Fiyat float/int olmalı ve pozitif olmalı
    assert isinstance(flight["price"], (int, float))
    assert flight["price"] > 0

    # Para birimi TRY olmalı
    assert flight["currency"] == "TRY"


def test_mock_api_datetime_format(client):
    """Tarih/saat formatının doğru olduğunu test et"""
    response = client.get("/api/mock/flights?origin=IST&destination=AYT&departure_date=2025-12-31")

    data = json.loads(response.data)
    flight = data["flights"][0]

    # ISO 8601 format kontrolü
    assert "T" in flight["departure"]
    assert "T" in flight["arrival"]
    assert "+" in flight["departure"] or "Z" in flight["departure"]


def test_flight_detail_api(client):
    """Tek uçuş detay API'sini test et"""
    # Önce uçuş listesini al
    response = client.get("/api/mock/flights?origin=IST&destination=AYT&departure_date=2025-12-31")

    data = json.loads(response.data)
    flight_id = data["flights"][0]["id"]

    # Detay API'sini çağır
    detail_response = client.get(f"/api/flight/{flight_id}")

    assert detail_response.status_code == 200

    detail_data = json.loads(detail_response.data)
    assert detail_data["id"] == flight_id
    assert "airline" in detail_data
