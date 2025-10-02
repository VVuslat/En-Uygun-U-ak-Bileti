"""
Search Form - Uçuş arama formu
Basit form validasyonu ve yardımcı fonksiyonlar
"""

from datetime import datetime, timedelta


class SearchForm:
    """Uçuş arama formu sınıfı"""

    # Popüler havalimanları
    POPULAR_AIRPORTS = {
        "IST": "İstanbul Havalimanı",
        "SAW": "Sabiha Gökçen Havalimanı",
        "ESB": "Esenboğa Havalimanı (Ankara)",
        "ADB": "Adnan Menderes Havalimanı (İzmir)",
        "AYT": "Antalya Havalimanı",
        "DLM": "Dalaman Havalimanı",
        "BJV": "Bodrum Havalimanı",
        "GZT": "Gaziantep Havalimanı",
        "TZX": "Trabzon Havalimanı",
        "ASR": "Kayseri Havalimanı",
    }

    def __init__(self):
        """Form başlatma"""
        self.errors = {}

    def validate(self, data: dict) -> bool:
        """
        Form verilerini doğrula

        Args:
            data: Form verileri

        Returns:
            Validasyon başarılı mı?
        """
        self.errors = {}

        # Kalkış havalimanı kontrolü
        if not data.get("origin"):
            self.errors["origin"] = "Kalkış havalimanı gereklidir"
        elif len(data["origin"]) != 3:
            self.errors["origin"] = "Havalimanı kodu 3 karakter olmalıdır"

        # Varış havalimanı kontrolü
        if not data.get("destination"):
            self.errors["destination"] = "Varış havalimanı gereklidir"
        elif len(data["destination"]) != 3:
            self.errors["destination"] = "Havalimanı kodu 3 karakter olmalıdır"

        # Aynı havalimanı kontrolü
        if (
            data.get("origin")
            and data.get("destination")
            and data["origin"].upper() == data["destination"].upper()
        ):
            self.errors["destination"] = "Kalkış ve varış havalimanı aynı olamaz"

        # Tarih kontrolü
        if not data.get("departure_date"):
            self.errors["departure_date"] = "Kalkış tarihi gereklidir"
        else:
            try:
                dep_date = datetime.strptime(data["departure_date"], "%Y-%m-%d")
                today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)

                if dep_date < today:
                    self.errors["departure_date"] = "Kalkış tarihi geçmiş olamaz"
            except ValueError:
                self.errors["departure_date"] = "Geçersiz tarih formatı"

        # Dönüş tarihi kontrolü (varsa)
        if data.get("trip_type") == "round-trip" and data.get("return_date"):
            try:
                ret_date = datetime.strptime(data["return_date"], "%Y-%m-%d")
                dep_date = datetime.strptime(data["departure_date"], "%Y-%m-%d")

                if ret_date < dep_date:
                    self.errors["return_date"] = "Dönüş tarihi kalkış tarihinden önce olamaz"
            except ValueError:
                self.errors["return_date"] = "Geçersiz tarih formatı"

        return len(self.errors) == 0

    @staticmethod
    def get_min_date() -> str:
        """Minimum tarih (bugün)"""
        return datetime.now().strftime("%Y-%m-%d")

    @staticmethod
    def get_default_date() -> str:
        """Varsayılan tarih (1 hafta sonra)"""
        return (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d")
