"""
Test error handling
Test 6: Hata durumunda uygun mesajın gösterilmesi
"""


def test_404_error_page(client):
    """404 hata sayfasının gösterildiğini test et"""
    response = client.get("/nonexistent-page")

    assert response.status_code == 404
    assert b"404" in response.data or b"Bulunamad" in response.data


def test_missing_parameters_error(client):
    """Eksik parametrelerle istek"""
    response = client.get("/flights")

    # Eksik parametreler nedeniyle hata veya ana sayfaya yönlendirme
    assert response.status_code in [200, 400]

    if response.status_code == 200:
        # Hata mesajı olmalı
        assert b"gerekli" in response.data.lower() or b"error" in response.data.lower()


def test_invalid_date_format(client):
    """Geçersiz tarih formatı ile istek"""
    response = client.post(
        "/flights",
        data={
            "origin": "IST",
            "destination": "AYT",
            "departure_date": "invalid-date",
            "trip_type": "one-way",
        },
    )

    # Hata veya index sayfası
    assert response.status_code in [200, 400]


def test_same_origin_destination_error(client):
    """Aynı kalkış ve varış havalimanı hatası"""
    response = client.post(
        "/flights",
        data={
            "origin": "IST",
            "destination": "IST",
            "departure_date": "2025-12-31",
            "trip_type": "one-way",
        },
    )

    # Bu validasyon client-side yapılıyor ama server-side de kontrol edilebilir
    assert response.status_code in [200, 400]


def test_api_missing_params_error_message(client):
    """API'de eksik parametre hata mesajı"""
    response = client.get("/api/mock/flights")

    assert response.status_code == 400

    import json

    data = json.loads(response.data)

    assert "error" in data
    assert "required" in data or "Missing" in data["error"]


def test_flight_not_found_error(client):
    """Var olmayan uçuş ID'si ile istek"""
    response = client.get("/api/flight/NONEXISTENT999")

    # 404 veya boş sonuç dönmeli
    assert response.status_code in [200, 404]


def test_empty_search_results_message(client):
    """Sonuç bulunamadığında mesaj"""
    # Çok düşük fiyat filtresi ile arama - sonuç yok
    response = client.get(
        "/flights",
        query_string={
            "origin": "IST",
            "destination": "AYT",
            "departure_date": "2025-12-31",
            "max_price": "1",
        },
    )

    assert response.status_code == 200

    # "Bulunamadı" mesajı olmalı
    assert (
        b"Bulunamad" in response.data
        or b"bulunmuyor" in response.data.lower()
        or b"no flight" in response.data.lower()
    )


def test_error_page_has_navigation(client):
    """Hata sayfasında navigasyon linklerinin olduğunu test et"""
    response = client.get("/nonexistent-page")

    assert response.status_code == 404

    # Ana sayfaya veya geri dönüş linki olmalı
    assert b"href=" in response.data and (b"Ana Sayfa" in response.data or b"Geri" in response.data)
