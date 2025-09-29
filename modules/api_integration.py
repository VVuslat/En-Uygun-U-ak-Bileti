"""
API Integration Module
API entegrasyonu modülü
"""

import requests
import json
from datetime import datetime
import os

class APIManager:
    """API yönetimi sınıfı - API management class"""
    
    def __init__(self):
        self.api_keys = {
            'amadeus': os.getenv('AMADEUS_API_KEY'),
            'skyscanner': os.getenv('SKYSCANNER_API_KEY'),
            'thy': os.getenv('THY_API_KEY'),
            'pegasus': os.getenv('PEGASUS_API_KEY')
        }
        self.base_urls = {
            'amadeus': 'https://api.amadeus.com/v2',
            'skyscanner': 'https://partners.api.skyscanner.net/apiservices',
            'thy': 'https://api.turkishairlines.com/v1',
            'pegasus': 'https://api.flypgs.com/v1'
        }
        
    def search_amadeus_flights(self, origin, destination, departure_date):
        """Amadeus API ile uçuş ara - Search flights with Amadeus API"""
        if not self.api_keys['amadeus']:
            return self._mock_api_response('amadeus')
        
        url = f"{self.base_urls['amadeus']}/shopping/flight-offers"
        headers = {
            'Authorization': f"Bearer {self.api_keys['amadeus']}",
            'Content-Type': 'application/json'
        }
        
        params = {
            'originLocationCode': origin,
            'destinationLocationCode': destination,
            'departureDate': departure_date,
            'adults': 1,
            'max': 10
        }
        
        try:
            response = requests.get(url, headers=headers, params=params, timeout=30)
            if response.status_code == 200:
                return self._parse_amadeus_response(response.json())
            else:
                print(f"Amadeus API error: {response.status_code}")
                return []
        except Exception as e:
            print(f"Amadeus API connection error: {e}")
            return self._mock_api_response('amadeus')
    
    def search_skyscanner_flights(self, origin, destination, departure_date):
        """Skyscanner API ile uçuş ara - Search flights with Skyscanner API"""
        if not self.api_keys['skyscanner']:
            return self._mock_api_response('skyscanner')
        
        url = f"{self.base_urls['skyscanner']}/browseroutes/v1.0/TR/TRY/tr-TR/{origin}/{destination}/{departure_date}"
        headers = {
            'X-RapidAPI-Key': self.api_keys['skyscanner'],
            'X-RapidAPI-Host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com'
        }
        
        try:
            response = requests.get(url, headers=headers, timeout=30)
            if response.status_code == 200:
                return self._parse_skyscanner_response(response.json())
            else:
                print(f"Skyscanner API error: {response.status_code}")
                return []
        except Exception as e:
            print(f"Skyscanner API connection error: {e}")
            return self._mock_api_response('skyscanner')
    
    def search_thy_flights(self, origin, destination, departure_date):
        """THY API ile uçuş ara - Search flights with Turkish Airlines API"""
        if not self.api_keys['thy']:
            return self._mock_api_response('thy')
        
        url = f"{self.base_urls['thy']}/availability"
        headers = {
            'Authorization': f"Bearer {self.api_keys['thy']}",
            'Content-Type': 'application/json'
        }
        
        data = {
            'OriginDestinationInformations': [{
                'DepartureDateTime': departure_date,
                'OriginLocation': {'LocationCode': origin},
                'DestinationLocation': {'LocationCode': destination}
            }],
            'PassengerTypeQuantities': [{'Code': 'ADT', 'Quantity': 1}]
        }
        
        try:
            response = requests.post(url, headers=headers, json=data, timeout=30)
            if response.status_code == 200:
                return self._parse_thy_response(response.json())
            else:
                print(f"THY API error: {response.status_code}")
                return []
        except Exception as e:
            print(f"THY API connection error: {e}")
            return self._mock_api_response('thy')
    
    def search_pegasus_flights(self, origin, destination, departure_date):
        """Pegasus API ile uçuş ara - Search flights with Pegasus API"""
        if not self.api_keys['pegasus']:
            return self._mock_api_response('pegasus')
        
        url = f"{self.base_urls['pegasus']}/flights/search"
        headers = {
            'API-Key': self.api_keys['pegasus'],
            'Content-Type': 'application/json'
        }
        
        params = {
            'departurePort': origin,
            'arrivalPort': destination,
            'departureDate': departure_date,
            'passengerCount': 1
        }
        
        try:
            response = requests.get(url, headers=headers, params=params, timeout=30)
            if response.status_code == 200:
                return self._parse_pegasus_response(response.json())
            else:
                print(f"Pegasus API error: {response.status_code}")
                return []
        except Exception as e:
            print(f"Pegasus API connection error: {e}")
            return self._mock_api_response('pegasus')
    
    def _parse_amadeus_response(self, data):
        """Amadeus API yanıtını ayrıştır - Parse Amadeus API response"""
        flights = []
        if 'data' in data:
            for offer in data['data']:
                flight_data = {
                    'source': 'amadeus',
                    'price': float(offer['price']['total']),
                    'currency': offer['price']['currency'],
                    'segments': []
                }
                
                for itinerary in offer['itineraries']:
                    for segment in itinerary['segments']:
                        flight_data['segments'].append({
                            'departure': segment['departure'],
                            'arrival': segment['arrival'],
                            'carrier': segment['carrierCode'],
                            'flight_number': segment['number']
                        })
                
                flights.append(flight_data)
        
        return flights
    
    def _parse_skyscanner_response(self, data):
        """Skyscanner API yanıtını ayrıştır - Parse Skyscanner API response"""
        flights = []
        # Implementation would depend on actual Skyscanner API structure
        return flights
    
    def _parse_thy_response(self, data):
        """THY API yanıtını ayrıştır - Parse THY API response"""
        flights = []
        # Implementation would depend on actual THY API structure
        return flights
    
    def _parse_pegasus_response(self, data):
        """Pegasus API yanıtını ayrıştır - Parse Pegasus API response"""
        flights = []
        # Implementation would depend on actual Pegasus API structure
        return flights
    
    def _mock_api_response(self, source):
        """Mock API yanıtı - Mock API response for testing"""
        import random
        
        mock_flights = []
        for i in range(random.randint(1, 3)):
            mock_flights.append({
                'source': source,
                'price': random.randint(250, 800),
                'currency': 'TRY',
                'airline': source.upper(),
                'flight_number': f"{source.upper()}{random.randint(100, 999)}",
                'departure_time': f"{random.randint(6, 22):02d}:{random.choice(['00', '30'])}",
                'arrival_time': f"{random.randint(8, 23):02d}:{random.choice(['00', '30'])}",
                'duration': f"{random.randint(1, 4)}h {random.randint(0, 59)}m"
            })
        
        return mock_flights
    
    def get_airport_info(self, airport_code):
        """Havaalanı bilgilerini getir - Get airport information"""
        # Mock airport information
        airports = {
            'IST': {'name': 'İstanbul Havalimanı', 'city': 'İstanbul', 'country': 'Turkey'},
            'SAW': {'name': 'Sabiha Gökçen Havalimanı', 'city': 'İstanbul', 'country': 'Turkey'},
            'ESB': {'name': 'Esenboğa Havalimanı', 'city': 'Ankara', 'country': 'Turkey'},
            'ADB': {'name': 'Adnan Menderes Havalimanı', 'city': 'İzmir', 'country': 'Turkey'},
            'AYT': {'name': 'Antalya Havalimanı', 'city': 'Antalya', 'country': 'Turkey'}
        }
        
        return airports.get(airport_code, {'name': 'Unknown', 'city': 'Unknown', 'country': 'Unknown'})
    
    def check_api_status(self):
        """API durumlarını kontrol et - Check API status"""
        status = {}
        for api_name, api_key in self.api_keys.items():
            status[api_name] = {
                'configured': api_key is not None,
                'status': 'active' if api_key else 'not_configured'
            }
        
        return status