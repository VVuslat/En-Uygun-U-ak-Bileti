# En Uygun Uçak Bileti - Most Affordable Flight Ticket

Bu uygulama sayesinde gitmek istediğiniz bölgeye giden en uygun uçak biletlerini tarayıp yönlendirme linki ile seçtiğiniz biletin satın alma sayfasına gidebilirsiniz.

## Proje Mimarisi

### Modüller

#### 1. Kullanıcı Yönetimi (User Management)
- **Dosya**: `modules/user_management.py`
- **Özellikler**:
  - Kullanıcı kaydı ve girişi
  - Şifre doğrulama ve güvenlik
  - Kullanıcı profil yönetimi
  - Oturum yönetimi

#### 2. Uçuş Arama (Flight Search)
- **Dosya**: `modules/flight_search.py`
- **Özellikler**:
  - Çoklu havayolu karşılaştırması
  - Fiyat ve süre filtreleme
  - Popüler rota önerileri
  - Fiyat trend analizi

#### 3. API Entegrasyonu (API Integration)
- **Dosya**: `modules/api_integration.py`
- **Özellikler**:
  - Amadeus API entegrasyonu
  - Skyscanner API entegrasyonu
  - THY API entegrasyonu
  - Pegasus API entegrasyonu
  - Hata yönetimi ve fallback

#### 4. Veri Analizi (Data Analysis)
- **Dosya**: `modules/data_analysis.py`
- **Özellikler**:
  - Uçuş puanlama sistemi
  - Fiyat kategorizasyonu
  - Trend analizi
  - İstatistiksel öneriler

#### 5. Bildirim Servisi (Notification Service)
- **Dosya**: `modules/notification_service.py`
- **Özellikler**:
  - E-posta bildirimleri
  - SMS bildirimleri
  - Push bildirimleri
  - Fiyat uyarıları
  - Uçuş hatırlatmaları

## Kurulum

### Gereksinimler
```bash
pip install -r requirements.txt
```

### Çevre Değişkenleri
`.env` dosyasını oluşturun ve aşağıdaki değişkenleri ayarlayın:

```env
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///flight_app.db

# API Keys
AMADEUS_API_KEY=your-amadeus-api-key
SKYSCANNER_API_KEY=your-skyscanner-api-key
THY_API_KEY=your-thy-api-key
PEGASUS_API_KEY=your-pegasus-api-key

# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_ADDRESS=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Uygulamayı Çalıştırma
```bash
python app.py
```

## API Endpoints

### Uçuş Arama
- `GET /` - Ana sayfa
- `GET /search` - Arama formu
- `POST /search` - Uçuş arama
- `GET /api/flights` - API uçuş arama

### Kullanıcı İşlemleri
- `GET /register` - Kayıt formu
- `POST /register` - Kullanıcı kaydı
- `GET /login` - Giriş formu
- `POST /login` - Kullanıcı girişi
- `GET /dashboard` - Kullanıcı paneli

### Bildirimler
- `GET /notifications` - Bildirim ayarları
- `POST /api/notify` - Bildirim gönderme

## Teknoloji Stack

### Backend
- **Python 3.x** - Ana programlama dili
- **Flask** - Web framework
- **SQLAlchemy** - ORM ve veritabanı yönetimi
- **Flask-Login** - Kullanıcı oturum yönetimi

### Frontend
- **HTML5** - Yapı
- **Bootstrap 5** - CSS framework
- **JavaScript** - İnteraktif özellikler
- **Chart.js** - Grafik görselleştirme (planlanan)

### Veritabanı
- **SQLite** - Geliştirme ortamı
- **PostgreSQL** - Üretim ortamı (planlanan)

### API Entegrasyonları
- **Amadeus** - Uçuş verileri
- **Skyscanner** - Fiyat karşılaştırması
- **THY** - Turkish Airlines
- **Pegasus** - Pegasus Airlines

## Özellikler

### 🔍 Akıllı Arama
- Çoklu havayolu karşılaştırması
- Fiyat, süre ve kalite skorlaması
- Filtreleme ve sıralama seçenekleri

### 💰 Fiyat Takibi
- Otomatik fiyat izleme
- E-posta ve SMS uyarıları
- Trend analizi ve tahminler

### 👤 Kullanıcı Deneyimi
- Kişiselleştirilmiş öneriler
- Arama geçmişi
- Favoriler ve watch listesi

### 📊 Analytics
- Fiyat trend grafikleri
- Popüler rotalar
- En iyi rezervasyon zamanları

## Katkıda Bulunma

1. Repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'i push edin (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## İletişim

Proje hakkında sorularınız için lütfen issue açın veya iletişime geçin.
