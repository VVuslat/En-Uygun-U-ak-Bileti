# En Uygun Uçak Bileti - Frontend

MYK Yazılım Geliştirici Seviye 5 standardına uygun, modern ve erişilebilir uçak bileti arama uygulaması.

## 📝 Proje Açıklaması

Bu proje, React, TypeScript ve TailwindCSS kullanılarak geliştirilmiş kapsamlı bir uçak bileti arama ve karşılaştırma platformudur. Kullanıcılar kalkış-varış noktaları, tarih seçimi yaparak mock API üzerinden uçuş arayabilir, sonuçları filtreleyip sıralayabilir ve detaylı bilgilere erişebilir.

## ✨ Özellikler

- **Arama Formu**: Tek yön ve gidiş-dönüş seçenekleri ile kapsamlı arama
- **Uçuş Listesi**: Fiyat, kalkış saati ve aktarma sayısına göre sıralanabilir sonuçlar
- **Filtreleme**: Fiyat aralığı ve direkt uçuş filtreleri
- **Detay Modalı**: Her uçuş için kapsamlı bilgi görüntüleme
- **Responsive Tasarım**: Mobil-first yaklaşımla tüm cihazlarda uyumlu
- **Erişilebilirlik (a11y)**: ARIA rolleri, klavye navigasyonu ve ekran okuyucu desteği
- **Mock API**: Gerçekçi veri simülasyonu ile test ve geliştirme

## 🛠️ Teknoloji Stack

- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Styling**: TailwindCSS 4.0
- **Type Safety**: TypeScript 5.x
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint + Prettier
- **Mock API**: Custom MSW-style mock server

## 📦 Kurulum

### Gereksinimler

- Node.js 18.x veya üzeri
- npm veya yarn package manager

### Adımlar

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Tarayıcıda http://localhost:5173 adresini açın
```

## 🚀 Kullanılabilir Komutlar

```bash
# Geliştirme sunucusu (hot reload)
npm run dev

# Production build
npm run build

# Build önizlemesi
npm run preview

# Testleri çalıştır
npm test

# Test UI (interaktif)
npm run test:ui

# Test coverage raporu
npm run test:coverage

# Lint kontrolü
npm run lint

# Kod formatlama
npm run format
```

## 📂 Proje Yapısı

```
src/
├── api/                      # API katmanı
│   ├── flightService.ts      # API çağrı servisleri
│   └── mockServer.ts         # Mock veri üretici
├── components/               # React bileşenleri
│   ├── SearchForm/          # Arama formu
│   ├── FlightList/          # Uçuş listesi
│   ├── FlightCard/          # Tek uçuş kartı
│   ├── FlightDetailModal/   # Detay modalı
│   └── Shared/              # Paylaşılan bileşenler
│       ├── Button.tsx
│       └── Input.tsx
├── hooks/                    # Custom React hooks
│   └── useFlights.ts         # Uçuş arama state yönetimi
├── types/                    # TypeScript tip tanımları
│   └── flight.d.ts
├── utils/                    # Yardımcı fonksiyonlar
│   └── formatters.ts         # Tarih/para formatları
├── tests/                    # Test konfigürasyonu
│   └── setup.js
├── App.tsx                   # Ana uygulama bileşeni
└── index.tsx                 # Uygulama giriş noktası
```

## 🧪 Testler

Proje 19 kapsamlı test içermektedir:

### Test Kategorileri

1. **SearchForm Tests (5 test)**
   - Form elemanlarının renderlanması
   - Input değişikliklerinin işlenmesi
   - Form gönderimi ve veri doğrulama
   - Yükleme durumu gösterimi
   - Tek yön / gidiş-dönüş geçişi

2. **FlightCard Tests (4 test)**
   - Uçuş bilgilerinin görüntülenmesi
   - Fiyat ve havayolu gösterimi
   - Direkt uçuş / aktarma göstergesi
   - Detay butonu etkileşimi

3. **FlightList Tests (5 test)**
   - Boş durum gösterimi
   - Uçuş listesi renderı
   - Fiyata göre sıralama
   - Direkt uçuş filtresi
   - Sıralama değişiklikleri

4. **FlightDetailModal Tests (5 test)**
   - Modal açılma/kapanma
   - Uçuş detaylarının gösterimi
   - ESC tuşu ile kapatma
   - Backdrop tıklama ile kapatma
   - Erişilebilirlik özellikleri

### Testleri Çalıştırma

```bash
# Tüm testler
npm test

# Watch mode (geliştirme)
npm test -- --watch

# Coverage raporu
npm run test:coverage
```

## 🎯 MYK Seviye 5 Uyumluluk

### Teknik Standartlar

✅ **Kod Kalitesi**
- TypeScript ile tip güvenliği
- ESLint ile statik kod analizi
- Prettier ile tutarlı kod formatı
- Kapsamlı kod yorumları (TR + EN)

✅ **Test Coverage**
- 19 birim/entegrasyon testi
- %100 kritik yol coverage
- Component-based test organizasyonu
- Mock API ile izole testler

✅ **Mimari**
- Component-based architecture
- Single Responsibility Principle
- Separation of Concerns (API, UI, Utils)
- Custom hooks ile state yönetimi

✅ **Erişilebilirlik**
- WCAG 2.1 AA standartları
- ARIA rolleri ve etiketler
- Klavye navigasyonu
- Ekran okuyucu desteği
- Semantic HTML

✅ **Performans**
- Code splitting hazır
- Lazy loading desteği
- Optimized bundle size
- Memoization (useMemo)

✅ **Responsive Design**
- Mobile-first yaklaşım
- Breakpoint-based grid system
- Touch-friendly interface
- Flexible layouts

### Dokümantasyon

✅ **Kod Dokümantasyonu**
- JSDoc yorumları
- İki dilli açıklamalar (TR/EN)
- Prop types ve interface tanımları
- Fonksiyon açıklamaları

✅ **Proje Dokümantasyonu**
- Kapsamlı README
- Kurulum talimatları
- API dokümantasyonu
- Test senaryoları

## 🔒 Güvenlik

- XSS koruması (React otomatik escape)
- CSRF token hazır (backend entegrasyonu için)
- Input validation
- Secure dependencies (npm audit)

## 📊 Performans Optimizasyonları

- Virtual DOM (React)
- Component memoization
- Efficient re-rendering
- Optimized asset loading
- CSS purging (TailwindCSS)

## 🌐 Tarayıcı Desteği

- Chrome (son 2 versiyon)
- Firefox (son 2 versiyon)
- Safari (son 2 versiyon)
- Edge (son 2 versiyon)

## 🤝 Katkıda Bulunma

### Pull Request Süreci

1. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
2. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
3. Branch'inizi push edin (`git push origin feature/amazing-feature`)
4. Pull Request açın

### Kabul Kriterleri

- ✅ Tüm testler geçmeli (`npm test`)
- ✅ Lint hatası olmamalı (`npm run lint`)
- ✅ Build başarılı olmalı (`npm run build`)
- ✅ Yeni özellikler için test eklenmeli
- ✅ README güncellenmiş olmalı

### Commit Mesajları

Conventional Commits formatı kullanın:

```
feat: Yeni özellik ekleme
fix: Hata düzeltme
docs: Dokümantasyon değişikliği
style: Kod formatı değişikliği
refactor: Kod refactoring
test: Test ekleme/düzeltme
chore: Bakım işleri
```

## 📝 API Entegrasyonu

### Mock API Örneği

```typescript
// Example mock response
{
  "flights": [
    {
      "id": "FL123",
      "airline": "Turkish Airlines",
      "price": 1250.50,
      "currency": "TRY",
      "departure": "2025-10-10T08:30:00+03:00",
      "arrival": "2025-10-10T10:45:00+03:00",
      "stops": 0,
      "flightNumber": "TK123",
      "aircraft": "A320",
      "policy": "İade edilebilir",
      "origin": "IST",
      "destination": "ESB"
    }
  ]
}
```

### Gerçek API Entegrasyonu

`src/api/flightService.ts` dosyasında mock fonksiyonları gerçek API çağrıları ile değiştirin:

```typescript
export const searchFlights = async (params: SearchParams) => {
  const response = await fetch('/api/flights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return response.json();
};
```

## 🐛 Bilinen Sorunlar

- Mock API kullanıldığı için gerçek uçuş verileri yok
- Ödeme entegrasyonu henüz implementasyonda yok
- Kullanıcı hesapları ve favoriler özelliği planlanıyor

## 🗺️ Roadmap

- [ ] Gerçek API entegrasyonu
- [ ] Kullanıcı profili ve favoriler
- [ ] Çoklu dil desteği (i18n)
- [ ] PWA özellikleri
- [ ] Fiyat takibi ve bildirimler
- [ ] Karşılaştırma özelliği
- [ ] Harita entegrasyonu

## 📄 Lisans

MIT License - detaylar için LICENSE dosyasına bakın.

## 👥 İletişim

Proje Sahibi: VVuslat
Repository: https://github.com/VVuslat/En-Uygun-U-ak-Bileti

## 🙏 Teşekkürler

Bu proje MYK Yazılım Geliştirici Seviye 5 standartlarına uygun olarak geliştirilmiştir.

---

**Not**: Bu uygulama eğitim ve demo amaçlıdır. Production kullanımı için ek güvenlik ve performans optimizasyonları gereklidir.
