"""
En Uygun Uçak Bileti - Flight Ticket Tracking Application
MYK Level 5 compliant implementation

This is the main application entry point.
"""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import modules
from modules.user_management import UserManager
from modules.flight_search import FlightSearchEngine
from modules.api_integration import APIManager
from modules.data_analysis import DataAnalyzer
from modules.notification_service import NotificationService

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///flight_app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Initialize modules
user_manager = UserManager(db)
flight_search = FlightSearchEngine()
api_manager = APIManager()
data_analyzer = DataAnalyzer()
notification_service = NotificationService()

@login_manager.user_loader
def load_user(user_id):
    return user_manager.get_user_by_id(user_id)

@app.route('/')
def index():
    """Ana sayfa - Home page"""
    return render_template('index.html')

@app.route('/search', methods=['GET', 'POST'])
def search_flights():
    """Uçuş arama - Flight search"""
    if request.method == 'POST':
        departure = request.form.get('departure')
        destination = request.form.get('destination')
        date = request.form.get('date')
        
        # Search flights using the flight search engine
        flights = flight_search.search_flights(departure, destination, date)
        
        # Analyze and rank flights
        analyzed_flights = data_analyzer.analyze_flights(flights)
        
        return render_template('search_results.html', 
                             flights=analyzed_flights,
                             departure=departure,
                             destination=destination,
                             date=date)
    
    return render_template('search.html')

@app.route('/api/flights')
def api_flights():
    """API endpoint for flight data"""
    departure = request.args.get('departure')
    destination = request.args.get('destination')
    date = request.args.get('date')
    
    if not all([departure, destination, date]):
        return jsonify({'error': 'Missing required parameters'}), 400
    
    flights = flight_search.search_flights(departure, destination, date)
    return jsonify({'flights': flights})

@app.route('/register', methods=['GET', 'POST'])
def register():
    """Kullanıcı kaydı - User registration"""
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        name = request.form.get('name')
        
        success, message = user_manager.create_user(email, password, name)
        if success:
            flash('Kayıt başarılı! Giriş yapabilirsiniz.', 'success')
            return redirect(url_for('login'))
        else:
            flash(message, 'error')
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Kullanıcı girişi - User login"""
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        success, user = user_manager.authenticate_user(email, password)
        if success:
            flash('Giriş başarılı!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Geçersiz email veya şifre.', 'error')
    
    return render_template('login.html')

@app.route('/dashboard')
@login_required
def dashboard():
    """Kullanıcı paneli - User dashboard"""
    return render_template('dashboard.html', user=current_user)

@app.route('/notifications')
@login_required
def notifications():
    """Bildirim ayarları - Notification settings"""
    return render_template('notifications.html')

@app.route('/api/notify', methods=['POST'])
@login_required
def send_notification():
    """Bildirim gönder - Send notification"""
    data = request.get_json()
    message = data.get('message')
    notification_type = data.get('type', 'email')
    
    success = notification_service.send_notification(
        current_user.email, 
        message, 
        notification_type
    )
    
    return jsonify({'success': success})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
# Initialize Flask extensions
db = SQLAlchemy()
login_manager = LoginManager()


def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///flight_tracker.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions
    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'
    login_manager.login_message = 'Lütfen giriş yapın.'
    
    # Import models to ensure they are registered
    from models.models import User, FlightSearch, Flight, Notification
    
    # Register user loader
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(user_id)
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.flights import flights_bp
    from routes.main import main_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(flights_bp)
    app.register_blueprint(main_bp)
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)