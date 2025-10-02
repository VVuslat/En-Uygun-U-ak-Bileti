"""
User Management Module
Kullanıcı yönetimi modülü
"""

import re
import hashlib

class UserMixin:
    """User mixin for basic user functionality"""
    def __init__(self, user_id, email, name, password_hash):
        self.id = user_id
        self.email = email
        self.name = name
        self.password_hash = password_hash
        self.is_authenticated = True
        self.is_active = True
        self.is_anonymous = False

    def get_id(self):
        return str(self.id)

class User(UserMixin):
    """User model for database"""
    pass

def generate_password_hash(password):
    """Generate password hash"""
    return hashlib.sha256(password.encode()).hexdigest()

def check_password_hash(hash_value, password):
    """Check password hash"""
    return hash_value == hashlib.sha256(password.encode()).hexdigest()

def login_user(user):
    """Mock login user function"""
    print(f"User {user.email} logged in")

def logout_user():
    """Mock logout user function"""
    print("User logged out")

class UserManager:
    """Kullanıcı yönetimi sınıfı - User management class"""
    
    def __init__(self, db):
        self.db = db
        self.users = {}  # Simple in-memory storage for demo
        
    def create_user(self, email, password, name):
        """Yeni kullanıcı oluştur - Create new user"""
        # Validate email format
        if not self._validate_email(email):
            return False, "Geçersiz email formatı"
        
        # Check if user already exists
        if email in self.users:
            return False, "Bu email adresi zaten kullanımda"
        
        # Validate password strength
        if not self._validate_password(password):
            return False, "Şifre en az 6 karakter olmalı"
        
        # Create user
        user_id = len(self.users) + 1
        password_hash = generate_password_hash(password)
        
        user = User(user_id, email, name, password_hash)
        self.users[email] = user
        
        return True, "Kullanıcı başarıyla oluşturuldu"
    
    def authenticate_user(self, email, password):
        """Kullanıcı doğrula - Authenticate user"""
        if email not in self.users:
            return False, None
        
        user = self.users[email]
        if check_password_hash(user.password_hash, password):
            login_user(user)
            return True, user
        
        return False, None
    
    def get_user_by_id(self, user_id):
        """ID ile kullanıcı getir - Get user by ID"""
        for user in self.users.values():
            if str(user.id) == str(user_id):
                return user
        return None
    
    def get_user_by_email(self, email):
        """Email ile kullanıcı getir - Get user by email"""
        return self.users.get(email)
    
    def update_user(self, email, **kwargs):
        """Kullanıcı bilgilerini güncelle - Update user information"""
        if email not in self.users:
            return False, "Kullanıcı bulunamadı"
        
        user = self.users[email]
        for key, value in kwargs.items():
            if hasattr(user, key):
                setattr(user, key, value)
        
        return True, "Kullanıcı bilgileri güncellendi"
    
    def delete_user(self, email):
        """Kullanıcıyı sil - Delete user"""
        if email in self.users:
            del self.users[email]
            return True, "Kullanıcı silindi"
        return False, "Kullanıcı bulunamadı"
    
    def _validate_email(self, email):
        """Email formatını doğrula - Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    def _validate_password(self, password):
        """Şifre gücünü doğrula - Validate password strength"""
        return len(password) >= 6