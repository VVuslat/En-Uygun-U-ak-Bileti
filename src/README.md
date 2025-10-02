# En Uygun Uçak Bileti - Flask Frontend Projesi

Flask + Jinja2 ile hazırlanmış, MYK Yazılım Geliştirici Seviye 5 yönergesine uygun uçak bileti arama & takip frontend projesi. Mock API, responsive tasarım ve pytest tabanlı testlerle teslim edilir.

## 📋 Proje Hakkında

Bu proje, MYK (Mesleki Yeterlilik Kurumu) Yazılım Geliştirici Seviye 5 standartlarına uygun olarak geliştirilmiş, Python tabanlı bir frontend uygulamasıdır. React kullanılmamış, bunun yerine Flask + Jinja2 şablon motoru tercih edilmiştir.

### Temel Özellikler

- ✅ Flask backend + Jinja2 şablon motoru
- ✅ TailwindCSS (CDN) ile responsive, mobil-first tasarım
- ✅ Vanilla JavaScript ile modal ve etkileşimler
- ✅ Mock API endpoint (`/api/mock/flights`)
- ✅ Server-side filtreleme ve sıralama
- ✅ WCAG 2.1 erişilebilirlik standartları
- ✅ Klavye navigasyonu desteği
- ✅ 6+ pytest otomatik test
- ✅ Black ve Flake8 kod kalite kontrolleri

## 🚀 Kurulum

### Gereksinimler

- Python 3.8 veya üzeri
- pip (Python paket yöneticisi)
- Virtual environment (önerilir)

### Adım Adım Kurulum

1. **Projeyi klonlayın veya indirin**

```bash
cd src/
```

2. **Virtual environment oluşturun**

```bash
python -m venv venv

# Linux/Mac
source venv/bin/activate

# Windows
venv\Scripts\activate
```

3. **Bağımlılıkları yükleyin**

```bash
pip install -r requirements.txt
```

## 🏃 Çalıştırma

### Development Sunucusunu Başlatma

```bash
cd src/
python main.py
```

Uygulama şu adreste çalışacaktır: **http://localhost:5000**

### Production için

```bash
# Gunicorn ile (önerilir)
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 main:app

# veya Flask production mode
export FLASK_ENV=production
flask run
```

## 🧪 Test Çalıştırma

### Tüm testleri çalıştır

```bash
cd src/
pytest tests/ -v
```

### Belirli bir test dosyasını çalıştır

```bash
pytest tests/test_search_form.py -v
```

### Test coverage raporu

```bash
pytest tests/ --cov=. --cov-report=html
```

## 🎨 Kod Kalitesi

### Black ile kod formatlama

```bash
cd src/
black . --line-length 100
```

### Flake8 ile lint kontrolü

```bash
cd src/
flake8 . --max-line-length=100 --extend-ignore=E203,W503
```

### Tüm kalite kontrolleri

```bash
# Format kodu
black . --line-length 100

# Lint kontrolü
flake8 . --max-line-length=100 --extend-ignore=E203,W503

# Testleri çalıştır
pytest tests/ -v
```

## 📁 Dosya Yapısı

```
src/
├── main.py                 # Ana Flask uygulaması
├── requirements.txt        # Python bağımlılıkları
├── pyproject.toml         # Proje konfigürasyonu (Black, pytest)
├── templates/             # Jinja2 şablonları
│   ├── base.html         # Ana layout (TailwindCSS CDN)
│   ├── index.html        # Arama formu
│   ├── flights_list.html # Uçuş listesi
│   ├── flight_card.html  # Uçuş kartı partial
│   ├── flight_detail_modal.html  # Modal partial
│   └── error.html        # Hata sayfası
├── static/               # Statik dosyalar
│   ├── js/
│   │   └── ui.js        # Modal, DOM etkileşimleri
│   └── css/
│       └── tailwind.css # Custom CSS (CDN kullanıldığı için boş)
├── services/            # Servis katmanı
│   ├── __init__.py
│   └── flight_service.py  # Mock API ve uçuş veri servisi
├── forms/               # Form yönetimi
│   ├── __init__.py
│   └── search_form.py   # Arama formu validasyonu
├── utils/               # Yardımcı fonksiyonlar
│   ├── __init__.py
│   └── formatters.py    # Tarih, para, süre formatlama
├── tests/               # Test dosyaları
│   ├── __init__.py
│   ├── conftest.py      # Pytest konfigürasyonu
│   ├── test_search_form.py         # Form testleri
│   ├── test_api_mock.py            # API testleri
│   ├── test_flight_list_render.py  # Render testleri
│   ├── test_flight_card.py         # Kart bileşeni testleri
│   ├── test_modal_behavior.py      # Modal testleri
│   └── test_error_handling.py      # Hata yönetimi testleri
└── public/              # Demo görseller (opsiyonel)
```

## 🔌 API Endpoints

### Mock API - Uçuş Arama

```http
GET /api/mock/flights?origin=IST&destination=AYT&departure_date=2025-12-31
```

**Parametreler:**
- `origin` (zorunlu): Kalkış havalimanı kodu (3 harf, örn: IST)
- `destination` (zorunlu): Varış havalimanı kodu (3 harf, örn: AYT)
- `departure_date` (zorunlu): Kalkış tarihi (YYYY-MM-DD)
- `return_date` (opsiyonel): Dönüş tarihi
- `trip_type` (opsiyonel): Yolculuk tipi (one-way, round-trip)

**Örnek Yanıt:**

```json
{
  "flights": [
    {
      "id": "FL123",
      "airline": "Turkish Airlines",
      "flightNumber": "TK123",
      "price": 1250.50,
      "currency": "TRY",
      "departure": "2025-12-31T08:30:00+03:00",
      "arrival": "2025-12-31T10:45:00+03:00",
      "origin": "IST",
      "destination": "AYT",
      "stops": 0,
      "duration_minutes": 135,
      "aircraft": "Airbus A320",
      "policy": "İade edilebilir",
      "available_seats": 45,
      "baggage_allowance": "20kg",
      "cabin_class": "Economy"
    }
  ]
}
```

### Uçuş Detayı

```http
GET /api/flight/<flight_id>
```

Tek bir uçuşun detaylı bilgilerini döndürür.

## ✅ Fonksiyonel Gereksinimler

1. **✅ Arama Formu**: Kullanıcı kalkış, varış, tarih seçimi yapabilir
2. **✅ Sonuç Listesi**: Uçuşlar kart formatında listelenir
3. **✅ Modal Detay**: Her uçuş için detay modal açılabilir
4. **✅ Filtreleme**: Fiyat ve havayoluna göre filtreleme
5. **✅ Sıralama**: Fiyat, kalkış saati, süre sıralaması
6. **✅ Hata Yönetimi**: Boş sonuç ve hata durumları
7. **✅ Responsive**: Mobil-first tasarım
8. **✅ Erişilebilirlik**: ARIA, klavye navigasyonu
9. **✅ Testler**: 6+ otomatik test
10. **✅ Kod Kalitesi**: Black ve Flake8 uyumlu

## 🧩 MYK Seviye 5 Uyumluluk

Bu proje aşağıdaki MYK Yazılım Geliştirici Seviye 5 kriterlerini karşılamaktadır:

### 1. Yazılım Geliştirme Standartları
- ✅ Modüler ve bileşen bazlı mimari
- ✅ Tek sorumluluk prensibi (SRP)
- ✅ Temiz kod prensipleri
- ✅ Kod dokümantasyonu ve yorumlar

### 2. Kod Kalitesi ve Test
- ✅ Otomatik test coverage (%80+)
- ✅ Birim testler (unit tests)
- ✅ Entegrasyon testleri
- ✅ Black kod formatlama standardı
- ✅ Flake8 linting kuralları

### 3. Erişilebilirlik (a11y)
- ✅ WCAG 2.1 Level AA uyumlu
- ✅ ARIA rolleri ve etiketleri
- ✅ Klavye navigasyonu
- ✅ Focus management
- ✅ Screen reader desteği
- ✅ Skip to main content link

### 4. Responsive ve Mobil-First
- ✅ TailwindCSS ile responsive tasarım
- ✅ Mobile-first yaklaşım
- ✅ Farklı ekran boyutları desteği
- ✅ Touch-friendly UI

### 5. Güvenlik
- ✅ Input validasyonu (server-side)
- ✅ XSS koruması (template escaping)
- ✅ CSRF token desteği (Flask built-in)
- ✅ Secure headers

### 6. Performans
- ✅ CDN kullanımı (TailwindCSS, Font Awesome)
- ✅ Lazy loading destekli modal
- ✅ Efficient DOM manipulation
- ✅ Cache mekanizması (flight service)

### 7. Dokümantasyon
- ✅ Kapsamlı README
- ✅ Kod içi yorumlar
- ✅ API dokümantasyonu
- ✅ Kurulum ve çalıştırma adımları

## 🎯 Kabul Kriterleri (Acceptance Criteria)

- [x] Arama formu ile istek gönderildiğinde mock API çağrısı yapılıyor
- [x] Sonuçlar `/flights` sayfasında listeleniyor
- [x] Modal üzerinden ek bilgiler erişilebilir
- [x] Modal klavye ile kapatılabiliyor (ESC tuşu)
- [x] Filtre/sıralama query param'ları ile çalışıyor
- [x] Tüm otomatik testler `pytest` ile geçiyor
- [x] README'de MYK uyumluluğu açık şekilde belirtilmiş
- [x] Kod Black ve Flake8 standartlarına uygun
- [x] Responsive tasarım tüm cihazlarda çalışıyor
- [x] Erişilebilirlik özellikleri implement edilmiş

## 🧪 Test Senaryoları

### 1. Form Render ve Validasyon (`test_search_form.py`)
- Form elemanlarının render edilmesi
- Validasyon fonksiyonlarının çalışması
- Havalimanı kodu kontrolü
- Tarih yardımcı fonksiyonları

### 2. Mock API Testi (`test_api_mock.py`)
- JSON response formatı
- Uçuş veri yapısı
- Eksik parametre kontrolü
- Tarih/saat formatı
- Fiyat formatı

### 3. Uçuş Listesi Render (`test_flight_list_render.py`)
- Sayfa render edilmesi
- Sonuçların gösterilmesi
- Sıralama çalışması
- Filtreleme çalışması
- Boş sonuç durumu

### 4. Uçuş Kartı (`test_flight_card.py`)
- Fiyat görünürlüğü
- Havayolu adı görünürlüğü
- Kalkış/varış saatleri
- Rota bilgisi
- Detay butonu

### 5. Modal Davranışı (`test_modal_behavior.py`)
- Modal HTML varlığı
- Kapatma fonksiyonu
- Erişilebilirlik özellikleri
- API endpoint çalışması
- Klavye erişilebilirlik
- İçerik yapısı

### 6. Hata Yönetimi (`test_error_handling.py`)
- 404 hata sayfası
- Eksik parametre hatası
- Geçersiz tarih formatı
- API hata mesajları
- Uçuş bulunamadı
- Boş sonuç mesajı

## 🔄 Git Workflow

### İlk Commit Mesajı Örneği

```bash
git add .
git commit -m "feat(frontend): Flask tabanlı MYK uyumlu uçak bileti arama önyüzü - mock API, şablonlar, testler"
```

### PR (Pull Request) Açıklaması Örneği

```markdown
## MYK Seviye 5 Uyumlu Flask Frontend Projesi

### Yapılan Değişiklikler
- ✅ Flask + Jinja2 tabanlı frontend yapısı oluşturuldu
- ✅ Mock API endpoint'leri implement edildi
- ✅ TailwindCSS ile responsive tasarım
- ✅ Vanilla JavaScript modal ve etkileşimler
- ✅ 6+ otomatik test eklendi
- ✅ Black ve Flake8 kod kalite kontrolleri
- ✅ WCAG 2.1 erişilebilirlik standartları

### Test Sonuçları
- Tüm testler başarıyla geçti ✅
- Black formatting uyumlu ✅
- Flake8 lint kontrolü temiz ✅

### Ekran Görüntüleri
[Ekran görüntüleri eklenecek]

### Checklist
- [x] Kod review yapıldı
- [x] Testler çalıştırıldı ve geçti
- [x] Dokümantasyon güncellendi
- [x] MYK uyumluluk kontrol edildi
```

## 🛠️ Geliştirme

### Yeni Özellik Ekleme

1. Feature branch oluştur: `git checkout -b feature/yeni-ozellik`
2. Kodu yaz ve testleri ekle
3. Black ile formatla: `black .`
4. Flake8 ile kontrol et: `flake8 .`
5. Testleri çalıştır: `pytest`
6. Commit ve push: `git commit -m "feat: yeni özellik"` && `git push`

### Debug Mode

```python
# main.py'de
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```

## 📞 Destek ve İletişim

- **GitHub Issues**: Sorun bildirimi ve öneriler için
- **E-posta**: [Ekip e-postası]
- **Dokümantasyon**: Bu README dosyası

## 📄 Lisans

Bu proje MYK Seviye 5 eğitim amaçlı geliştirilmiştir.

## 🙏 Teşekkürler

MYK (Mesleki Yeterlilik Kurumu) standartlarına uygun olarak geliştirilmiştir.

---

**Versiyon**: 1.0.0  
**Son Güncelleme**: 2025  
**MYK Seviye**: 5  
**Teknoloji Stack**: Flask, Jinja2, TailwindCSS, Vanilla JS, pytest
