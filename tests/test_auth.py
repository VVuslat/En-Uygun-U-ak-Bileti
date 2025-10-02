"""
Tests for authentication functionality.
"""

import pytest
from models.models import User
from app import db


def test_user_registration(client):
    """Test user registration."""
    response = client.post('/auth/register', data={
        'first_name': 'John',
        'last_name': 'Doe',
        'email': 'john@example.com',
        'password': 'SecurePass123!',
        'password_confirm': 'SecurePass123!'
    })
    
    assert response.status_code == 302  # Redirect after successful registration
    
    # Check if user was created
    user = User.query.filter_by(email='john@example.com').first()
    assert user is not None
    assert user.first_name == 'John'
    assert user.last_name == 'Doe'


def test_user_login(client, test_user):
    """Test user login."""
    response = client.post('/auth/login', data={
        'email': 'test@example.com',
        'password': 'TestPassword123!'
    })
    
    assert response.status_code == 302  # Redirect after successful login


def test_invalid_login(client):
    """Test login with invalid credentials."""
    response = client.post('/auth/login', data={
        'email': 'invalid@example.com',
        'password': 'wrongpassword'
    })
    
    assert response.status_code == 200  # Stay on login page
    assert 'Geçersiz e-posta veya şifre'.encode('utf-8') in response.data


def test_password_validation():
    """Test password validation function."""
    from utils.validators import validate_password
    
    # Test weak password
    errors = validate_password('weak')
    assert len(errors) > 0
    
    # Test strong password
    errors = validate_password('StrongPass123!')
    assert len(errors) == 0


def test_email_validation():
    """Test email validation function."""
    from utils.validators import validate_email
    
    assert validate_email('test@example.com') == True
    assert validate_email('invalid-email') == False
    assert validate_email('test@') == False


class TestUserModel:
    """Test User model functionality."""
    
    def test_password_hashing(self, app):
        """Test password hashing and verification."""
        with app.app_context():
            user = User(
                email='test@example.com',
                first_name='Test',
                last_name='User'
            )
            user.set_password('testpassword')
            
            assert user.password_hash is not None
            assert user.password_hash != 'testpassword'
            assert user.check_password('testpassword') == True
            assert user.check_password('wrongpassword') == False
    
    def test_user_full_name(self, app):
        """Test get_full_name method."""
        with app.app_context():
            user = User(
                first_name='John',
                last_name='Doe',
                email='john@example.com'
            )
            assert user.get_full_name() == 'John Doe'