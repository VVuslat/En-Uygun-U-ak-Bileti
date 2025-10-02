/**
 * SUNUM NOTU: Bu dosya uçuş listesinin tamamını render eder.
 * Birden fazla uçuş kartını bir arada yönetir.
 * Boş liste durumunu da handle eder - kullanıcı deneyimi önemli.
 * 
 * Bu dosya ne işe yarar:
 * - Tüm uçuş listesini render eder
 * - Her uçuş için flightCard bileşenini kullanır
 * - Liste durumlarını yönetir (boş, yükleniyor, hata)
 * - Sonuç sayısını gösterir
 */

import { createFlightCardElement } from './flightCard.js';

/**
 * Renders the complete flight list
 * @param {Array<Object>} flights - Array of flight objects
 * @param {HTMLElement} container - Container element to render into
 */
export function renderFlightList(flights, container) {
    if (!container) {
        console.error('Flight list container not found');
        return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Check if flights array is empty
    if (!flights || flights.length === 0) {
        showEmptyState();
        hideLoadingState();
        hideResultsSection();
        return;
    }
    
    // Show results section and hide empty/error states
    showResultsSection();
    hideEmptyState();
    hideErrorState();
    hideLoadingState();
    
    // Update results count
    updateResultsCount(flights.length);
    
    // Render each flight card
    flights.forEach(flight => {
        const cardElement = createFlightCardElement(flight);
        container.appendChild(cardElement);
    });
    
    // Scroll to results
    scrollToResults();
}

/**
 * Shows the loading state
 */
export function showLoadingState() {
    const loadingState = document.getElementById('loading-state');
    if (loadingState) {
        loadingState.classList.remove('hidden');
    }
    
    hideResultsSection();
    hideEmptyState();
    hideErrorState();
}

/**
 * Hides the loading state
 */
export function hideLoadingState() {
    const loadingState = document.getElementById('loading-state');
    if (loadingState) {
        loadingState.classList.add('hidden');
    }
}

/**
 * Shows the empty state (no results found)
 */
export function showEmptyState() {
    const emptyState = document.getElementById('empty-state');
    if (emptyState) {
        emptyState.classList.remove('hidden');
    }
    
    hideLoadingState();
    hideResultsSection();
    hideErrorState();
}

/**
 * Hides the empty state
 */
export function hideEmptyState() {
    const emptyState = document.getElementById('empty-state');
    if (emptyState) {
        emptyState.classList.add('hidden');
    }
}

/**
 * Shows error state with a message
 * @param {string} message - Error message to display
 */
export function showErrorState(message = 'Bir hata oluştu. Lütfen tekrar deneyin.') {
    const errorState = document.getElementById('error-state');
    const errorMessage = document.getElementById('error-message');
    
    if (errorState && errorMessage) {
        errorMessage.textContent = message;
        errorState.classList.remove('hidden');
    }
    
    hideLoadingState();
    hideResultsSection();
    hideEmptyState();
}

/**
 * Hides the error state
 */
export function hideErrorState() {
    const errorState = document.getElementById('error-state');
    if (errorState) {
        errorState.classList.add('hidden');
    }
}

/**
 * Shows the results section
 */
function showResultsSection() {
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) {
        resultsSection.classList.remove('hidden');
    }
    
    // Also show filters section when there are results
    const filtersSection = document.getElementById('filters-section');
    if (filtersSection) {
        filtersSection.classList.remove('hidden');
    }
}

/**
 * Hides the results section
 */
function hideResultsSection() {
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) {
        resultsSection.classList.add('hidden');
    }
    
    // Also hide filters section
    const filtersSection = document.getElementById('filters-section');
    if (filtersSection) {
        filtersSection.classList.add('hidden');
    }
}

/**
 * Updates the results count display
 * @param {number} count - Number of results
 */
function updateResultsCount(count) {
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        resultsCount.textContent = `(${count} uçuş bulundu)`;
    }
}

/**
 * Scrolls to the results section smoothly
 */
function scrollToResults() {
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) {
        setTimeout(() => {
            resultsSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 100);
    }
}

/**
 * Clears the flight list
 */
export function clearFlightList() {
    const container = document.getElementById('flight-list-container');
    if (container) {
        container.innerHTML = '';
    }
    
    hideResultsSection();
    hideEmptyState();
    hideErrorState();
    hideLoadingState();
}
