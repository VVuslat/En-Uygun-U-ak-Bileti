"""
Main application routes.
"""

from flask import Blueprint, render_template, redirect, url_for
from flask_login import current_user

main_bp = Blueprint('main', __name__)


@main_bp.route('/')
def index():
    """Home page."""
    if current_user.is_authenticated:
        return redirect(url_for('main.dashboard'))
    return render_template('index.html')


@main_bp.route('/dashboard')
def dashboard():
    """User dashboard."""
    if not current_user.is_authenticated:
        return redirect(url_for('auth.login'))
    
    # Get user's recent searches and notifications
    from models.models import FlightSearch, Notification
    
    recent_searches = FlightSearch.query.filter_by(
        user_id=current_user.id,
        is_active=True
    ).order_by(FlightSearch.created_at.desc()).limit(5).all()
    
    unread_notifications = Notification.query.filter_by(
        user_id=current_user.id,
        is_read=False
    ).order_by(Notification.created_at.desc()).limit(10).all()
    
    return render_template('dashboard.html', 
                         recent_searches=recent_searches,
                         notifications=unread_notifications)