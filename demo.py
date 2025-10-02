#!/usr/bin/env python3
"""
Demo script for En Uygun Uçak Bileti
Bu script Flask bağımlılığı olmadan modüllerin çalıştığını gösterir.
"""

import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def demo_flight_search():
    """Uçuş arama modülü demo"""
    print("=" * 50)
    print("UÇUŞ ARAMA MODÜLÜ TESTİ")
    print("=" * 50)
    
    try:
        from modules.flight_search import FlightSearchEngine
        
        search_engine = FlightSearchEngine()
        
        # Test flight search
        print("İstanbul → Ankara uçuşları aranıyor...")
        flights = search_engine.search_flights("İstanbul", "Ankara", "2024-12-01")
        
        print(f"\n{len(flights)} uçuş bulundu:")
        for i, flight in enumerate(flights[:3], 1):
            print(f"\n{i}. {flight['airline']} {flight['flight_number']}")
            print(f"   Kalkış: {flight['departure_time']} → Varış: {flight['arrival_time']}")
            print(f"   Süre: {flight['duration']}")
            print(f"   Fiyat: {flight['price']} {flight['currency']}")
            print(f"   Boş koltuk: {flight['available_seats']}")
        
        # Test popular routes
        print("\n" + "-" * 30)
        print("POPÜLER ROTALAR:")
        routes = search_engine.get_popular_routes()
        for route in routes:
            print(f"• {route['departure']} → {route['destination']}: {route['avg_price']} TL")
        
        print("✅ Uçuş arama modülü başarıyla çalışıyor!")
        return True
        
    except Exception as e:
        print(f"❌ Hata: {e}")
        return False

def demo_data_analysis():
    """Veri analizi modülü demo"""
    print("\n" + "=" * 50)
    print("VERİ ANALİZİ MODÜLÜ TESTİ")
    print("=" * 50)
    
    try:
        from modules.data_analysis import DataAnalyzer
        from modules.flight_search import FlightSearchEngine
        
        # Get some test flights
        search_engine = FlightSearchEngine()
        flights = search_engine.search_flights("İstanbul", "Ankara", "2024-12-01")
        
        # Analyze flights
        analyzer = DataAnalyzer()
        analyzed_flights = analyzer.analyze_flights(flights)
        
        print("\nANALİZ SONUÇLARI:")
        for i, flight in enumerate(analyzed_flights[:3], 1):
            print(f"\n{i}. {flight['airline']} {flight['flight_number']}")
            print(f"   Puan: {flight['score']}/100")
            print(f"   Kategori: {flight['price_category']}")
            print(f"   Öneri: {flight['recommendation']}")
        
        # Get statistics
        stats = analyzer.get_price_statistics(flights)
        print(f"\n" + "-" * 30)
        print("FİYAT İSTATİSTİKLERİ:")
        print(f"• En düşük: {stats['min_price']} TL")
        print(f"• En yüksek: {stats['max_price']} TL")
        print(f"• Ortalama: {stats['avg_price']} TL")
        print(f"• Medyan: {stats['median_price']} TL")
        
        # Get insights
        insights = analyzer.get_insights(flights)
        print(f"\n" + "-" * 30)
        print("İÇGÖRÜLER:")
        for insight in insights:
            print(f"• {insight['message']}")
        
        print("✅ Veri analizi modülü başarıyla çalışıyor!")
        return True
        
    except Exception as e:
        print(f"❌ Hata: {e}")
        return False

def demo_api_integration():
    """API entegrasyonu modülü demo"""
    print("\n" + "=" * 50)
    print("API ENTEGRASYONU MODÜLÜ TESTİ")
    print("=" * 50)
    
    try:
        from modules.api_integration import APIManager
        
        api_manager = APIManager()
        
        # Check API status
        status = api_manager.check_api_status()
        print("API DURUMU:")
        for api, info in status.items():
            status_text = "Yapılandırılmış" if info['configured'] else "Yapılandırılmamış"
            print(f"• {api.upper()}: {status_text}")
        
        # Test mock API calls
        print(f"\n" + "-" * 30)
        print("TEST API ÇAĞRILARI:")
        
        amadeus_flights = api_manager.search_amadeus_flights("IST", "ESB", "2024-12-01")
        print(f"• Amadeus: {len(amadeus_flights)} uçuş bulundu")
        
        skyscanner_flights = api_manager.search_skyscanner_flights("IST", "ESB", "2024-12-01")
        print(f"• Skyscanner: {len(skyscanner_flights)} uçuş bulundu")
        
        # Test airport info
        airport_info = api_manager.get_airport_info("IST")
        print(f"\n" + "-" * 30)
        print("HAVAALANı BİLGİSİ:")
        print(f"• İST: {airport_info['name']}, {airport_info['city']}")
        
        print("✅ API entegrasyonu modülü başarıyla çalışıyor!")
        return True
        
    except Exception as e:
        print(f"❌ Hata: {e}")
        return False

def demo_notification_service():
    """Bildirim servisi modülü demo"""
    print("\n" + "=" * 50)
    print("BİLDİRİM SERVİSİ MODÜLÜ TESTİ")
    print("=" * 50)
    
    try:
        from modules.notification_service import NotificationService
        
        notification_service = NotificationService()
        
        # Test email notification
        print("E-POSTA BİLDİRİMİ TESTİ:")
        success = notification_service.send_notification(
            "test@example.com",
            "Bu bir test bildirimidir.",
            "email",
            "Test Bildirimi"
        )
        print(f"E-posta gönderimi: {'Başarılı' if success else 'Başarısız'}")
        
        # Test price alert
        print(f"\n" + "-" * 30)
        print("FİYAT UYARISI TESTİ:")
        flight_details = {
            'departure': 'İstanbul',
            'destination': 'Ankara',
            'date': '2024-12-01',
            'airline': 'THY',
            'booking_url': 'https://example.com/booking'
        }
        
        alert_success = notification_service.send_price_alert(
            "user@example.com",
            flight_details,
            400,  # target price
            350   # current price
        )
        print(f"Fiyat uyarısı: {'Başarılı' if alert_success else 'Başarısız'}")
        
        # Test notification history
        history = notification_service.get_notification_history(limit=5)
        print(f"\n" + "-" * 30)
        print(f"BİLDİRİM GEÇMİŞİ: {len(history)} kayıt")
        
        print("✅ Bildirim servisi modülü başarıyla çalışıyor!")
        return True
        
    except Exception as e:
        print(f"❌ Hata: {e}")
        return False

def demo_user_management():
    """Kullanıcı yönetimi modülü demo"""
    print("\n" + "=" * 50)
    print("KULLANICI YÖNETİMİ MODÜLÜ TESTİ")
    print("=" * 50)
    
    try:
        from modules.user_management import UserManager
        
        # Mock database object
        class MockDB:
            pass
        
        user_manager = UserManager(MockDB())
        
        # Test user creation
        print("KULLANICI OLUŞTURMA TESTİ:")
        success, message = user_manager.create_user(
            "test@example.com",
            "password123",
            "Test Kullanıcısı"
        )
        print(f"Kullanıcı oluşturma: {'Başarılı' if success else 'Başarısız'}")
        print(f"Mesaj: {message}")
        
        # Test duplicate user
        success2, message2 = user_manager.create_user(
            "test@example.com",
            "password456",
            "Test Kullanıcısı 2"
        )
        print(f"\nDuplikat kullanıcı testi: {'Başarısız' if not success2 else 'Beklenmeyen başarı'}")
        print(f"Mesaj: {message2}")
        
        # Test authentication
        print(f"\n" + "-" * 30)
        print("DOĞRULAMA TESTİ:")
        auth_success, user = user_manager.authenticate_user("test@example.com", "password123")
        print(f"Doğru şifre ile giriş: {'Başarılı' if auth_success else 'Başarısız'}")
        
        auth_fail, _ = user_manager.authenticate_user("test@example.com", "wrongpassword")
        print(f"Yanlış şifre ile giriş: {'Başarısız' if not auth_fail else 'Beklenmeyen başarı'}")
        
        # Test user retrieval
        retrieved_user = user_manager.get_user_by_email("test@example.com")
        print(f"\nKullanıcı getirme: {'Başarılı' if retrieved_user else 'Başarısız'}")
        if retrieved_user:
            print(f"Kullanıcı adı: {retrieved_user.name}")
        
        print("✅ Kullanıcı yönetimi modülü başarıyla çalışıyor!")
        return True
        
    except Exception as e:
        print(f"❌ Hata: {e}")
        return False

def main():
    """Ana demo fonksiyonu"""
    print("🛫 EN UYGUN UÇAK BİLETİ - MODÜL DEMO")
    print("=" * 70)
    
    results = []
    
    # Test all modules
    results.append(("Uçuş Arama", demo_flight_search()))
    results.append(("Veri Analizi", demo_data_analysis()))
    results.append(("API Entegrasyonu", demo_api_integration()))
    results.append(("Bildirim Servisi", demo_notification_service()))
    results.append(("Kullanıcı Yönetimi", demo_user_management()))
    
    # Show summary
    print("\n" + "=" * 70)
    print("ÖZET RAPORU")
    print("=" * 70)
    
    success_count = 0
    for module_name, success in results:
        status = "✅ BAŞARILI" if success else "❌ BAŞARISIZ"
        print(f"{module_name:<20}: {status}")
        if success:
            success_count += 1
    
    print(f"\nToplam: {success_count}/{len(results)} modül başarıyla çalışıyor")
    
    if success_count == len(results):
        print("\n🎉 Tüm modüller başarıyla test edildi!")
        print("Uygulama Flask ile çalıştırılmaya hazır.")
    else:
        print(f"\n⚠️  {len(results) - success_count} modülde sorun tespit edildi.")
    
    print("\nDemo tamamlandı. Flask uygulamasını çalıştırmak için:")
    print("python app.py")

if __name__ == "__main__":
    main()