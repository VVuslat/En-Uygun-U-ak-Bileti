"""
Test flight card components
Test 4: FlightCard'da fiyat ve havayolu görünürlüğü
"""


def test_flight_card_contains_price(client):
    """Uçuş kartında fiyat bilgisinin olduğunu test et"""
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

    # Fiyat bilgisi olmalı (TRY veya sayısal değer)
    assert b"TRY" in response.data or b"price" in response.data.lower()


def test_flight_card_contains_airline(client):
    """Uçuş kartında havayolu bilgisinin olduğunu test et"""
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

    # Havayolu isimlerinden biri olmalı
    airlines = [b"Turkish", b"Pegasus", b"SunExpress", b"AnadoluJet", b"Atlas"]
    assert any(airline in response.data for airline in airlines)


def test_flight_card_contains_times(client):
    """Uçuş kartında kalkış/varış saatlerinin olduğunu test et"""
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

    # Saat formatı olmalı (HH:MM)
    data_str = response.data.decode("utf-8")
    # Basit bir saat pattern kontrolü
    import re

    time_pattern = r"\d{2}:\d{2}"
    assert re.search(time_pattern, data_str) is not None


def test_flight_card_contains_route_info(client):
    """Uçuş kartında rota bilgisinin olduğunu test et"""
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

    # Kalkış ve varış havalimanları gösterilmeli
    assert b"IST" in response.data
    assert b"AYT" in response.data


def test_flight_card_has_details_button(client):
    """Uçuş kartında detay butonu olduğunu test et"""
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

    # Detay butonu veya link olmalı
    assert b"Detay" in response.data or b"openFlightModal" in response.data


def test_flight_card_data_attributes(client):
    """Uçuş kartında data attribute'larının olduğunu test et"""
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

    # Data attributes (filtreleme için gerekli)
    assert b"data-flight-id" in response.data or b"data-price" in response.data
