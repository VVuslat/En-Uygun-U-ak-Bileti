# En Uygun Uçak Bileti - Statik Frontend Uçuş Arama Arayüzü

MYK Seviye 5 standartlarına uygun **statik frontend** uçak bileti arama ve takip uygulaması.

> **ÖNEMLİ NOT:** Bu, **yalnızca frontend** bir projedir. Backend, Flask, Jinja veya sunucu tarafı kod içermez. Tüm işlemler client-side JavaScript ile tarayıcıda çalışır.

## ✨ Özellikler

### 🎯 Temel Fonksiyonlar
- ✅ **Statik Frontend**: Sunucu gerektirmeyen, tarayıcıda çalışan uygulama
- ✅ **Uçuş Arama**: Kalkış/varış/tarih ile client-side arama
- ✅ **Mock Data**: JSON dosyasından veri okuma (gerçek API yok)
- ✅ **Filtreleme ve Sıralama**: Fiyat, süre, aktarma, havayolu filtreleri
- ✅ **Detaylı Modal**: Uçuş detaylarını modal pencerede görüntüleme
- ✅ **Responsive Tasarım**: Mobil-first yaklaşım, tüm ekran boyutlarında çalışır

### 🏆 Kalite ve Standartlar
- 🔒 **Client-side Güvenlik**: XSS koruması, input sanitization
- 📝 **Kod Kalitesi**: Modüler ES6 yapısı, JSDoc dokümantasyonu
- 🏗️ **MYK Seviye 5 Uyumluluk**: Profesyonel yazılım geliştirme standartları
- ♿ **Erişilebilirlik (a11y)**: ARIA etiketleri, klavye navigasyonu, focus trap
- 🧪 **Test Coverage**: Vitest ile unit testler
- 📱 **Progressive**: Modern web standartları

## 🛠️ Teknoloji Stack

- **Frontend**: HTML5, CSS3 (Tailwind CSS CDN), Vanilla JavaScript (ES6 Modules)
- **Data**: Mock JSON dosyası (client-side fetch)
- **Testing**: Vitest + jsdom
- **Build**: Statik dosyalar (build işlemi yok)
- **Serve**: npx serve veya herhangi bir statik web sunucusu
- **Icons**: Font Awesome 6

### Neden Backend Yok?
Bu proje **sadece frontend** demonstration için tasarlanmıştır:
- Backend ayrı bir repository'de geliştirilebilir
- API entegrasyonu daha sonra eklenebilir
- Statik hosting'de (GitHub Pages, Netlify, Vercel) kolayca yayınlanabilir
- Client-side rendering ile hızlı prototipleme

## 📦 Kurulum

### Gereksinimler
```bash
Node.js 16+ (sadece dev server için, opsiyonel)
Modern web tarayıcı (Chrome, Firefox, Safari, Edge)
```

### Adım Adım Kurulum

#### 1️⃣ Projeyi Klonlayın
```bash
git clone https://github.com/VVuslat/En-Uygun-U-ak-Bileti.git
cd En-Uygun-U-ak-Bileti
```

#### 2️⃣ Bağımlılıkları Yükleyin (Opsiyonel - sadece test ve dev server için)
```bash
npm install
```

#### 3️⃣ Uygulamayı Başlatın

**Seçenek A: NPM serve ile (önerilen)**
```bash
npm start
# veya
npm run dev
```
Tarayıcınızda `http://localhost:3000` adresini açın.

**Seçenek B: Live Server Extension (VS Code)**
- VS Code'da `index.html` dosyasına sağ tıklayın
- "Open with Live Server" seçeneğini seçin

**Seçenek C: Python ile**
```bash
python -m http.server 8000
```
Tarayıcınızda `http://localhost:8000` adresini açın.

**Seçenek D: Direkt dosya açma**
- `index.html` dosyasını tarayıcınızda açın
- ⚠️ Not: Bazı tarayıcılar CORS nedeniyle mock-data fetch'i engelleyebilir. Live server kullanımı önerilir.
## 🧪 Test Çalıştırma

```bash
# Testleri bir kez çalıştır
npm test

# Watch modunda (değişikliklerde otomatik çalışır)
npm run test:watch

# Test UI ile (tarayıcıda görsel test arayüzü)
npm run test:ui

# Coverage raporu ile
npm run test:coverage
```

## 📁 Proje Yapısı

```
En-Uygun-U-ak-Bileti/
│
├── index.html              # Ana HTML sayfası (giriş noktası)
├── package.json            # NPM yapılandırması ve scriptler
├── vitest.config.js        # Test yapılandırması
│
├── mock-data/              # Mock veri dosyaları
│   └── flights.json        # Örnek uçuş verileri (8 uçuş)
│
├── src/
│   ├── main.js            # Uygulama bootstrap ve koordinasyon
│   │
│   ├── components/        # Modüler bileşenler
│   │   ├── searchForm.js       # Arama formu (render, validation, events)
│   │   ├── flightList.js       # Uçuş listesi (render, states)
│   │   ├── flightCard.js       # Tek uçuş kartı (detail button)
│   │   ├── modal.js            # Erişilebilir modal (ESC, focus trap)
│   │   ├── filters.js          # Filtreleme ve sıralama
│   │   └── utils.js            # Yardımcı fonksiyonlar
│   │
│   ├── styles/            # CSS dosyaları
│   │   └── custom.css          # Tailwind'e ek özel stiller
│   │
│   └── tests/             # Test dosyaları
│       ├── setup.js            # Test ortamı yapılandırması
│       ├── searchForm.test.js  # Form testleri
│       ├── flightList.test.js  # Liste testleri
│       ├── modal.test.js       # Modal testleri
│       └── apiMock.test.js     # API fetch testleri
│
└── public/                # Statik dosyalar (ikonlar vb.)
```

### 📄 Dosya Açıklamaları

#### **index.html**
- Ana HTML sayfası
- Tailwind CSS CDN bağlantısı
- Font Awesome ikonları
- Tüm section container'ları (search, filters, results, modals)
- ES6 module olarak main.js'i yükler

#### **src/main.js**
- Uygulama başlangıç noktası
- Tüm bileşenleri initialize eder
- Mock data fetch işlemini yönetir
- Arama ve filtreleme koordinasyonu
- Global state yönetimi

#### **src/components/searchForm.js**
- Arama formu render
- Client-side validation
- Event handling (submit, input changes)
- Error mesajları gösterimi

#### **src/components/flightList.js**
- Uçuş listesi render
- Loading/empty/error state yönetimi
- Sonuç sayısı gösterimi
- Scroll to results

#### **src/components/flightCard.js**
- Tek uçuş kartı HTML'i
- Detay butonu event handler
- Uçuş bilgilerini formatlar

#### **src/components/modal.js**
- Accessible modal (ARIA attributes)
- ESC tuşu ile kapanma
- Focus trap (Tab navigation)
- Overlay click handling
- Body scroll prevention

#### **src/components/filters.js**
- Filtreleme UI render
- Sıralama: fiyat, kalkış saati, süre
- Filtreler: aktarma, havayolu, max fiyat
- Real-time filter uygulaması

#### **src/components/utils.js**
- formatTime, formatDate, formatPrice
- Form validation
- Debounce function
- Browser support check
- XSS koruması (escapeHtml)

## 🎯 Kullanım Senaryosu

### Adım 1: Arama Yapma
1. Sayfayı açın
2. Kalkış havalimanı girin (örn: IST)
3. Varış havalimanı girin (örn: ADB)
4. Tarih seçin
5. "Ara" butonuna tıklayın

### Adım 2: Sonuçları Görüntüleme
- Uçuşlar listelenir
- Her kartta: havayolu, saatler, fiyat, aktarma bilgisi
- Varsayılan sıralama: Fiyat (düşükten yükseğe)

### Adım 3: Filtreleme
- Sıralama değiştirin (fiyat, süre, kalkış saati)
- Aktarma filtresi (direkt/aktarmalı)
- Havayolu filtresi
- Maksimum fiyat slider'ı

### Adım 4: Detay Görüntüleme
- Karttaki "Detaylar" butonuna tıklayın
- Modal açılır
- Tüm uçuş bilgileri detaylı gösterilir
- ESC tuşu veya X butonu ile kapatın
## 🏆 MYK Seviye 5 Uyumluluk

Bu proje Mesleki Yeterlilik Kurumu (MYK) Seviye 5 standartlarına uygun olarak geliştirilmiştir.

### Kapsanan Yeterlilikler:

#### 1️⃣ **Yazılım Tasarımı ve Mimari**
- ✅ Modüler bileşen yapısı (Single Responsibility Principle)
- ✅ ES6 module sistemi kullanımı
- ✅ Separation of Concerns (arama, listeleme, filtreleme ayrı modüller)
- ✅ Yeniden kullanılabilir kod yapısı

#### 2️⃣ **Kod Kalitesi ve Dokümantasyon**
- ✅ JSDoc ile fonksiyon dokümantasyonu
- ✅ Açıklayıcı değişken ve fonksiyon isimleri
- ✅ Yorum satırları ile kod açıklamaları
- ✅ README ile detaylı proje dokümantasyonu

#### 3️⃣ **Test ve Kalite Güvence**
- ✅ Unit testler (Vitest)
- ✅ Test coverage raporları
- ✅ Edge case handling
- ✅ Error handling ve validation

#### 4️⃣ **Kullanıcı Arayüzü ve Deneyim**
- ✅ Responsive tasarım (mobil-first)
- ✅ Kullanıcı dostu form validasyonu
- ✅ Loading, empty, error state'leri
- ✅ Smooth animations ve transitions

#### 5️⃣ **Erişilebilirlik (a11y)**
- ✅ ARIA etiketleri (role, aria-label, aria-modal)
- ✅ Klavye navigasyonu (Tab, ESC)
- ✅ Focus trap in modals
- ✅ Screen reader uyumluluğu
- ✅ High contrast mode desteği

#### 6️⃣ **Güvenlik**
- ✅ XSS koruması (HTML escaping)
- ✅ Input sanitization
- ✅ Client-side validation
- ✅ Secure coding practices

#### 7️⃣ **Performans**
- ✅ Debounce ile optimizasyon
- ✅ Minimal DOM manipülasyonu
- ✅ Event delegation kullanımı
- ✅ Lazy loading yaklaşımı

#### 8️⃣ **Proje Yönetimi**
- ✅ Versiyon kontrolü (Git)
- ✅ Package management (NPM)
- ✅ Clear commit messages
- ✅ Organized file structure

## 🎤 Sunum İçin Hızlı Demo Adımları

### Demo Akışı (5-7 dakika)

#### 1. Proje Tanıtımı (1 dk)
```
"MYK Seviye 5 uyumlu statik frontend projesi.
Backend yok, tüm işlemler client-side JavaScript ile.
Modern web standartları ve best practices."
```

#### 2. Kod Yapısı Gösterimi (1.5 dk)
```
- Modüler bileşen mimarisi göster (src/components/)
- main.js'te uygulama başlatma logic'i
- utils.js'te helper fonksiyonlar
- "Her bileşen kendi sorumluluğunu yerine getiriyor"
```

#### 3. Canlı Demo (2 dk)
```
1. Sayfayı aç, console'da startup mesajları göster
2. IST -> ADB arama yap
3. Sonuçları göster, bir kartın detaylarını aç
4. Modal'da ESC tuşu ile kapamayı göster
5. Filtreleri kullan (fiyat sıralaması, havayolu filtresi)
```

#### 4. Erişilebilirlik Gösterimi (1 dk)
```
- Tab tuşu ile form navigasyonu
- ARIA etiketlerini browser inspector'da göster
- Modal focus trap'i göster
- "Tüm kullanıcılar için erişilebilir"
```

#### 5. Test ve Kalite (1 dk)
```
- npm test çalıştır
- Test sonuçlarını göster
- Bir test dosyasını aç, nasıl test edildiğini göster
- "Test coverage ve quality assurance önemli"
```

#### 6. MYK Uyumluluk (0.5 dk)
```
README'deki MYK maddelerini göster:
"8 ana yeterlilik kategorisini karşılıyor"
```

### 🎯 Sunumda Vurgulanacak 6 Nokta

1. **"100% Statik Frontend - Backend'siz çalışan modern web uygulaması"**
2. **"Modüler ES6 Bileşen Mimarisi - Her modül tek sorumluluklu"**
3. **"WCAG Uyumlu Erişilebilirlik - Klavye, screen reader, ARIA"**
4. **"Client-side Testler - Vitest ile unit testing ve coverage"**
5. **"Responsive Tasarım - Mobil-first Tailwind CSS kullanımı"**
6. **"MYK Seviye 5 Standartları - 8 yeterlilik kategorisi karşılandı"**
## 🔧 Geliştirme Notları

### Client-Side Veri Yönetimi
- Tüm veriler `mock-data/flights.json` dosyasından gelir
- Gerçek API entegrasyonu için `src/main.js` içindeki `fetchFlights` fonksiyonu değiştirilmelidir
- State management basit değişkenlerle yapılır (kompleks app'ler için Redux/MobX düşünülebilir)

### Tarayıcı Desteği
- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- ES6 modules desteği gerekli
- Fetch API desteği gerekli
- localStorage desteği (gelecek özellikler için)

### Performans İpuçları
- Mock data dosyası küçük tutulmalı (<100KB)
- Büyük listeler için virtual scrolling düşünülebilir
- Debounce ile filter performansı optimize edilmiş

## 🚀 Production Deployment

### GitHub Pages
```bash
# Direkt deploy (root index.html)
# Settings > Pages > Source: main branch
```

### Netlify / Vercel
```bash
# Drag & drop ile deploy
# veya CLI ile:
netlify deploy --prod
vercel --prod
```

### Özel Sunucu
```bash
# Nginx veya Apache ile serve
# Tüm dosyaları web root'a kopyala
```

## 📚 Öğrenme Kaynakları

Bu projede kullanılan kavramlar:
- **ES6 Modules**: Import/Export sistemi
- **Fetch API**: Client-side data fetching
- **DOM Manipulation**: querySelector, innerHTML, createElement
- **Event Handling**: addEventListener, event delegation
- **Async/Await**: Promise-based asynchronous code
- **ARIA**: Accessible Rich Internet Applications
- **Tailwind CSS**: Utility-first CSS framework
- **Vitest**: Modern testing framework

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -am 'Yeni özellik: XYZ'`)
4. Branch'inizi push edin (`git push origin feature/yeni-ozellik`)
5. Pull Request oluşturun

### Geliştirme Guidelines
- Kod yazmadan önce testleri yazın (TDD)
- Her commit tek bir değişiklik içermeli
- Commit mesajları açıklayıcı olmalı
- JSDoc ile fonksiyonları dokümante edin

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👤 İletişim

- **Proje Sahibi**: VVuslat
- **GitHub**: https://github.com/VVuslat/En-Uygun-U-ak-Bileti

## 🎓 Akademik Kullanım

Bu proje MYK Seviye 5 yeterlilikleri için geliştirilmiştir ve eğitim amaçlı kullanılabilir.

### Öğrenciler için notlar:
- Her dosyanın başında "ne işe yarar" açıklaması var
- Fonksiyonlar JSDoc ile dokümante edilmiş
- Testler nasıl yazılır örneklerle gösterilmiş
- Best practices uygulanmış

## 🔍 SSS (Sık Sorulan Sorular)

**S: Neden backend yok?**
A: Bu, frontend becerilerini ve client-side JavaScript'i göstermek için tasarlanmış bir projedir. Backend ayrı geliştirilebilir.

**S: Gerçek API nasıl entegre edilir?**
A: `src/main.js` içindeki `fetchFlights` fonksiyonunu gerçek API endpoint'i ile güncelleyin.

**S: Veriler kalıcı değil mi?**
A: Hayır, tüm veriler mock JSON'dan gelir ve sayfa yenilendiğinde sıfırlanır. LocalStorage ile kalıcılık eklenebilir.

**S: Production'da kullanılabilir mi?**
A: Evet, statik hosting'e deploy edilebilir. Ancak gerçek uygulama için backend ve database gerekir.

**S: Mobilde çalışır mı?**
A: Evet, responsive tasarım sayesinde tüm cihazlarda çalışır.

## 📊 Proje İstatistikleri

- **Toplam Dosya Sayısı**: ~15
- **Kod Satırı**: ~2000 (yorumlar dahil)
- **Bileşen Sayısı**: 6 ana bileşen
- **Test Sayısı**: 20+ test case
- **Mock Uçuş Verisi**: 8 farklı uçuş

---

**Son Güncelleme**: 2024
**Versiyon**: 1.0.0
**Durum**: ✅ Production Ready (Frontend Only)
