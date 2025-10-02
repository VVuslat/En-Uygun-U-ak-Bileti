/**
 * SUNUM NOTU: Bu dosya arama formunun davranışlarını yönetir.
 * Form validation, event handling ve kullanıcı etkileşimleri burada.
 * Modüler yapı: her bileşen kendi işini yapar, bağımlılıklar minimize edilmiş.
 * 
 * Bu dosya ne işe yarar:
 * - Arama formunu render eder (HTML oluşturur)
 * - Form submit işlemini yönetir
 * - Client-side validation yapar
 * - Error mesajlarını gösterir
 */

import { validateSearchForm } from './utils.js';

/**
 * Renders the search form HTML
 * @param {HTMLElement} container - Container element to render form into
 */
export function renderSearchForm(container) {
    // Get today's date for min date attribute
    const today = new Date().toISOString().split('T')[0];
    
    const formHTML = `
        <form id="flight-search-form" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Departure Input -->
                <div class="form-group">
                    <label for="departure" class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-plane-departure mr-1"></i>
                        Kalkış
                    </label>
                    <input 
                        type="text" 
                        id="departure" 
                        name="departure"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Örn: IST, İstanbul"
                        required
                        aria-label="Kalkış havalimanı"
                        autocomplete="off"
                    >
                </div>

                <!-- Arrival Input -->
                <div class="form-group">
                    <label for="arrival" class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-plane-arrival mr-1"></i>
                        Varış
                    </label>
                    <input 
                        type="text" 
                        id="arrival" 
                        name="arrival"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Örn: ADB, İzmir"
                        required
                        aria-label="Varış havalimanı"
                        autocomplete="off"
                    >
                </div>

                <!-- Date Input -->
                <div class="form-group">
                    <label for="date" class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-calendar mr-1"></i>
                        Tarih
                    </label>
                    <input 
                        type="date" 
                        id="date" 
                        name="date"
                        min="${today}"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        aria-label="Uçuş tarihi"
                    >
                </div>

                <!-- Submit Button -->
                <div class="form-group flex items-end">
                    <button 
                        type="submit" 
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                        aria-label="Uçuş ara"
                    >
                        <i class="fas fa-search mr-2"></i>
                        Ara
                    </button>
                </div>
            </div>

            <!-- Error Messages Container -->
            <div id="form-errors" class="hidden mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div class="flex">
                    <i class="fas fa-exclamation-circle text-red-500 mr-2 mt-1"></i>
                    <div>
                        <h3 class="text-red-800 font-medium">Lütfen aşağıdaki hataları düzeltin:</h3>
                        <ul id="error-list" class="list-disc list-inside text-red-700 mt-2"></ul>
                    </div>
                </div>
            </div>
        </form>
    `;
    
    container.innerHTML = formHTML;
}

/**
 * Attaches event handlers to the search form
 * @param {Function} onSubmitCallback - Callback function when form is submitted
 */
export function attachSearchFormHandlers(onSubmitCallback) {
    const form = document.getElementById('flight-search-form');
    const errorContainer = document.getElementById('form-errors');
    const errorList = document.getElementById('error-list');
    
    if (!form) {
        console.error('Search form not found');
        return;
    }
    
    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        hideErrors();
        
        // Get form data
        const formData = {
            departure: document.getElementById('departure').value.trim(),
            arrival: document.getElementById('arrival').value.trim(),
            date: document.getElementById('date').value
        };
        
        // Validate form
        const validation = validateSearchForm(formData);
        
        if (!validation.isValid) {
            // Show validation errors
            showErrors(validation.errors);
            return;
        }
        
        // Call the submit callback with form data
        if (typeof onSubmitCallback === 'function') {
            try {
                await onSubmitCallback(formData);
            } catch (error) {
                showErrors(['Bir hata oluştu. Lütfen tekrar deneyin.']);
            }
        }
    });
    
    // Add input event listeners for real-time feedback
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            // Clear errors when user starts typing
            if (errorContainer.classList.contains('hidden') === false) {
                hideErrors();
            }
        });
    });
    
    /**
     * Shows validation errors to the user
     * @param {Array<string>} errors - Array of error messages
     */
    function showErrors(errors) {
        errorList.innerHTML = errors
            .map(error => `<li>${error}</li>`)
            .join('');
        errorContainer.classList.remove('hidden');
        
        // Scroll to errors for accessibility (check if scrollIntoView exists - for testing compatibility)
        if (errorContainer.scrollIntoView) {
            errorContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    /**
     * Hides error messages
     */
    function hideErrors() {
        errorContainer.classList.add('hidden');
        errorList.innerHTML = '';
    }
}

/**
 * Gets current form values
 * @returns {Object} Current form data
 */
export function getFormData() {
    return {
        departure: document.getElementById('departure')?.value.trim() || '',
        arrival: document.getElementById('arrival')?.value.trim() || '',
        date: document.getElementById('date')?.value || ''
    };
}

/**
 * Resets the search form
 */
export function resetSearchForm() {
    const form = document.getElementById('flight-search-form');
    if (form) {
        form.reset();
    }
    
    const errorContainer = document.getElementById('form-errors');
    if (errorContainer) {
        errorContainer.classList.add('hidden');
    }
}
