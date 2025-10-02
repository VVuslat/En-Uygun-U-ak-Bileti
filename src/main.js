/**
 * SUNUM NOTU: Bu dosya uygulamanın merkezi - tüm bileşenleri bir araya getirir.
 * Sayfa yüklendiğinde başlatılır, event bağlamalarını yapar, mock data'yı fetch eder.
 * Client-side routing ve state management burada.
 * 
 * Bu dosya ne işe yarar:
 * - Uygulama başlangıç noktası (bootstrap)
 * - Tüm bileşenleri başlatır ve bağlar
 * - Mock data'yı fetch eder (client-side)
 * - Arama ve filtreleme işlemlerini koordine eder
 */

import { renderSearchForm, attachSearchFormHandlers } from './components/searchForm.js';
import { 
    renderFlightList, 
    showLoadingState, 
    hideLoadingState, 
    showErrorState 
} from './components/flightList.js';
import { 
    renderFilters, 
    attachFilterHandlers, 
    populateAirlineFilter, 
    updatePriceFilter,
    applyFiltersAndSort 
} from './components/filters.js';
import { checkBrowserSupport } from './components/utils.js';

// Application state
let allFlights = [];
let originalFlights = [];
let currentSearchCriteria = null;

/**
 * Initializes the application when DOM is ready
 */
function initApp() {
    console.log('🚀 En Uygun Uçak Bileti uygulaması başlatılıyor...');
    
    // Check browser compatibility
    if (!checkBrowserSupport()) {
        showErrorState('Tarayıcınız bu uygulamayı desteklemiyor. Lütfen modern bir tarayıcı kullanın.');
        return;
    }
    
    // Initialize search form
    const searchFormContainer = document.getElementById('search-form-container');
    if (searchFormContainer) {
        renderSearchForm(searchFormContainer);
        attachSearchFormHandlers(handleSearch);
        console.log('✅ Arama formu hazır');
    }
    
    // Initialize filters
    const filtersContainer = document.getElementById('filters-container');
    if (filtersContainer) {
        renderFilters(filtersContainer);
        attachFilterHandlers(handleFilterChange);
        console.log('✅ Filtreler hazır');
    }
    
    console.log('✅ Uygulama başarıyla başlatıldı');
}

/**
 * Handles search form submission
 * @param {Object} searchData - Search form data
 */
async function handleSearch(searchData) {
    console.log('🔍 Uçuş araması başlatıldı:', searchData);
    
    // Store search criteria
    currentSearchCriteria = searchData;
    
    // Show loading state
    showLoadingState();
    
    try {
        // Fetch flights from mock data
        const flights = await fetchFlights(searchData);
        
        // Store original flights
        originalFlights = flights;
        
        // Filter flights based on search criteria
        const filteredFlights = filterFlightsBySearchCriteria(flights, searchData);
        
        // Store all flights for filtering
        allFlights = filteredFlights;
        
        if (filteredFlights.length === 0) {
            hideLoadingState();
            showNoResultsMessage();
            return;
        }
        
        // Update filters with available data
        populateAirlineFilter(filteredFlights);
        updatePriceFilter(filteredFlights);
        
        // Apply current filters and sorting
        const processedFlights = applyFiltersAndSort(filteredFlights);
        
        // Render flight list
        const flightListContainer = document.getElementById('flight-list-container');
        renderFlightList(processedFlights, flightListContainer);
        
        console.log(`✅ ${processedFlights.length} uçuş bulundu ve listelendi`);
        
    } catch (error) {
        console.error('❌ Uçuş araması sırasında hata:', error);
        hideLoadingState();
        showErrorState('Uçuşlar yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
}

/**
 * Handles filter changes
 */
function handleFilterChange() {
    console.log('🔄 Filtreler değiştirildi, liste güncelleniyor...');
    
    if (allFlights.length === 0) {
        console.warn('⚠️ Filtre uygulanacak uçuş bulunamadı');
        return;
    }
    
    // Apply filters and sorting
    const filteredFlights = applyFiltersAndSort(allFlights);
    
    // Render updated list
    const flightListContainer = document.getElementById('flight-list-container');
    renderFlightList(filteredFlights, flightListContainer);
    
    console.log(`✅ ${filteredFlights.length} uçuş filtrelendi`);
}

/**
 * Fetches flight data from mock JSON file
 * @param {Object} searchData - Search criteria
 * @returns {Promise<Array>} Array of flight objects
 */
async function fetchFlights(searchData) {
    console.log('📡 Mock data dosyasından uçuşlar çekiliyor...');
    
    try {
        // Simulate network delay for realistic UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const response = await fetch('./mock-data/flights.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.flights || !Array.isArray(data.flights)) {
            throw new Error('Invalid data format');
        }
        
        console.log(`✅ ${data.flights.length} uçuş verisi yüklendi`);
        return data.flights;
        
    } catch (error) {
        console.error('❌ Mock data yüklenirken hata:', error);
        throw new Error('Uçuş verileri yüklenemedi');
    }
}

/**
 * Filters flights based on search criteria
 * @param {Array<Object>} flights - All flights
 * @param {Object} criteria - Search criteria
 * @returns {Array<Object>} Filtered flights
 */
function filterFlightsBySearchCriteria(flights, criteria) {
    if (!criteria) return flights;
    
    return flights.filter(flight => {
        // Match departure airport (case insensitive, partial match)
        const departureMatch = !criteria.departure || 
            flight.departureAirport.toLowerCase().includes(criteria.departure.toLowerCase());
        
        // Match arrival airport (case insensitive, partial match)
        const arrivalMatch = !criteria.arrival || 
            flight.arrivalAirport.toLowerCase().includes(criteria.arrival.toLowerCase());
        
        // Match date (compare only the date part)
        let dateMatch = true;
        if (criteria.date) {
            const flightDate = new Date(flight.departure).toISOString().split('T')[0];
            dateMatch = flightDate === criteria.date;
        }
        
        return departureMatch && arrivalMatch && dateMatch;
    });
}

/**
 * Shows a message when no results are found
 */
function showNoResultsMessage() {
    const emptyState = document.getElementById('empty-state');
    if (emptyState) {
        emptyState.classList.remove('hidden');
    }
    
    // Hide results section
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) {
        resultsSection.classList.add('hidden');
    }
}

/**
 * Displays application info in console for debugging
 */
function displayAppInfo() {
    console.log('%c🛫 En Uygun Uçak Bileti', 'font-size: 20px; font-weight: bold; color: #2563eb;');
    console.log('%cMYK Seviye 5 Uyumlu Statik Frontend Projesi', 'color: #059669;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #d1d5db;');
    console.log('%cÖzellikler:', 'font-weight: bold; color: #2563eb;');
    console.log('✓ Client-side JavaScript (ES6 modules)');
    console.log('✓ Tailwind CSS responsive design');
    console.log('✓ Mock data ile çalışma');
    console.log('✓ Erişilebilirlik (a11y) özellikleri');
    console.log('✓ Modüler bileşen yapısı');
    console.log('✓ Form validation');
    console.log('✓ Filtreleme ve sıralama');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #d1d5db;');
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        displayAppInfo();
        initApp();
    });
} else {
    displayAppInfo();
    initApp();
}

// Export for potential use in tests
export { initApp, handleSearch, fetchFlights };
