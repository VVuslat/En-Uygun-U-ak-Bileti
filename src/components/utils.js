/**
 * SUNUM NOTU: Bu dosya yardımcı fonksiyonlar içerir - tarih/fiyat formatlama, debounce gibi.
 * Kodun tekrar kullanılabilirliğini artırır ve tek sorumluluk prensibine uyar.
 * 
 * Bu dosya ne işe yarar:
 * - Tarih ve saat formatlama (kullanıcı dostu gösterim)
 * - Fiyat formatlama (TRY sembolu ile)
 * - Debounce fonksiyonu (arama performansı için)
 * - Diğer küçük yardımcı fonksiyonlar
 */

/**
 * Formats ISO date string to Turkish locale time format
 * @param {string} isoDateString - ISO 8601 date string
 * @returns {string} Formatted time (HH:MM)
 */
export function formatTime(isoDateString) {
    try {
        const date = new Date(isoDateString);
        return date.toLocaleTimeString('tr-TR', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    } catch (error) {
        console.error('Error formatting time:', error);
        return '--:--';
    }
}

/**
 * Formats ISO date string to Turkish locale date format
 * @param {string} isoDateString - ISO 8601 date string
 * @returns {string} Formatted date (DD.MM.YYYY)
 */
export function formatDate(isoDateString) {
    try {
        const date = new Date(isoDateString);
        return date.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return '--.--.----';
    }
}

/**
 * Formats price with Turkish Lira symbol
 * @param {number} price - Price amount
 * @param {string} currency - Currency code (default: TRY)
 * @returns {string} Formatted price (e.g., "890 ₺")
 */
export function formatPrice(price, currency = 'TRY') {
    try {
        const formattedNumber = price.toLocaleString('tr-TR');
        return `${formattedNumber} ₺`;
    } catch (error) {
        console.error('Error formatting price:', error);
        return `${price} ₺`;
    }
}

/**
 * Debounce function to limit function calls
 * Used for search input to prevent excessive filtering
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Validates form input fields
 * @param {Object} formData - Form data to validate
 * @returns {Object} Validation result { isValid: boolean, errors: Array }
 */
export function validateSearchForm(formData) {
    const errors = [];
    
    // Validate departure airport
    if (!formData.departure || formData.departure.trim().length < 3) {
        errors.push('Kalkış havalimanı en az 3 karakter olmalıdır');
    }
    
    // Validate arrival airport
    if (!formData.arrival || formData.arrival.trim().length < 3) {
        errors.push('Varış havalimanı en az 3 karakter olmalıdır');
    }
    
    // Check if departure and arrival are different
    if (formData.departure && formData.arrival && 
        formData.departure.toUpperCase() === formData.arrival.toUpperCase()) {
        errors.push('Kalkış ve varış havalimanları aynı olamaz');
    }
    
    // Validate date
    if (!formData.date) {
        errors.push('Tarih seçilmelidir');
    } else {
        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            errors.push('Tarih bugünden önce olamaz');
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Safely escapes HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Gets the number of days until a given date
 * @param {string} dateString - Date string
 * @returns {number} Number of days
 */
export function getDaysUntil(dateString) {
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * Checks if the browser supports required features
 * @returns {boolean} True if all features are supported
 */
export function checkBrowserSupport() {
    const requiredFeatures = [
        'fetch' in window,
        'Promise' in window,
        'localStorage' in window
    ];
    
    return requiredFeatures.every(feature => feature);
}
