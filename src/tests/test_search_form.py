"""
Test search form rendering and validation
Test 1: Form render ve validasyon testi
"""

from forms.search_form import SearchForm


def test_search_form_render(client):
    """Arama formunun doğru render edildiğini test et"""
    response = client.get("/")

    assert response.status_code == 200
    assert b"origin" in response.data
    assert b"destination" in response.data
    assert b"departure_date" in response.data
    assert b"En Uygun U" in response.data or b"Yolculuk Tipi" in response.data


def test_search_form_validation():
    """Form validasyon fonksiyonlarını test et"""
    form = SearchForm()

    # Boş veri - validasyon başarısız olmalı
    result = form.validate({})
    assert result is False
    assert len(form.errors) > 0

    # Geçerli veri
    valid_data = {
        "origin": "IST",
        "destination": "AYT",
        "departure_date": "2025-12-31",
        "trip_type": "one-way",
    }
    result = form.validate(valid_data)
    assert result is True
    assert len(form.errors) == 0


def test_search_form_airport_code_validation():
    """Havalimanı kodu validasyonu"""
    form = SearchForm()

    # Kısa kod
    result = form.validate({"origin": "IS", "destination": "AYT", "departure_date": "2025-12-31"})
    assert result is False
    assert "origin" in form.errors

    # Aynı havalimanı
    result = form.validate({"origin": "IST", "destination": "IST", "departure_date": "2025-12-31"})
    assert result is False
    assert "destination" in form.errors


def test_search_form_date_helpers():
    """Form tarih yardımcı fonksiyonları"""
    form = SearchForm()

    min_date = form.get_min_date()
    assert min_date is not None
    assert len(min_date) == 10  # YYYY-MM-DD format

    default_date = form.get_default_date()
    assert default_date is not None
    assert len(default_date) == 10

    # Default date bugünden sonra olmalı
    assert default_date >= min_date


def test_popular_airports_list():
    """Popüler havalimanları listesi kontrolü"""
    form = SearchForm()

    assert "IST" in form.POPULAR_AIRPORTS
    assert "SAW" in form.POPULAR_AIRPORTS
    assert "AYT" in form.POPULAR_AIRPORTS
    assert len(form.POPULAR_AIRPORTS) >= 5
