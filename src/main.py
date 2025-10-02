"""
En Uygun Uçak Bileti - Flask Frontend Application
MYK Yazılım Geliştirici Seviye 5 Uyumlu

Flask + Jinja2 ile hazırlanmış uçak bileti arama ve takip frontend projesi.
Mock API, responsive tasarım ve pytest tabanlı testler içerir.
"""

from flask import Flask, render_template, request, jsonify
import os

# Import custom modules
from services.flight_service import FlightService
from forms.search_form import SearchForm
from utils.formatters import format_currency, format_datetime, format_duration

app = Flask(__name__, template_folder="templates", static_folder="static")
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret-key-myk-level-5")

# Initialize services
flight_service = FlightService()


@app.route("/")
def index():
    """Ana sayfa - Arama formu"""
    form = SearchForm()
    return render_template("index.html", form=form)


@app.route("/flights", methods=["GET", "POST"])
def flights():
    """Uçuş listesi sayfası - Arama sonuçları"""
    form = SearchForm()

    # Get search parameters from form or query string
    if request.method == "POST":
        origin = request.form.get("origin", "").upper()
        destination = request.form.get("destination", "").upper()
        departure_date = request.form.get("departure_date")
        return_date = request.form.get("return_date")
        trip_type = request.form.get("trip_type", "one-way")
    else:
        origin = request.args.get("origin", "").upper()
        destination = request.args.get("destination", "").upper()
        departure_date = request.args.get("departure_date")
        return_date = request.args.get("return_date")
        trip_type = request.args.get("trip_type", "one-way")

    # Get filter and sort parameters
    sort_by = request.args.get("sort", "price")  # price, departure, duration
    max_price = request.args.get("max_price", type=float)
    airline = request.args.get("airline")

    # Validate required fields
    if not all([origin, destination, departure_date]):
        return render_template(
            "index.html", form=form, error="Lütfen tüm gerekli alanları doldurun."
        )

    # Search flights
    flights_data = flight_service.search_flights(
        origin=origin,
        destination=destination,
        departure_date=departure_date,
        return_date=return_date,
        trip_type=trip_type,
    )

    # Apply filters
    if max_price:
        flights_data = [f for f in flights_data if f["price"] <= max_price]

    if airline:
        flights_data = [f for f in flights_data if airline.lower() in f["airline"].lower()]

    # Apply sorting
    if sort_by == "price":
        flights_data.sort(key=lambda x: x["price"])
    elif sort_by == "departure":
        flights_data.sort(key=lambda x: x["departure"])
    elif sort_by == "duration":
        flights_data.sort(key=lambda x: x.get("duration_minutes", 999))

    # Get unique airlines for filter
    airlines = sorted(set(f["airline"] for f in flights_data))

    return render_template(
        "flights_list.html",
        flights=flights_data,
        origin=origin,
        destination=destination,
        departure_date=departure_date,
        return_date=return_date,
        trip_type=trip_type,
        sort_by=sort_by,
        airlines=airlines,
        total_results=len(flights_data),
    )


@app.route("/api/mock/flights")
def api_mock_flights():
    """Mock API endpoint - Uçuş verileri"""
    origin = request.args.get("origin", "").upper()
    destination = request.args.get("destination", "").upper()
    departure_date = request.args.get("departure_date")
    return_date = request.args.get("return_date")
    trip_type = request.args.get("trip_type", "one-way")

    if not all([origin, destination, departure_date]):
        return (
            jsonify(
                {
                    "error": "Missing required parameters",
                    "required": ["origin", "destination", "departure_date"],
                }
            ),
            400,
        )

    flights = flight_service.search_flights(
        origin=origin,
        destination=destination,
        departure_date=departure_date,
        return_date=return_date,
        trip_type=trip_type,
    )

    return jsonify({"flights": flights})


@app.route("/api/flight/<flight_id>")
def api_flight_detail(flight_id):
    """Tek uçuş detayı API endpoint"""
    flight = flight_service.get_flight_by_id(flight_id)

    if not flight:
        return jsonify({"error": "Flight not found"}), 404

    return jsonify(flight)


# Template filters
@app.template_filter("format_currency")
def currency_filter(value, currency="TRY"):
    """Para birimi formatlama"""
    return format_currency(value, currency)


@app.template_filter("format_datetime")
def datetime_filter(value, format_type="full"):
    """Tarih/saat formatlama"""
    return format_datetime(value, format_type)


@app.template_filter("format_duration")
def duration_filter(minutes):
    """Süre formatlama"""
    return format_duration(minutes)


# Error handlers
@app.errorhandler(404)
def not_found(error):
    """404 hata sayfası"""
    return render_template("error.html", error_code=404, error_message="Sayfa bulunamadı"), 404


@app.errorhandler(500)
def internal_error(error):
    """500 hata sayfası"""
    return render_template("error.html", error_code=500, error_message="Sunucu hatası"), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
