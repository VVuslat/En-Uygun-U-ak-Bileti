"""
Input validation utilities.
Implements MYK Level 5 data validation standards.
"""

import re
from datetime import date, datetime


def validate_email(email):
    """Validate email format."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_password(password):
    """Validate password strength according to security standards."""
    errors = []
    
    if len(password) < 8:
        errors.append('Şifre en az 8 karakter olmalıdır.')
    
    if not re.search(r'[A-Z]', password):
        errors.append('Şifre en az bir büyük harf içermelidir.')
    
    if not re.search(r'[a-z]', password):
        errors.append('Şifre en az bir küçük harf içermelidir.')
    
    if not re.search(r'[0-9]', password):
        errors.append('Şifre en az bir rakam içermelidir.')
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        errors.append('Şifre en az bir özel karakter içermelidir.')
    
    # Check for common weak passwords
    common_passwords = [
        '12345678', 'password', '123456789', 'qwerty123',
        'abc123456', 'password123', '12345abc'
    ]
    
    if password.lower() in common_passwords:
        errors.append('Bu şifre çok yaygın kullanılmaktadır. Daha güçlü bir şifre seçin.')
    
    return errors


def validate_airport_code(code):
    """Validate IATA airport code format."""
    if not code or len(code) != 3:
        return False
    
    # Check if all characters are letters
    return code.isalpha()


def validate_date_range(departure_date, return_date=None):
    """Validate flight date range."""
    errors = []
    
    # Check if departure date is in the future
    if departure_date <= date.today():
        errors.append('Gidiş tarihi bugünden sonra olmalıdır.')
    
    # Check if departure date is not too far in the future (1 year max)
    max_date = date.today().replace(year=date.today().year + 1)
    if departure_date > max_date:
        errors.append('Gidiş tarihi 1 yıldan fazla ileri olamaz.')
    
    # If return date is provided, validate it
    if return_date:
        if return_date <= departure_date:
            errors.append('Dönüş tarihi gidiş tarihinden sonra olmalıdır.')
        
        if return_date > max_date:
            errors.append('Dönüş tarihi 1 yıldan fazla ileri olamaz.')
    
    return errors


def sanitize_input(text):
    """Sanitize user input to prevent XSS and injection attacks."""
    if not text:
        return text
    
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    
    # Remove potentially dangerous characters
    text = re.sub(r'[<>"\']', '', text)
    
    # Trim whitespace
    text = text.strip()
    
    return text


def validate_phone_number(phone):
    """Validate Turkish phone number format."""
    # Remove all non-digit characters
    phone = re.sub(r'[^\d]', '', phone)
    
    # Check Turkish mobile number format
    if phone.startswith('90'):
        phone = phone[2:]
    
    if phone.startswith('0'):
        phone = phone[1:]
    
    # Turkish mobile numbers start with 5 and have 10 digits total
    pattern = r'^5[0-9]{9}$'
    return re.match(pattern, phone) is not None