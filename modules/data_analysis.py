"""
Data Analysis Module
Veri analizi modülü
"""

from datetime import datetime, timedelta
import statistics
import random

# Mock numpy for basic functions
class MockNumpy:
    @staticmethod
    def random():
        return MockNumpyRandom()

class MockNumpyRandom:
    @staticmethod
    def uniform(low, high):
        return random.uniform(low, high)

np = MockNumpy()

class DataAnalyzer:
    """Veri analizi sınıfı - Data analysis class"""
    
    def __init__(self):
        self.flight_data_history = []
        self.price_trends = {}
        
    def analyze_flights(self, flights):
        """Uçuşları analiz et - Analyze flights"""
        if not flights:
            return []
        
        # Add analysis scores to flights
        analyzed_flights = []
        for flight in flights:
            analyzed_flight = flight.copy()
            analyzed_flight['score'] = self._calculate_flight_score(flight)
            analyzed_flight['price_category'] = self._categorize_price(flight['price'], flights)
            analyzed_flight['recommendation'] = self._get_recommendation(flight, flights)
            analyzed_flights.append(analyzed_flight)
        
        # Sort by score (best first)
        analyzed_flights.sort(key=lambda x: x['score'], reverse=True)
        
        # Store data for future analysis
        self._store_flight_data(analyzed_flights)
        
        return analyzed_flights
    
    def _calculate_flight_score(self, flight):
        """Uçuş puanı hesapla - Calculate flight score"""
        score = 100  # Base score
        
        # Price factor (lower price = higher score)
        if flight['price'] < 300:
            score += 20
        elif flight['price'] < 500:
            score += 10
        elif flight['price'] > 800:
            score -= 20
        
        # Time factor (convenient times get bonus)
        departure_hour = int(flight['departure_time'].split(':')[0])
        if 8 <= departure_hour <= 10 or 14 <= departure_hour <= 18:
            score += 15  # Good departure times
        elif departure_hour < 6 or departure_hour > 22:
            score -= 10  # Very early or very late
        
        # Airline factor (premium airlines get bonus)
        if flight['airline'].upper() in ['THY', 'TURKISH']:
            score += 10
        elif flight['airline'].upper() in ['PEGASUS', 'SUNEXPRESS']:
            score += 5
        
        # Availability factor
        if flight['available_seats'] < 10:
            score -= 5  # Low availability
        elif flight['available_seats'] > 30:
            score += 5  # High availability
        
        # Additional services
        if flight.get('baggage_included', False):
            score += 10
        if flight.get('refundable', False):
            score += 5
        
        return max(0, min(100, score))  # Keep score between 0-100
    
    def _categorize_price(self, price, all_flights):
        """Fiyat kategorisi belirle - Categorize price"""
        if not all_flights:
            return 'orta'
        
        prices = [f['price'] for f in all_flights]
        min_price = min(prices)
        max_price = max(prices)
        avg_price = statistics.mean(prices)
        
        if price <= min_price + (avg_price - min_price) * 0.3:
            return 'ucuz'
        elif price >= avg_price + (max_price - avg_price) * 0.7:
            return 'pahalı'
        else:
            return 'orta'
    
    def _get_recommendation(self, flight, all_flights):
        """Öneri mesajı oluştur - Generate recommendation message"""
        price_category = self._categorize_price(flight['price'], all_flights)
        score = self._calculate_flight_score(flight)
        
        if score >= 80:
            if price_category == 'ucuz':
                return "🌟 Mükemmel fiyat! Hemen rezervasyon yapın."
            else:
                return "✅ Kaliteli seçenek, önerilen uçuş."
        elif score >= 60:
            if price_category == 'ucuz':
                return "💰 İyi fiyat, değerlendirebilirsiniz."
            else:
                return "👍 Makul seçenek."
        else:
            if price_category == 'pahalı':
                return "💸 Pahalı, alternatif araştırın."
            else:
                return "⚠️ Ortalama seçenek."
    
    def get_price_statistics(self, flights):
        """Fiyat istatistikleri getir - Get price statistics"""
        if not flights:
            return {}
        
        prices = [f['price'] for f in flights]
        
        return {
            'min_price': min(prices),
            'max_price': max(prices),
            'avg_price': round(statistics.mean(prices), 2),
            'median_price': round(statistics.median(prices), 2),
            'price_range': max(prices) - min(prices),
            'total_flights': len(flights)
        }
    
    def get_airline_analysis(self, flights):
        """Havayolu analizi - Airline analysis"""
        if not flights:
            return {}
        
        airline_stats = {}
        for flight in flights:
            airline = flight['airline']
            if airline not in airline_stats:
                airline_stats[airline] = {
                    'flight_count': 0,
                    'prices': [],
                    'avg_score': 0,
                    'scores': []
                }
            
            airline_stats[airline]['flight_count'] += 1
            airline_stats[airline]['prices'].append(flight['price'])
            if 'score' in flight:
                airline_stats[airline]['scores'].append(flight['score'])
        
        # Calculate averages
        for airline, stats in airline_stats.items():
            stats['avg_price'] = round(statistics.mean(stats['prices']), 2)
            stats['min_price'] = min(stats['prices'])
            stats['max_price'] = max(stats['prices'])
            if stats['scores']:
                stats['avg_score'] = round(statistics.mean(stats['scores']), 2)
        
        return airline_stats
    
    def get_time_analysis(self, flights):
        """Zaman analizi - Time analysis"""
        if not flights:
            return {}
        
        time_slots = {
            'sabah': {'count': 0, 'prices': [], 'flights': []},      # 06:00-12:00
            'öğlen': {'count': 0, 'prices': [], 'flights': []},      # 12:00-18:00
            'akşam': {'count': 0, 'prices': [], 'flights': []},      # 18:00-24:00
            'gece': {'count': 0, 'prices': [], 'flights': []}        # 00:00-06:00
        }
        
        for flight in flights:
            hour = int(flight['departure_time'].split(':')[0])
            
            if 6 <= hour < 12:
                slot = 'sabah'
            elif 12 <= hour < 18:
                slot = 'öğlen'
            elif 18 <= hour < 24:
                slot = 'akşam'
            else:
                slot = 'gece'
            
            time_slots[slot]['count'] += 1
            time_slots[slot]['prices'].append(flight['price'])
            time_slots[slot]['flights'].append(flight)
        
        # Calculate averages
        for slot, data in time_slots.items():
            if data['prices']:
                data['avg_price'] = round(statistics.mean(data['prices']), 2)
                data['min_price'] = min(data['prices'])
                data['max_price'] = max(data['prices'])
            else:
                data['avg_price'] = 0
                data['min_price'] = 0
                data['max_price'] = 0
        
        return time_slots
    
    def predict_price_trend(self, departure, destination, days=7):
        """Fiyat trendi tahmin et - Predict price trend"""
        # Mock prediction based on historical patterns
        base_price = 400
        trends = []
        
        for i in range(days):
            date = datetime.now() + timedelta(days=i)
            
            # Add weekly pattern (weekend premium)
            weekend_multiplier = 1.2 if date.weekday() >= 5 else 1.0
            
            # Add seasonal variation
            seasonal_multiplier = 1.1 if date.month in [6, 7, 8, 12] else 0.9
            
            # Add random variation
            random_factor = np.random.uniform(0.85, 1.15)
            
            predicted_price = int(base_price * weekend_multiplier * seasonal_multiplier * random_factor)
            
            trends.append({
                'date': date.strftime('%Y-%m-%d'),
                'predicted_price': predicted_price,
                'confidence': 'orta'  # low, orta, high
            })
        
        return trends
    
    def _store_flight_data(self, flights):
        """Uçuş verilerini sakla - Store flight data"""
        for flight in flights:
            flight_record = {
                'timestamp': datetime.now().isoformat(),
                'flight_data': flight
            }
            self.flight_data_history.append(flight_record)
        
        # Keep only last 1000 records
        if len(self.flight_data_history) > 1000:
            self.flight_data_history = self.flight_data_history[-1000:]
    
    def get_insights(self, flights):
        """Genel içgörüler - Get general insights"""
        if not flights:
            return []
        
        insights = []
        
        # Price insights
        stats = self.get_price_statistics(flights)
        if stats['price_range'] > 300:
            insights.append({
                'type': 'price',
                'message': f"Fiyatlar {stats['min_price']} TL ile {stats['max_price']} TL arasında değişiyor. Büyük fark var!",
                'importance': 'high'
            })
        
        # Time insights
        time_analysis = self.get_time_analysis(flights)
        cheapest_slot = min(time_analysis.keys(), key=lambda x: time_analysis[x]['avg_price'] if time_analysis[x]['avg_price'] > 0 else float('inf'))
        if time_analysis[cheapest_slot]['avg_price'] > 0:
            insights.append({
                'type': 'time',
                'message': f"En uygun fiyatlar {cheapest_slot} saatlerinde.",
                'importance': 'medium'
            })
        
        # Airline insights
        airline_analysis = self.get_airline_analysis(flights)
        if len(airline_analysis) > 1:
            cheapest_airline = min(airline_analysis.keys(), key=lambda x: airline_analysis[x]['avg_price'])
            insights.append({
                'type': 'airline',
                'message': f"{cheapest_airline} havayolu ortalama en uygun fiyatları sunuyor.",
                'importance': 'medium'
            })
        
        return insights