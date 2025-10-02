"""
Flight Service - Mock API Data Provider
MYK Seviye 5 uyumlu uçuş veri servisi
"""

import random
from datetime import datetime, timedelta
from typing import List, Dict, Optional


class FlightService:
    """Uçuş verilerini yöneten servis sınıfı"""

    # Mock havayolu listesi
    AIRLINES = [
        "Turkish Airlines",
        "Pegasus Airlines",
        "SunExpress",
        "AnadoluJet",
        "AtlasGlobal",
    ]

    # Mock uçak modelleri
    AIRCRAFT_TYPES = [
        "Boeing 737",
        "Airbus A320",
        "Airbus A321",
        "Boeing 777",
        "Airbus A330",
    ]

    def __init__(self):
        """Servis başlatma"""
        self._flight_cache = {}

    def search_flights(
        self,
        origin: str,
        destination: str,
        departure_date: str,
        return_date: Optional[str] = None,
        trip_type: str = "one-way",
    ) -> List[Dict]:
        """
        Uçuş arama fonksiyonu

        Args:
            origin: Kalkış havalimanı kodu (örn: IST)
            destination: Varış havalimanı kodu (örn: AYT)
            departure_date: Kalkış tarihi (YYYY-MM-DD)
            return_date: Dönüş tarihi (opsiyonel)
            trip_type: Yolculuk tipi (one-way veya round-trip)

        Returns:
            Uçuş listesi
        """
        # Cache key oluştur
        cache_key = f"{origin}_{destination}_{departure_date}_{return_date}_{trip_type}"

        # Cache'de varsa döndür
        if cache_key in self._flight_cache:
            return self._flight_cache[cache_key]

        # Mock uçuş verileri oluştur
        flights = self._generate_mock_flights(
            origin, destination, departure_date, return_date, trip_type
        )

        # Cache'e kaydet
        self._flight_cache[cache_key] = flights

        return flights

    def get_flight_by_id(self, flight_id: str) -> Optional[Dict]:
        """
        ID'ye göre uçuş detayı getir

        Args:
            flight_id: Uçuş ID'si

        Returns:
            Uçuş detayları veya None
        """
        # Cache'deki tüm uçuşları tara
        for flights in self._flight_cache.values():
            for flight in flights:
                if flight["id"] == flight_id:
                    return flight

        # Bulunamazsa mock veri oluştur
        return self._generate_single_flight(flight_id)

    def _generate_mock_flights(
        self,
        origin: str,
        destination: str,
        departure_date: str,
        return_date: Optional[str],
        trip_type: str,
    ) -> List[Dict]:
        """Mock uçuş verileri üret"""
        flights = []
        num_flights = random.randint(5, 12)

        # Tarih parse et
        try:
            dep_date = datetime.strptime(departure_date, "%Y-%m-%d")
        except ValueError:
            dep_date = datetime.now() + timedelta(days=30)

        for i in range(num_flights):
            airline = random.choice(self.AIRLINES)

            # Uçuş numarası oluştur
            airline_code = "".join([c for c in airline if c.isupper()])[:2]
            flight_number = f"{airline_code}{random.randint(100, 999)}"

            # Kalkış saati oluştur (06:00 - 23:00 arası)
            departure_hour = random.randint(6, 23)
            departure_minute = random.choice([0, 15, 30, 45])
            departure_time = dep_date.replace(
                hour=departure_hour, minute=departure_minute, second=0, microsecond=0
            )

            # Uçuş süresi (1-5 saat arası)
            duration_minutes = random.randint(60, 300)
            arrival_time = departure_time + timedelta(minutes=duration_minutes)

            # Fiyat hesapla (mesafeye göre)
            base_price = random.uniform(500, 2000)
            price = round(base_price, 2)

            # Aktarma sayısı
            stops = random.choice([0, 0, 0, 1, 1, 2])

            # Uçuş ID'si
            flight_id = f"FL{random.randint(1000, 9999)}"

            flight = {
                "id": flight_id,
                "airline": airline,
                "flightNumber": flight_number,
                "price": price,
                "currency": "TRY",
                "departure": departure_time.strftime("%Y-%m-%dT%H:%M:%S+03:00"),
                "arrival": arrival_time.strftime("%Y-%m-%dT%H:%M:%S+03:00"),
                "origin": origin,
                "destination": destination,
                "stops": stops,
                "duration_minutes": duration_minutes,
                "aircraft": random.choice(self.AIRCRAFT_TYPES),
                "policy": random.choice(
                    ["İade edilebilir", "İade edilemez", "Değiştirilebilir", "Kısıtlı değişiklik"]
                ),
                "available_seats": random.randint(5, 150),
                "baggage_allowance": f"{random.choice([15, 20, 25, 30])}kg",
                "cabin_class": random.choice(["Economy", "Business", "First"]),
            }

            flights.append(flight)

        # Fiyata göre sırala
        flights.sort(key=lambda x: x["price"])

        return flights

    def _generate_single_flight(self, flight_id: str) -> Dict:
        """Tek bir mock uçuş verisi oluştur"""
        airline = random.choice(self.AIRLINES)

        return {
            "id": flight_id,
            "airline": airline,
            "flightNumber": f"{airline[:2].upper()}{random.randint(100, 999)}",
            "price": round(random.uniform(500, 2000), 2),
            "currency": "TRY",
            "departure": (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%dT08:30:00+03:00"),
            "arrival": (datetime.now() + timedelta(days=30, hours=2)).strftime(
                "%Y-%m-%dT10:30:00+03:00"
            ),
            "origin": "IST",
            "destination": "AYT",
            "stops": 0,
            "duration_minutes": 120,
            "aircraft": random.choice(self.AIRCRAFT_TYPES),
            "policy": "İade edilebilir",
            "available_seats": random.randint(5, 150),
            "baggage_allowance": "20kg",
            "cabin_class": "Economy",
        }
