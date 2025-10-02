/**
 * UI.js - Modal ve DOM etkileşimleri
 * MYK Seviye 5 uyumlu - Erişilebilirlik ve klavye navigasyonu
 */

// Modal state
let currentModalFlightId = null;

/**
 * Uçuş detay modalını açar
 * @param {string} flightId - Uçuş ID'si
 */
function openFlightModal(flightId) {
    const modal = document.getElementById('flight-modal');
    const modalContent = document.getElementById('modal-content');
    const modalLoading = document.getElementById('modal-loading');
    
    if (!modal) {
        console.error('Modal element not found');
        return;
    }
    
    // Show modal
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    
    // Show loading state
    modalLoading.classList.remove('hidden');
    modalContent.classList.add('hidden');
    
    // Store current flight ID
    currentModalFlightId = flightId;
    
    // Focus trap - focus first focusable element
    setTimeout(() => {
        const firstFocusable = modal.querySelector('button');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }, 100);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Fetch flight details
    fetchFlightDetails(flightId);
}

/**
 * Uçuş detay modalını kapatır
 */
function closeFlightModal() {
    const modal = document.getElementById('flight-modal');
    
    if (!modal) {
        return;
    }
    
    // Hide modal
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Clear current flight ID
    currentModalFlightId = null;
    
    // Return focus to trigger button
    const triggerButton = document.querySelector(`[data-flight-id="${currentModalFlightId}"] button`);
    if (triggerButton) {
        triggerButton.focus();
    }
}

/**
 * API'den uçuş detaylarını getirir
 * @param {string} flightId - Uçuş ID'si
 */
function fetchFlightDetails(flightId) {
    fetch(`/api/flight/${flightId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Flight not found');
            }
            return response.json();
        })
        .then(flight => {
            populateModal(flight);
        })
        .catch(error => {
            console.error('Error fetching flight details:', error);
            showModalError('Uçuş detayları yüklenirken bir hata oluştu.');
        });
}

/**
 * Modal içeriğini doldurur
 * @param {Object} flight - Uçuş verisi
 */
function populateModal(flight) {
    const modalContent = document.getElementById('modal-content');
    const modalLoading = document.getElementById('modal-loading');
    
    // Hide loading, show content
    modalLoading.classList.add('hidden');
    modalContent.classList.remove('hidden');
    
    // Populate basic info
    document.getElementById('modal-airline').textContent = flight.airline;
    document.getElementById('modal-flight-number').textContent = flight.flightNumber;
    
    // Parse dates
    const depTime = formatTime(flight.departure);
    const arrTime = formatTime(flight.arrival);
    const depDate = formatDate(flight.departure);
    const arrDate = formatDate(flight.arrival);
    
    // Populate route info
    document.getElementById('modal-departure-time').textContent = depTime;
    document.getElementById('modal-arrival-time').textContent = arrTime;
    document.getElementById('modal-origin').textContent = flight.origin;
    document.getElementById('modal-destination').textContent = flight.destination;
    document.getElementById('modal-departure-date').textContent = depDate;
    document.getElementById('modal-arrival-date').textContent = arrDate;
    
    // Duration
    const duration = formatDuration(flight.duration_minutes);
    document.getElementById('modal-duration').textContent = duration;
    
    // Stops
    const stopsEl = document.getElementById('modal-stops');
    if (flight.stops === 0) {
        stopsEl.innerHTML = '<span class="text-green-600 font-medium"><i class="fas fa-check-circle mr-1"></i>Direkt uçuş</span>';
    } else if (flight.stops === 1) {
        stopsEl.innerHTML = '<span class="text-orange-600"><i class="fas fa-exchange-alt mr-1"></i>1 Aktarma</span>';
    } else {
        stopsEl.innerHTML = `<span class="text-orange-600"><i class="fas fa-exchange-alt mr-1"></i>${flight.stops} Aktarma</span>`;
    }
    
    // Details
    document.getElementById('modal-aircraft').textContent = flight.aircraft || 'Belirtilmemiş';
    document.getElementById('modal-baggage').textContent = flight.baggage_allowance || '20kg';
    document.getElementById('modal-cabin-class').textContent = flight.cabin_class || 'Economy';
    document.getElementById('modal-seats').textContent = `${flight.available_seats} koltuk`;
    
    // Policy
    document.getElementById('modal-policy').textContent = flight.policy || 'İade edilebilir';
    
    // Price
    const price = formatCurrency(flight.price, flight.currency);
    document.getElementById('modal-price').textContent = price;
}

/**
 * Modal hata mesajı gösterir
 * @param {string} message - Hata mesajı
 */
function showModalError(message) {
    const modalLoading = document.getElementById('modal-loading');
    modalLoading.innerHTML = `
        <div class="text-center py-12">
            <i class="fas fa-exclamation-triangle text-red-500 text-5xl mb-4"></i>
            <p class="text-gray-700">${message}</p>
        </div>
    `;
}

/**
 * Tarih/saat formatını parse eder ve saat döndürür
 * @param {string} dateTimeStr - ISO format tarih/saat
 * @returns {string} Formatlanmış saat (HH:MM)
 */
function formatTime(dateTimeStr) {
    if (!dateTimeStr) return '';
    
    try {
        const dt = new Date(dateTimeStr);
        const hours = String(dt.getHours()).padStart(2, '0');
        const minutes = String(dt.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    } catch (e) {
        return dateTimeStr;
    }
}

/**
 * Tarih formatlar
 * @param {string} dateTimeStr - ISO format tarih/saat
 * @returns {string} Formatlanmış tarih
 */
function formatDate(dateTimeStr) {
    if (!dateTimeStr) return '';
    
    try {
        const dt = new Date(dateTimeStr);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return dt.toLocaleDateString('tr-TR', options);
    } catch (e) {
        return dateTimeStr;
    }
}

/**
 * Süre formatlar (dakikadan saat:dakika)
 * @param {number} minutes - Toplam dakika
 * @returns {string} Formatlanmış süre
 */
function formatDuration(minutes) {
    if (!minutes) return '0s 0d';
    
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours}s ${mins}d`;
}

/**
 * Para birimi formatlar
 * @param {number} amount - Miktar
 * @param {string} currency - Para birimi
 * @returns {string} Formatlanmış para
 */
function formatCurrency(amount, currency = 'TRY') {
    if (!amount) return '0,00 ' + currency;
    
    // Turkish number format (. for thousands, , for decimals)
    const formatted = amount.toFixed(2)
        .replace('.', ',')
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    return formatted + ' ' + currency;
}

/**
 * Klavye event handlers
 */
document.addEventListener('DOMContentLoaded', function() {
    // ESC key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            const modal = document.getElementById('flight-modal');
            if (modal && !modal.classList.contains('hidden')) {
                closeFlightModal();
            }
        }
    });
    
    // Trap focus in modal
    document.addEventListener('keydown', function(e) {
        const modal = document.getElementById('flight-modal');
        if (!modal || modal.classList.contains('hidden')) {
            return;
        }
        
        if (e.key === 'Tab' || e.keyCode === 9) {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length === 0) {
                return;
            }
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
});

/**
 * Smooth scroll to top
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        openFlightModal,
        closeFlightModal,
        formatTime,
        formatDate,
        formatDuration,
        formatCurrency
    };
}
