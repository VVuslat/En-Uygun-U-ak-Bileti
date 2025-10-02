"""
Database models for the flight tracking application.
All models follow MYK Level 5 standards for data modeling.
"""

from app import db, login_manager
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import uuid


class User(UserMixin, db.Model):
    """User model for authentication and user management."""
    
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # Relationships
    flight_searches = db.relationship('FlightSearch', backref='user', lazy=True, cascade='all, delete-orphan')
    notifications = db.relationship('Notification', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Set password hash."""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check password against hash."""
        return check_password_hash(self.password_hash, password)
    
    def get_full_name(self):
        """Get user's full name."""
        return f"{self.first_name} {self.last_name}"
    
    def __repr__(self):
        return f'<User {self.email}>'


class FlightSearch(db.Model):
    """Model for storing user flight search criteria."""
    
    __tablename__ = 'flight_searches'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    origin = db.Column(db.String(10), nullable=False)  # Airport code
    destination = db.Column(db.String(10), nullable=False)  # Airport code
    departure_date = db.Column(db.Date, nullable=False)
    return_date = db.Column(db.Date, nullable=True)  # Null for one-way
    passenger_count = db.Column(db.Integer, default=1)
    max_price = db.Column(db.Float, nullable=True)
    airline_preference = db.Column(db.String(100), nullable=True)
    notification_enabled = db.Column(db.Boolean, default=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<FlightSearch {self.origin}-{self.destination} on {self.departure_date}>'


class Flight(db.Model):
    """Model for storing flight information."""
    
    __tablename__ = 'flights'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    flight_number = db.Column(db.String(20), nullable=False)
    airline = db.Column(db.String(100), nullable=False)
    origin = db.Column(db.String(10), nullable=False)
    destination = db.Column(db.String(10), nullable=False)
    departure_time = db.Column(db.DateTime, nullable=False)
    arrival_time = db.Column(db.DateTime, nullable=False)
    price = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(3), default='TRY')
    available_seats = db.Column(db.Integer, nullable=True)
    booking_url = db.Column(db.String(500), nullable=True)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    
    def get_duration(self):
        """Calculate flight duration."""
        return self.arrival_time - self.departure_time
    
    def is_available(self):
        """Check if flight is still available."""
        return self.departure_time > datetime.utcnow()
    
    def __repr__(self):
        return f'<Flight {self.flight_number} {self.origin}-{self.destination}>'


class Notification(db.Model):
    """Model for user notifications."""
    
    __tablename__ = 'notifications'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(20), default='info')  # info, success, warning, error
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def mark_as_read(self):
        """Mark notification as read."""
        self.is_read = True
        db.session.commit()
    
    def __repr__(self):
        return f'<Notification {self.title}>'