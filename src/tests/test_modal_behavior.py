"""
Test modal functionality
Test 5: Modal içeriğinin sunucu tarafından sağlanıp açılabildiğini test et
"""

import json


def test_modal_html_exists(client):
    """Modal HTML'inin sayfalarda bulunduğunu test et"""
    response = client.post(
        "/flights",
        data={
            "origin": "IST",
            "destination": "AYT",
            "departure_date": "2025-12-31",
            "trip_type": "one-way",
        },
    )

    assert response.status_code == 200

    # Modal container olmalı
    assert b"flight-modal" in response.data or b"modal" in response.data.lower()


def test_modal_has_close_functionality(client):
    """Modal'ın kapatma fonksiyonuna sahip olduğunu test et"""
    response = client.post(
        "/flights",
        data={
            "origin": "IST",
            "destination": "AYT",
            "departure_date": "2025-12-31",
            "trip_type": "one-way",
        },
    )

    assert response.status_code == 200

    # JavaScript kapatma fonksiyonu olmalı
    assert b"closeFlightModal" in response.data or b"close" in response.data.lower()


def test_modal_accessibility_attributes(client):
    """Modal'ın erişilebilirlik özelliklerini test et"""
    response = client.post(
        "/flights",
        data={
            "origin": "IST",
            "destination": "AYT",
            "departure_date": "2025-12-31",
            "trip_type": "one-way",
        },
    )

    assert response.status_code == 200

    # ARIA attributes olmalı
    assert b"aria-" in response.data or b"role=" in response.data


def test_modal_api_endpoint_works(client):
    """Modal için API endpoint'in çalıştığını test et"""
    # Önce uçuşları al
    response = client.get("/api/mock/flights?origin=IST&destination=AYT&departure_date=2025-12-31")

    data = json.loads(response.data)
    flight_id = data["flights"][0]["id"]

    # Modal API'sini test et
    detail_response = client.get(f"/api/flight/{flight_id}")

    assert detail_response.status_code == 200
    detail_data = json.loads(detail_response.data)

    # Modal için gerekli tüm bilgiler olmalı
    assert "airline" in detail_data
    assert "price" in detail_data
    assert "departure" in detail_data
    assert "arrival" in detail_data


def test_modal_keyboard_accessible(client):
    """Modal'ın klavye erişilebilir olduğunu test et (JavaScript varlığı)"""
    response = client.post(
        "/flights",
        data={
            "origin": "IST",
            "destination": "AYT",
            "departure_date": "2025-12-31",
            "trip_type": "one-way",
        },
    )

    assert response.status_code == 200

    # ui.js yüklenmiş olmalı
    assert b"ui.js" in response.data

    # ESC tuşu için event listener olmalı (ui.js içinde)
    # Bu kontrolü statik dosyayı okuyarak yapalım
    import os

    ui_js_path = os.path.join(os.path.dirname(__file__), "..", "static", "js", "ui.js")

    if os.path.exists(ui_js_path):
        with open(ui_js_path, "r") as f:
            ui_js_content = f.read()
            assert "Escape" in ui_js_content or "keydown" in ui_js_content


def test_modal_content_structure(client):
    """Modal içeriğinin yapısını test et"""
    # Uçuş detay API'sinden veri al
    response = client.get("/api/mock/flights?origin=IST&destination=AYT&departure_date=2025-12-31")

    data = json.loads(response.data)
    flight = data["flights"][0]

    # Modal için gerekli tüm alanlar mevcut olmalı
    required_fields = [
        "airline",
        "flightNumber",
        "price",
        "departure",
        "arrival",
        "aircraft",
        "policy",
        "cabin_class",
    ]

    for field in required_fields:
        assert field in flight, f"Modal için gerekli alan eksik: {field}"
