"""
Flight Search Engine Module
Uçuş arama motoru modülü
"""

import requests
from datetime import datetime, timedelta
import random
import time

class FlightSearchEngine:
    """Uçuş arama motoru - Flight search engine"""
    
    def __init__(self):
        self.search_engines = [
            'pegasus', 'thy', 'sunexpress', 'anadolujet'
        ]
        self.airports = {
            'İstanbul': ['IST', 'SAW'],
            'Ankara': ['ESB'],
            'İzmir': ['ADB'],
            'Antalya': ['AYT'],
            'Adana': ['ADA'],
            'Trabzon': ['TZX'],
            'Gaziantep': ['GZT']
        }
    
    def search_flights(self, departure, destination, date, return_date=None):
        """Uçuş ara - Search flights"""
        try:
            # Parse date
            flight_date = datetime.strptime(date, '%Y-%m-%d')
            
            # Get airport codes
            dep_codes = self._get_airport_codes(departure)
            dest_codes = self._get_airport_codes(destination)
            
            if not dep_codes or not dest_codes:
                return []
            
            flights = []
            
            # Search on different engines
            for engine in self.search_engines:
                engine_flights = self._search_on_engine(
                    engine, dep_codes[0], dest_codes[0], flight_date
                )
                flights.extend(engine_flights)
            
            # Sort by price
            flights.sort(key=lambda x: x['price'])
            
            return flights
            
        except Exception as e:
            print(f"Arama hatası: {e}")
            return []
    
    def _search_on_engine(self, engine, departure_code, destination_code, date):
        """Belirli bir motorda ara - Search on specific engine"""
        flights = []
        
        # Simulate flight search (in real implementation, this would call actual APIs)
        num_flights = random.randint(2, 5)
        
        for i in range(num_flights):
            flight = self._generate_mock_flight(
                engine, departure_code, destination_code, date, i
            )
            flights.append(flight)
        
        return flights
    
    def _generate_mock_flight(self, airline, dep_code, dest_code, date, flight_num):
        """Mock uçuş verisi oluştur - Generate mock flight data"""
        base_price = random.randint(200, 1000)
        
        # Add some variation based on airline
        price_multipliers = {
            'pegasus': 0.8,
            'thy': 1.2,
            'sunexpress': 0.9,
            'anadolujet': 0.85
        }
        
        price = int(base_price * price_multipliers.get(airline, 1.0))
        
        departure_time = date.replace(
            hour=random.randint(6, 22),
            minute=random.choice([0, 30])
        )
        
        flight_duration = timedelta(hours=random.randint(1, 4))
        arrival_time = departure_time + flight_duration
        
        return {
            'id': f"{airline}_{dep_code}_{dest_code}_{flight_num}",
            'airline': airline.upper(),
            'flight_number': f"{airline.upper()}{random.randint(100, 999)}",
            'departure_airport': dep_code,
            'destination_airport': dest_code,
            'departure_time': departure_time.strftime('%H:%M'),
            'arrival_time': arrival_time.strftime('%H:%M'),
            'duration': str(flight_duration).split(':')[0] + 'sa ' + str(flight_duration).split(':')[1] + 'dk',
            'price': price,
            'currency': 'TL',
            'available_seats': random.randint(5, 50),
            'booking_url': f"https://{airline}.com/booking/{dep_code}-{dest_code}",
            'baggage_included': random.choice([True, False]),
            'refundable': random.choice([True, False])
        }
    
    def _get_airport_codes(self, city_name):
        """Şehir adından havaalanı kodlarını getir - Get airport codes from city name"""
        for city, codes in self.airports.items():
            if city.lower() in city_name.lower():
                return codes
        return None
    
    def get_popular_routes(self):
        """Popüler rotaları getir - Get popular routes"""
        popular_routes = [
            {'departure': 'İstanbul', 'destination': 'Ankara', 'avg_price': 350},
            {'departure': 'İstanbul', 'destination': 'İzmir', 'avg_price': 280},
            {'departure': 'İstanbul', 'destination': 'Antalya', 'avg_price': 420},
            {'departure': 'Ankara', 'destination': 'İzmir', 'avg_price': 320},
        ]
        return popular_routes
    
    def get_price_trends(self, departure, destination, days=30):
        """Fiyat trendlerini getir - Get price trends"""
        trends = []
        base_price = random.randint(250, 500)
        
        for i in range(days):
            date = datetime.now() + timedelta(days=i)
            # Add some randomness to simulate price fluctuations
            price_variation = random.randint(-50, 100)
            price = max(base_price + price_variation, 150)
            
            trends.append({
                'date': date.strftime('%Y-%m-%d'),
                'price': price
            })
        
        return trends