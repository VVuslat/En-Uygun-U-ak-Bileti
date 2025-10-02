"""
Test flight list rendering
Test 3: Arama yapıldığında sonuç sayfasının render edilmesi
"""


def test_flight_list_page_render(client):
    """Uçuş listesi sayfasının render edildiğini test et"""
    response = client.post(
        "/flights",
        data={
            "origin": "IST",
            "destination": "AYT",
            "departure_date": "2025-12-31",
            "trip_type": "one-way",
        },
        follow_redirects=True,
    )

    assert response.status_code == 200
    assert b"IST" in response.data
    assert b"AYT" in response.data


def test_flight_list_shows_results(client):
    """Uçuş sonuçlarının gösterildiğini test et"""
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
    # Uçuş kartı elemanları olmalı
    assert b"flight-id" in response.data or b"airline" in response.data.lower()


def test_flight_list_with_sorting(client):
    """Sıralama parametresi ile liste"""
    response = client.get(
        "/flights",
        query_string={
            "origin": "IST",
            "destination": "AYT",
            "departure_date": "2025-12-31",
            "sort": "price",
        },
    )

    assert response.status_code == 200


def test_flight_list_with_filters(client):
    """Filtre parametreleri ile liste"""
    response = client.get(
        "/flights",
        query_string={
            "origin": "IST",
            "destination": "AYT",
            "departure_date": "2025-12-31",
            "max_price": "2000",
            "airline": "Turkish",
        },
    )

    assert response.status_code == 200


def test_flight_list_empty_state(client):
    """Boş sonuç durumu"""
    response = client.get(
        "/flights",
        query_string={
            "origin": "IST",
            "destination": "AYT",
            "departure_date": "2025-12-31",
            "max_price": "1",  # Çok düşük fiyat - sonuç yok
        },
    )

    assert response.status_code == 200
    # Boş durum mesajı olmalı
    assert b"Bulunamad" in response.data or b"bulunmuyor" in response.data.lower()


def test_flight_list_validation_error(client):
    """Validasyon hatası durumu"""
    response = client.post(
        "/flights", data={"origin": "", "destination": "AYT", "departure_date": "2025-12-31"}
    )

    # Ana sayfaya dön veya hata göster
    assert response.status_code in [200, 302]

    if response.status_code == 200:
        # Hata mesajı olmalı
        assert b"gerekli" in response.data.lower() or b"error" in response.data.lower()
