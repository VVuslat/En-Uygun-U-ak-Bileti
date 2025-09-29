// Main JavaScript file for En Uygun Uçak Bileti

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Auto-dismiss alerts after 5 seconds
    setTimeout(function() {
        var alerts = document.querySelectorAll('.alert');
        alerts.forEach(function(alert) {
            if (alert.classList.contains('alert-success') || alert.classList.contains('alert-info')) {
                var bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        });
    }, 5000);

    // Form validation enhancements
    var forms = document.querySelectorAll('.needs-validation');
    forms.forEach(function(form) {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });

    // Airport code autocomplete
    setupAirportAutocomplete();
    
    // Flight search enhancements
    setupFlightSearchForm();
    
    // Notification handlers
    setupNotificationHandlers();
});

function setupAirportAutocomplete() {
    var airportInputs = document.querySelectorAll('.airport-input');
    
    airportInputs.forEach(function(input) {
        input.addEventListener('input', function() {
            // Convert to uppercase
            this.value = this.value.toUpperCase();
            
            // Validate airport code format
            if (this.value.length === 3) {
                validateAirportCode(this);
            }
        });
        
        input.addEventListener('blur', function() {
            if (this.value.length === 3) {
                validateAirportCode(this);
            }
        });
    });
}

function validateAirportCode(input) {
    // Simple validation - in a real app, this would check against a database
    var validCodes = ['IST', 'SAW', 'ESB', 'ADB', 'AYT', 'TZX', 'BJV', 'GZT', 'KYA', 'VAN'];
    
    if (validCodes.includes(input.value)) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
    }
}

function setupFlightSearchForm() {
    var searchForm = document.querySelector('#flight-search-form');
    if (!searchForm) return;
    
    var departureDate = document.querySelector('#departure_date');
    var returnDate = document.querySelector('#return_date');
    
    if (departureDate) {
        // Set minimum date to tomorrow
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        departureDate.min = tomorrow.toISOString().split('T')[0];
        
        departureDate.addEventListener('change', function() {
            if (returnDate && this.value) {
                // Set return date minimum to departure date
                returnDate.min = this.value;
                
                // Clear return date if it's before departure date
                if (returnDate.value && returnDate.value <= this.value) {
                    returnDate.value = '';
                }
            }
        });
    }
    
    if (returnDate) {
        returnDate.addEventListener('change', function() {
            if (departureDate && this.value && departureDate.value) {
                if (this.value <= departureDate.value) {
                    alert('Dönüş tarihi gidiş tarihinden sonra olmalıdır.');
                    this.value = '';
                }
            }
        });
    }
}

function setupNotificationHandlers() {
    // Mark notification as read when clicked
    var notificationItems = document.querySelectorAll('.notification-item');
    
    notificationItems.forEach(function(item) {
        item.addEventListener('click', function() {
            var notificationId = this.dataset.notificationId;
            if (notificationId) {
                markNotificationAsRead(notificationId);
            }
        });
    });
}

function markNotificationAsRead(notificationId) {
    fetch('/api/notifications/' + notificationId + '/read', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken()
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update UI to show notification as read
            var notificationElement = document.querySelector('[data-notification-id="' + notificationId + '"]');
            if (notificationElement) {
                notificationElement.classList.add('notification-read');
            }
        }
    })
    .catch(error => {
        console.error('Error marking notification as read:', error);
    });
}

function getCsrfToken() {
    var csrfToken = document.querySelector('meta[name="csrf-token"]');
    return csrfToken ? csrfToken.getAttribute('content') : '';
}

// Flight results utilities
function sortFlights(criteria) {
    var flightCards = Array.from(document.querySelectorAll('.flight-card'));
    
    flightCards.sort(function(a, b) {
        switch(criteria) {
            case 'price':
                var priceA = parseFloat(a.dataset.price || 0);
                var priceB = parseFloat(b.dataset.price || 0);
                return priceA - priceB;
            
            case 'duration':
                var durationA = parseInt(a.dataset.duration || 0);
                var durationB = parseInt(b.dataset.duration || 0);
                return durationA - durationB;
            
            case 'departure':
                var timeA = a.dataset.departureTime || '';
                var timeB = b.dataset.departureTime || '';
                return timeA.localeCompare(timeB);
            
            default:
                return 0;
        }
    });
    
    var container = document.querySelector('.flights-container');
    if (container) {
        flightCards.forEach(function(card) {
            container.appendChild(card);
        });
    }
}

function filterFlights(filters) {
    var flightCards = document.querySelectorAll('.flight-card');
    
    flightCards.forEach(function(card) {
        var shouldShow = true;
        
        // Price filter
        if (filters.maxPrice) {
            var price = parseFloat(card.dataset.price || 0);
            if (price > filters.maxPrice) {
                shouldShow = false;
            }
        }
        
        // Airline filter
        if (filters.airline && filters.airline !== 'all') {
            var airline = card.dataset.airline || '';
            if (!airline.toLowerCase().includes(filters.airline.toLowerCase())) {
                shouldShow = false;
            }
        }
        
        // Time filter
        if (filters.timeRange) {
            var departureTime = card.dataset.departureTime || '';
            // Implementation would depend on time range format
        }
        
        card.style.display = shouldShow ? 'block' : 'none';
    });
}

// Loading states
function showLoading(element) {
    if (element) {
        element.disabled = true;
        var originalText = element.innerHTML;
        element.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Yükleniyor...';
        element.dataset.originalText = originalText;
    }
}

function hideLoading(element) {
    if (element && element.dataset.originalText) {
        element.disabled = false;
        element.innerHTML = element.dataset.originalText;
        delete element.dataset.originalText;
    }
}

// Utility functions
function formatCurrency(amount, currency = 'TRY') {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

function formatDate(dateString) {
    var date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatTime(timeString) {
    var time = new Date(timeString);
    return time.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Export functions for global use
window.FlightApp = {
    sortFlights: sortFlights,
    filterFlights: filterFlights,
    showLoading: showLoading,
    hideLoading: hideLoading,
    formatCurrency: formatCurrency,
    formatDate: formatDate,
    formatTime: formatTime
};