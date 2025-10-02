"""
Flight API client for fetching real-time flight data.
Implements MYK Level 5 API integration standards.
"""

import requests
import os
from datetime import datetime, date
import logging
from typing import List, Dict, Optional


class FlightAPIClient:
    """Client for fetching flight data from external APIs."""
    
    def __init__(self):
        self.api_key = os.getenv('FLIGHT_API_KEY')
        self.base_url = os.getenv('FLIGHT_API_URL', 'https://api.aviationstack.com/v1')
        self.timeout = 30
        self.logger = logging.getLogger(__name__)
    
    def search_flights(self, origin: str, destination: str, departure_date: date, 
                      return_date: Optional[date] = None, passengers: int = 1) -> List[Dict]:
        """Search for flights based on criteria."""
        try:
            # For demo purposes, return mock data since we don't have a real API key
            return self._get_mock_flight_data(origin, destination, departure_date, return_date, passengers)
            
            # Real API implementation would be:
            # params = {
            #     'access_key': self.api_key,
            #     'dep_iata': origin,
            #     'arr_iata': destination,
            #     'flight_date': departure_date.strftime('%Y-%m-%d'),
            #     'limit': 100
            # }
            # 
            # response = requests.get(f"{self.base_url}/flights", params=params, timeout=self.timeout)
            # response.raise_for_status()
            # 
            # data = response.json()
            # return self._parse_flight_data(data.get('data', []))
            
        except requests.RequestException as e:
            self.logger.error(f"API request failed: {e}")
            return []
        except Exception as e:
            self.logger.error(f"Flight search error: {e}")
            return []
    
    def _get_mock_flight_data(self, origin: str, destination: str, departure_date: date, 
                             return_date: Optional[date], passengers: int) -> List[Dict]:
        """Generate mock flight data for demonstration."""
        import random
        from datetime import timedelta
        
        airlines = [
            'Turkish Airlines', 'Pegasus Airlines', 'SunExpress', 
            'AnadoluJet', 'AtlasGlobal', 'Onur Air'
        ]
        
        flights = []
        base_price = 500
        
        # Generate 5-10 mock flights
        for i in range(random.randint(5, 10)):
            airline = random.choice(airlines)
            flight_number = f"{airline[:2].upper()}{random.randint(100, 999)}"
            
            # Random departure time
            departure_hour = random.randint(6, 22)
            departure_minute = random.choice([0, 15, 30, 45])
            departure_time = datetime.combine(departure_date, 
                                            datetime.min.time().replace(hour=departure_hour, minute=departure_minute))
            
            # Flight duration 1-4 hours
            duration_hours = random.randint(1, 4)
            arrival_time = departure_time + timedelta(hours=duration_hours)
            
            # Price varies based on airline and time
            price_multiplier = random.uniform(0.7, 2.0)
            if airline == 'Turkish Airlines':
                price_multiplier *= 1.3  # Premium airline
            
            price = round(base_price * price_multiplier * passengers, 2)
            
            flight = {
                'flight_number': flight_number,
                'airline': airline,
                'origin': origin,
                'destination': destination,
                'departure_time': departure_time.strftime('%Y-%m-%d %H:%M'),
                'arrival_time': arrival_time.strftime('%Y-%m-%d %H:%M'),
                'duration': f"{duration_hours}h {random.randint(0, 55)}m",
                'price': price,
                'currency': 'TRY',
                'available_seats': random.randint(5, 150),
                'booking_url': f"https://example-booking.com/flight/{flight_number}",
                'aircraft_type': random.choice(['Boeing 737', 'Airbus A320', 'Airbus A330', 'Boeing 777'])
            }
            
            flights.append(flight)
        
        # Sort by price
        flights.sort(key=lambda x: x['price'])
        
        return flights
    
    def _parse_flight_data(self, api_data: List[Dict]) -> List[Dict]:
        """Parse and normalize flight data from API response."""
        flights = []
        
        for flight in api_data:
            try:
                parsed_flight = {
                    'flight_number': flight.get('flight', {}).get('iata', 'N/A'),
                    'airline': flight.get('airline', {}).get('name', 'Unknown'),
                    'origin': flight.get('departure', {}).get('iata', 'N/A'),
                    'destination': flight.get('arrival', {}).get('iata', 'N/A'),
                    'departure_time': flight.get('departure', {}).get('scheduled', 'N/A'),
                    'arrival_time': flight.get('arrival', {}).get('scheduled', 'N/A'),
                    'price': 0,  # Price data usually comes from a different API
                    'currency': 'TRY',
                    'available_seats': None,
                    'booking_url': None,
                    'aircraft_type': flight.get('aircraft', {}).get('model', 'Unknown')
                }
                
                flights.append(parsed_flight)
                
            except Exception as e:
                self.logger.warning(f"Failed to parse flight data: {e}")
                continue
        
        return flights
    
    def get_flight_status(self, flight_number: str, flight_date: date) -> Dict:
        """Get real-time flight status."""
        try:
            # Mock implementation
            return {
                'flight_number': flight_number,
                'status': 'On Time',
                'departure_delay': 0,
                'arrival_delay': 0,
                'gate': f"Gate {random.randint(1, 50)}",
                'terminal': f"Terminal {random.randint(1, 3)}"
            }
            
        except Exception as e:
            self.logger.error(f"Flight status error: {e}")
            return {}