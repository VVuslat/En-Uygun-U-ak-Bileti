"""
Formatters - Veri formatlama yardımcı fonksiyonları
Tarih, saat, para birimi ve süre formatlama
"""

from datetime import datetime
from typing import Union


def format_currency(amount: Union[float, int], currency: str = "TRY") -> str:
    """
    Para birimi formatlama

    Args:
        amount: Miktar
        currency: Para birimi kodu

    Returns:
        Formatlanmış para birimi metni

    Examples:
        >>> format_currency(1250.50, 'TRY')
        '1.250,50 TRY'
        >>> format_currency(1000, 'USD')
        '1.000,00 USD'
    """
    if not isinstance(amount, (int, float)):
        return f"0,00 {currency}"

    # Türk formatında (nokta binlik ayırıcı, virgül ondalık ayırıcı)
    formatted = f"{amount:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")

    return f"{formatted} {currency}"


def format_datetime(dt_string: str, format_type: str = "full") -> str:
    """
    Tarih/saat formatlama

    Args:
        dt_string: ISO format tarih/saat string
        format_type: Format tipi (full, date, time, short)

    Returns:
        Formatlanmış tarih/saat metni

    Examples:
        >>> format_datetime('2025-10-10T08:30:00+03:00', 'full')
        '10 Ekim 2025, 08:30'
        >>> format_datetime('2025-10-10T08:30:00+03:00', 'time')
        '08:30'
    """
    if not dt_string:
        return ""

    try:
        # ISO formatını parse et
        if "+" in dt_string:
            dt_string = dt_string.split("+")[0]
        if "T" in dt_string:
            dt = datetime.strptime(dt_string, "%Y-%m-%dT%H:%M:%S")
        else:
            dt = datetime.strptime(dt_string, "%Y-%m-%d %H:%M:%S")

        # Türkçe ay isimleri
        months_tr = {
            1: "Ocak",
            2: "Şubat",
            3: "Mart",
            4: "Nisan",
            5: "Mayıs",
            6: "Haziran",
            7: "Temmuz",
            8: "Ağustos",
            9: "Eylül",
            10: "Ekim",
            11: "Kasım",
            12: "Aralık",
        }

        if format_type == "full":
            return f"{dt.day} {months_tr[dt.month]} {dt.year}, {dt.strftime('%H:%M')}"
        elif format_type == "date":
            return f"{dt.day} {months_tr[dt.month]} {dt.year}"
        elif format_type == "time":
            return dt.strftime("%H:%M")
        elif format_type == "short":
            return f"{dt.day:02d}.{dt.month:02d}.{dt.year} {dt.strftime('%H:%M')}"
        else:
            return dt.strftime("%Y-%m-%d %H:%M")

    except (ValueError, AttributeError):
        return dt_string


def format_duration(minutes: Union[int, float]) -> str:
    """
    Süre formatlama (dakikadan saat:dakika formatına)

    Args:
        minutes: Toplam dakika

    Returns:
        Formatlanmış süre metni

    Examples:
        >>> format_duration(120)
        '2s 0d'
        >>> format_duration(185)
        '3s 5d'
    """
    if not isinstance(minutes, (int, float)) or minutes < 0:
        return "0s 0d"

    hours = int(minutes // 60)
    mins = int(minutes % 60)

    return f"{hours}s {mins}d"


def format_date_input(date_string: str) -> str:
    """
    HTML date input için tarih formatlama

    Args:
        date_string: Tarih string (çeşitli formatlar)

    Returns:
        YYYY-MM-DD formatında tarih

    Examples:
        >>> format_date_input('10.10.2025')
        '2025-10-10'
    """
    if not date_string:
        return ""

    try:
        # Farklı formatları dene
        for fmt in ["%Y-%m-%d", "%d.%m.%Y", "%d/%m/%Y", "%Y/%m/%d"]:
            try:
                dt = datetime.strptime(date_string, fmt)
                return dt.strftime("%Y-%m-%d")
            except ValueError:
                continue

        return date_string

    except Exception:
        return date_string


def format_time_range(departure: str, arrival: str) -> str:
    """
    Zaman aralığı formatlama

    Args:
        departure: Kalkış zamanı
        arrival: Varış zamanı

    Returns:
        Formatlanmış zaman aralığı

    Examples:
        >>> format_time_range('2025-10-10T08:30:00', '2025-10-10T10:30:00')
        '08:30 - 10:30'
    """
    dep_time = format_datetime(departure, "time")
    arr_time = format_datetime(arrival, "time")

    if dep_time and arr_time:
        return f"{dep_time} - {arr_time}"

    return ""
