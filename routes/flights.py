"""
Flight-related routes for search, listing and booking.
Implements MYK Level 5 flight management standards.
"""

from flask import Blueprint, render_template, request, flash, redirect, url_for, jsonify
from flask_login import login_required, current_user
from datetime import datetime, date
import json

from app import db
from models.models import FlightSearch, Flight, Notification
from utils.forms import FlightSearchForm
from utils.flight_api import FlightAPIClient
from utils.validators import validate_airport_code, validate_date_range

flights_bp = Blueprint('flights', __name__, url_prefix='/flights')


@flights_bp.route('/search', methods=['GET', 'POST'])
@login_required
def search():
    """Flight search page."""
    if request.method == 'POST':
        form = FlightSearchForm()
        
        if form.validate():
            try:
                # Save search criteria
                search_record = FlightSearch(
                    user_id=current_user.id,
                    origin=form.data['origin'].upper(),
                    destination=form.data['destination'].upper(),
                    departure_date=date.fromisoformat(form.data['departure_date']),
                    return_date=date.fromisoformat(form.data['return_date']) if form.data.get('return_date') else None,
                    passenger_count=int(form.data['passenger_count']),
                    max_price=float(form.data['max_price']) if form.data.get('max_price') else None,
                    airline_preference=form.data.get('airline_preference'),
                    notification_enabled=form.data.get('notification_enabled') == 'on'
                )
                
                db.session.add(search_record)
                db.session.commit()
                
                # Redirect to results page
                return redirect(url_for('flights.results', search_id=search_record.id))
                
            except Exception as e:
                db.session.rollback()
                flash('Arama kaydedilemedi. Lütfen tekrar deneyin.', 'error')
                return render_template('flights/search.html', form=form)
        else:
            # Show validation errors
            for field, errors in form.errors.items():
                for error in errors:
                    flash(error, 'error')
            return render_template('flights/search.html', form=form)
    
    return render_template('flights/search.html', form=FlightSearchForm())


@flights_bp.route('/results/<search_id>')
@login_required
def results(search_id):
    """Display flight search results."""
    # Get search criteria
    search = FlightSearch.query.filter_by(
        id=search_id,
        user_id=current_user.id
    ).first_or_404()
    
    # Fetch flights from API
    api_client = FlightAPIClient()
    flights_data = api_client.search_flights(
        origin=search.origin,
        destination=search.destination,
        departure_date=search.departure_date,
        return_date=search.return_date,
        passengers=search.passenger_count
    )
    
    # Filter flights based on user preferences
    filtered_flights = []
    for flight_data in flights_data:
        # Apply price filter
        if search.max_price and flight_data.get('price', 0) > search.max_price:
            continue
            
        # Apply airline filter
        if search.airline_preference and search.airline_preference.lower() not in flight_data.get('airline', '').lower():
            continue
            
        filtered_flights.append(flight_data)
    
    # Sort by price
    filtered_flights.sort(key=lambda x: x.get('price', float('inf')))
    
    return render_template('flights/results.html', 
                         flights=filtered_flights,
                         search=search)


@flights_bp.route('/my-searches')
@login_required
def my_searches():
    """Display user's saved searches."""
    searches = FlightSearch.query.filter_by(
        user_id=current_user.id
    ).order_by(FlightSearch.created_at.desc()).all()
    
    return render_template('flights/my_searches.html', searches=searches)


@flights_bp.route('/toggle-search/<search_id>')
@login_required
def toggle_search(search_id):
    """Toggle search active status."""
    search = FlightSearch.query.filter_by(
        id=search_id,
        user_id=current_user.id
    ).first_or_404()
    
    search.is_active = not search.is_active
    db.session.commit()
    
    status = 'aktif' if search.is_active else 'pasif'
    flash(f'Arama {status} hale getirildi.', 'success')
    
    return redirect(url_for('flights.my_searches'))


@flights_bp.route('/delete-search/<search_id>')
@login_required
def delete_search(search_id):
    """Delete a search."""
    search = FlightSearch.query.filter_by(
        id=search_id,
        user_id=current_user.id
    ).first_or_404()
    
    db.session.delete(search)
    db.session.commit()
    
    flash('Arama silindi.', 'success')
    return redirect(url_for('flights.my_searches'))


@flights_bp.route('/api/airports')
def api_airports():
    """API endpoint for airport autocomplete."""
    query = request.args.get('q', '').strip().upper()
    
    # Common Turkish airports
    airports = {
        'IST': 'İstanbul Havalimanı',
        'SAW': 'Sabiha Gökçen Havalimanı',
        'ESB': 'Esenboğa Havalimanı (Ankara)',
        'ADB': 'Adnan Menderes Havalimanı (İzmir)',
        'AYT': 'Antalya Havalimanı',
        'TZX': 'Trabzon Havalimanı',
        'BJV': 'Bodrum-Milas Havalimanı',
        'GZT': 'Gaziantep Havalimanı',
        'KYA': 'Konya Havalimanı',
        'VAN': 'Van Ferit Melen Havalimanı'
    }
    
    if query:
        filtered = {code: name for code, name in airports.items() 
                   if query in code or query in name.upper()}
    else:
        filtered = airports
    
    return jsonify([{'code': code, 'name': name} for code, name in filtered.items()])