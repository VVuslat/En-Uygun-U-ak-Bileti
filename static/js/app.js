// JavaScript for En Uygun Uçak Bileti Application

// Global app object
const FlightApp = {
    init: function() {
        this.bindEvents();
        this.initializeComponents();
    },

    bindEvents: function() {
        // Form validation
        document.addEventListener('DOMContentLoaded', function() {
            const forms = document.querySelectorAll('.needs-validation');
            Array.prototype.slice.call(forms).forEach(function(form) {
                form.addEventListener('submit', function(event) {
                    if (!form.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    form.classList.add('was-validated');
                }, false);
            });
        });

        // Flight search form
        const searchForm = document.getElementById('flight-search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', this.handleFlightSearch.bind(this));
        }

        // Price filter sliders
        const priceSlider = document.getElementById('price-range');
        if (priceSlider) {
            priceSlider.addEventListener('input', this.handlePriceFilter.bind(this));
        }

        // Sort dropdown
        const sortSelect = document.getElementById('sort-flights');
        if (sortSelect) {
            sortSelect.addEventListener('change', this.handleSort.bind(this));
        }
    },

    initializeComponents: function() {
        // Initialize tooltips
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });

        // Initialize popovers
        var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        var popoverList = popoverTriggerList.map(function(popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl);
        });

        // Set default date to today
        this.setDefaultDate();
    },

    handleFlightSearch: function(event) {
        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Show loading state
        this.showLoading(submitBtn);
        
        // Validate form
        const departure = form.departure.value;
        const destination = form.destination.value;
        
        if (departure === destination) {
            event.preventDefault();
            this.showAlert('Kalkış ve varış şehri aynı olamaz!', 'error');
            this.hideLoading(submitBtn);
            return false;
        }
    },

    handlePriceFilter: function(event) {
        const maxPrice = event.target.value;
        const priceDisplay = document.getElementById('price-display');
        
        if (priceDisplay) {
            priceDisplay.textContent = `${maxPrice} TL`;
        }
        
        // Filter flights
        this.filterFlightsByPrice(maxPrice);
    },

    handleSort: function(event) {
        const sortBy = event.target.value;
        this.sortFlights(sortBy);
    },

    filterFlightsByPrice: function(maxPrice) {
        const flightCards = document.querySelectorAll('.flight-card');
        
        flightCards.forEach(card => {
            const priceElement = card.querySelector('.price-badge');
            if (priceElement) {
                const price = parseInt(priceElement.textContent.replace(/[^\d]/g, ''));
                if (price <= maxPrice) {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                }
            }
        });
    },

    sortFlights: function(sortBy) {
        const container = document.getElementById('flights-container');
        if (!container) return;
        
        const flights = Array.from(container.children);
        
        flights.sort((a, b) => {
            switch(sortBy) {
                case 'price-asc':
                    return this.getFlightPrice(a) - this.getFlightPrice(b);
                case 'price-desc':
                    return this.getFlightPrice(b) - this.getFlightPrice(a);
                case 'time-asc':
                    return this.getFlightTime(a) - this.getFlightTime(b);
                case 'time-desc':
                    return this.getFlightTime(b) - this.getFlightTime(a);
                case 'score':
                    return this.getFlightScore(b) - this.getFlightScore(a);
                default:
                    return 0;
            }
        });
        
        // Re-append sorted flights
        flights.forEach(flight => container.appendChild(flight));
    },

    getFlightPrice: function(element) {
        const priceElement = element.querySelector('.price-badge');
        return priceElement ? parseInt(priceElement.textContent.replace(/[^\d]/g, '')) : 0;
    },

    getFlightTime: function(element) {
        const timeElement = element.querySelector('.departure-time');
        if (!timeElement) return 0;
        
        const time = timeElement.textContent.trim();
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    },

    getFlightScore: function(element) {
        const scoreElement = element.querySelector('.score-badge');
        return scoreElement ? parseInt(scoreElement.textContent.replace(/[^\d]/g, '')) : 0;
    },

    setDefaultDate: function() {
        const dateInputs = document.querySelectorAll('input[type="date"]');
        const today = new Date().toISOString().split('T')[0];
        
        dateInputs.forEach(input => {
            if (!input.value) {
                input.value = today;
            }
            input.min = today;
        });
    },

    showLoading: function(button) {
        if (button) {
            button.disabled = true;
            button.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Aranıyor...';
        }
    },

    hideLoading: function(button) {
        if (button) {
            button.disabled = false;
            button.innerHTML = '🔍 Ara';
        }
    },

    showAlert: function(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(alertDiv, container.firstChild);
            
            // Auto dismiss after 5 seconds
            setTimeout(() => {
                alertDiv.remove();
            }, 5000);
        }
    },

    // API functions
    searchFlights: function(criteria) {
        return fetch('/api/flights', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(criteria)
        })
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            this.showAlert('Arama sırasında bir hata oluştu.', 'error');
        });
    },

    sendNotification: function(message, type = 'email') {
        return fetch('/api/notify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                type: type
            })
        })
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            this.showAlert('Bildirim gönderilirken bir hata oluştu.', 'error');
        });
    },

    // Utility functions
    formatPrice: function(price, currency = 'TL') {
        return `${price.toLocaleString('tr-TR')} ${currency}`;
    },

    formatDuration: function(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}sa ${mins}dk`;
    },

    getCategoryClass: function(category) {
        const classes = {
            'ucuz': 'price-cheap',
            'orta': 'price-moderate',
            'pahalı': 'price-expensive'
        };
        return classes[category] || '';
    }
};

// Global functions
function logout() {
    if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
        window.location.href = '/logout';
    }
}

function setRoute(departure, destination) {
    const depSelect = document.getElementById('departure');
    const destSelect = document.getElementById('destination');
    
    if (depSelect) depSelect.value = departure;
    if (destSelect) destSelect.value = destination;
}

function bookFlight(flightId, bookingUrl) {
    if (confirm('Bu uçuş için rezervasyon sayfasına yönlendirileceksiniz. Devam etmek istiyor musunuz?')) {
        // Track booking attempt
        if (typeof gtag !== 'undefined') {
            gtag('event', 'flight_booking_attempt', {
                flight_id: flightId
            });
        }
        
        window.open(bookingUrl, '_blank');
    }
}

function createPriceAlert(flightData) {
    const targetPrice = prompt('Hedef fiyat girin (TL):');
    if (targetPrice && !isNaN(targetPrice)) {
        FlightApp.sendNotification(
            `Fiyat uyarısı oluşturuldu: ${flightData.departure} → ${flightData.destination} için ${targetPrice} TL`,
            'email'
        ).then(result => {
            if (result && result.success) {
                FlightApp.showAlert('Fiyat uyarısı başarıyla oluşturuldu!', 'success');
            }
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    FlightApp.init();
});