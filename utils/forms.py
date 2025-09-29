"""
Simple forms implementation without Flask-WTF to avoid compatibility issues.
Implements MYK Level 5 form validation standards.
"""

from flask import request
from utils.validators import validate_email, validate_password, validate_airport_code, validate_date_range
from datetime import date, timedelta


class BaseForm:
    """Base form class with common functionality."""
    
    def __init__(self, data=None):
        self.data = data or request.form
        self.errors = {}
    
    def validate(self):
        """Validate form data."""
        self.errors = {}
        return len(self.errors) == 0
    
    def add_error(self, field, message):
        """Add an error to a field."""
        if field not in self.errors:
            self.errors[field] = []
        self.errors[field].append(message)


class LoginForm(BaseForm):
    """Login form."""
    
    def validate(self):
        super().validate()
        
        email = self.data.get('email', '').strip()
        password = self.data.get('password', '')
        
        if not email:
            self.add_error('email', 'E-posta adresi gerekli.')
        elif not validate_email(email):
            self.add_error('email', 'Geçerli bir e-posta adresi girin.')
        
        if not password:
            self.add_error('password', 'Şifre gerekli.')
        
        return len(self.errors) == 0


class RegistrationForm(BaseForm):
    """User registration form."""
    
    def validate(self):
        super().validate()
        
        first_name = self.data.get('first_name', '').strip()
        last_name = self.data.get('last_name', '').strip()
        email = self.data.get('email', '').strip()
        password = self.data.get('password', '')
        password_confirm = self.data.get('password_confirm', '')
        
        if not first_name:
            self.add_error('first_name', 'Ad gerekli.')
        elif len(first_name) < 2 or len(first_name) > 50:
            self.add_error('first_name', 'Ad 2-50 karakter arası olmalı.')
        
        if not last_name:
            self.add_error('last_name', 'Soyad gerekli.')
        elif len(last_name) < 2 or len(last_name) > 50:
            self.add_error('last_name', 'Soyad 2-50 karakter arası olmalı.')
        
        if not email:
            self.add_error('email', 'E-posta adresi gerekli.')
        elif not validate_email(email):
            self.add_error('email', 'Geçerli bir e-posta adresi girin.')
        elif len(email) > 120:
            self.add_error('email', 'E-posta adresi çok uzun.')
        
        if not password:
            self.add_error('password', 'Şifre gerekli.')
        else:
            password_errors = validate_password(password)
            for error in password_errors:
                self.add_error('password', error)
        
        if not password_confirm:
            self.add_error('password_confirm', 'Şifre onayı gerekli.')
        elif password != password_confirm:
            self.add_error('password_confirm', 'Şifreler eşleşmiyor.')
        
        return len(self.errors) == 0


class FlightSearchForm(BaseForm):
    """Flight search form."""
    
    def validate(self):
        super().validate()
        
        origin = self.data.get('origin', '').strip().upper()
        destination = self.data.get('destination', '').strip().upper()
        departure_date_str = self.data.get('departure_date', '')
        return_date_str = self.data.get('return_date', '')
        passenger_count_str = self.data.get('passenger_count', '1')
        max_price_str = self.data.get('max_price', '')
        
        if not origin:
            self.add_error('origin', 'Kalkış havalimanı gerekli.')
        elif len(origin) != 3:
            self.add_error('origin', 'Havalimanı kodu 3 karakter olmalı.')
        elif not validate_airport_code(origin):
            self.add_error('origin', 'Geçerli bir havalimanı kodu girin.')
        
        if not destination:
            self.add_error('destination', 'Varış havalimanı gerekli.')
        elif len(destination) != 3:
            self.add_error('destination', 'Havalimanı kodu 3 karakter olmalı.')
        elif not validate_airport_code(destination):
            self.add_error('destination', 'Geçerli bir havalimanı kodu girin.')
        
        if origin and destination and origin == destination:
            self.add_error('destination', 'Varış havalimanı kalkış havalimanından farklı olmalı.')
        
        # Date validation
        departure_date = None
        return_date = None
        
        if not departure_date_str:
            self.add_error('departure_date', 'Gidiş tarihi gerekli.')
        else:
            try:
                departure_date = date.fromisoformat(departure_date_str)
            except ValueError:
                self.add_error('departure_date', 'Geçerli bir tarih girin.')
        
        if return_date_str:
            try:
                return_date = date.fromisoformat(return_date_str)
            except ValueError:
                self.add_error('return_date', 'Geçerli bir tarih girin.')
        
        if departure_date:
            date_errors = validate_date_range(departure_date, return_date)
            for error in date_errors:
                self.add_error('departure_date', error)
        
        # Passenger count validation
        try:
            passenger_count = int(passenger_count_str)
            if passenger_count < 1 or passenger_count > 9:
                self.add_error('passenger_count', 'Yolcu sayısı 1-9 arası olmalı.')
        except ValueError:
            self.add_error('passenger_count', 'Geçerli bir yolcu sayısı girin.')
        
        # Max price validation (optional)
        if max_price_str:
            try:
                max_price = float(max_price_str)
                if max_price < 0:
                    self.add_error('max_price', 'Fiyat negatif olamaz.')
            except ValueError:
                self.add_error('max_price', 'Geçerli bir fiyat girin.')
        
        return len(self.errors) == 0