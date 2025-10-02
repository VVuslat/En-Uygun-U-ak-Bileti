/**
 * SUNUM NOTU: Bu dosya erişilebilir (accessible) modal pencere yönetir.
 * Klavye navigasyonu (ESC tuşu), focus trap, ARIA etiketleri - MYK standartlarına uygun.
 * Modal içeriği client-side oluşturulur, sunucu kodu yok.
 * 
 * Bu dosya ne işe yarar:
 * - Uçuş detay modal'ını açar/kapar
 * - Erişilebilirlik özellikleri: ESC tuşu, focus trap, ARIA
 * - Kullanıcı deneyimini iyileştirir
 */

import { formatTime, formatDate, formatPrice } from './utils.js';

// Store the currently open modal for cleanup
let currentModal = null;

/**
 * Opens a modal with flight details
 * @param {Object} flight - Flight data object
 */
export function openModal(flight) {
    // Close any existing modal first
    closeModal();
    
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) {
        console.error('Modal container not found');
        return;
    }
    
    const modalHTML = createModalHTML(flight);
    modalContainer.innerHTML = modalHTML;
    
    // Get modal elements
    const modal = document.getElementById('flight-modal');
    const overlay = document.getElementById('modal-overlay');
    
    if (!modal || !overlay) {
        console.error('Modal elements not found');
        return;
    }
    
    // Store current modal
    currentModal = modal;
    
    // Attach event handlers
    attachModalHandlers(modal, overlay);
    
    // Show modal with animation
    setTimeout(() => {
        overlay.classList.remove('opacity-0');
        overlay.classList.add('opacity-100');
        modal.classList.remove('opacity-0', 'scale-95');
        modal.classList.add('opacity-100', 'scale-100');
    }, 10);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus on modal for accessibility
    modal.focus();
}

/**
 * Closes the currently open modal
 */
export function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('flight-modal');
    
    if (overlay && modal) {
        // Animate out
        overlay.classList.remove('opacity-100');
        overlay.classList.add('opacity-0');
        modal.classList.remove('opacity-100', 'scale-100');
        modal.classList.add('opacity-0', 'scale-95');
        
        // Remove from DOM after animation
        setTimeout(() => {
            const modalContainer = document.getElementById('modal-container');
            if (modalContainer) {
                modalContainer.innerHTML = '';
            }
        }, 300);
    }
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Clear current modal reference
    currentModal = null;
}

/**
 * Creates the modal HTML structure
 * @param {Object} flight - Flight data object
 * @returns {string} Modal HTML
 */
function createModalHTML(flight) {
    const departureTime = formatTime(flight.departure);
    const arrivalTime = formatTime(flight.arrival);
    const departureDate = formatDate(flight.departure);
    const price = formatPrice(flight.price, flight.currency);
    
    return `
        <!-- Modal Overlay -->
        <div 
            id="modal-overlay" 
            class="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 opacity-0"
            aria-hidden="true">
        </div>
        
        <!-- Modal Dialog -->
        <div 
            id="flight-modal"
            class="fixed inset-0 z-50 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            tabindex="-1">
            
            <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full opacity-0 scale-95">
                    
                    <!-- Modal Header -->
                    <div class="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
                        <div class="flex items-center justify-between">
                            <h2 id="modal-title" class="text-2xl font-bold text-white flex items-center">
                                <i class="fas fa-plane mr-2"></i>
                                Uçuş Detayları
                            </h2>
                            <button 
                                id="modal-close-button"
                                class="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white rounded-full p-2"
                                aria-label="Kapat">
                                <i class="fas fa-times text-2xl"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Modal Body -->
                    <div class="px-6 py-6 space-y-6">
                        
                        <!-- Airline Info -->
                        <div class="flex items-center space-x-4 pb-4 border-b">
                            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-plane text-blue-600 text-2xl"></i>
                            </div>
                            <div>
                                <h3 class="text-2xl font-bold text-gray-800">${flight.airline}</h3>
                                <p class="text-gray-600">Uçuş No: ${flight.flightNumber}</p>
                                <p class="text-sm text-gray-500">${flight.aircraft}</p>
                            </div>
                        </div>
                        
                        <!-- Flight Route -->
                        <div class="bg-blue-50 rounded-lg p-6">
                            <div class="flex items-center justify-between">
                                <div class="text-center flex-1">
                                    <p class="text-sm text-gray-600 mb-2">Kalkış</p>
                                    <p class="text-3xl font-bold text-gray-800">${departureTime}</p>
                                    <p class="text-xl font-semibold text-blue-600 mt-2">${flight.departureAirport}</p>
                                    <p class="text-sm text-gray-500 mt-1">${departureDate}</p>
                                </div>
                                
                                <div class="flex-1 px-8">
                                    <div class="relative">
                                        <div class="h-1 bg-blue-300 w-full rounded"></div>
                                        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 rounded-full p-3">
                                            <i class="fas fa-plane text-white"></i>
                                        </div>
                                    </div>
                                    <p class="text-center text-sm text-gray-600 mt-2">${flight.duration}</p>
                                    ${flight.stops > 0 ? `<p class="text-center text-xs text-yellow-600 font-semibold">${flight.stops} Aktarma</p>` : '<p class="text-center text-xs text-green-600 font-semibold">Direkt Uçuş</p>'}
                                </div>
                                
                                <div class="text-center flex-1">
                                    <p class="text-sm text-gray-600 mb-2">Varış</p>
                                    <p class="text-3xl font-bold text-gray-800">${arrivalTime}</p>
                                    <p class="text-xl font-semibold text-blue-600 mt-2">${flight.arrivalAirport}</p>
                                    <p class="text-sm text-gray-500 mt-1">${departureDate}</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Flight Details Grid -->
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-gray-50 rounded-lg p-4">
                                <p class="text-sm text-gray-600 mb-1">
                                    <i class="fas fa-suitcase mr-2"></i>Bagaj
                                </p>
                                <p class="font-semibold text-gray-800">${flight.baggage}</p>
                            </div>
                            
                            <div class="bg-gray-50 rounded-lg p-4">
                                <p class="text-sm text-gray-600 mb-1">
                                    <i class="fas fa-chair mr-2"></i>Müsait Koltuk
                                </p>
                                <p class="font-semibold text-gray-800">${flight.availableSeats} koltuk</p>
                            </div>
                            
                            <div class="bg-gray-50 rounded-lg p-4">
                                <p class="text-sm text-gray-600 mb-1">
                                    <i class="fas fa-info-circle mr-2"></i>Politika
                                </p>
                                <p class="font-semibold text-gray-800">${flight.policy}</p>
                            </div>
                            
                            <div class="bg-gray-50 rounded-lg p-4">
                                <p class="text-sm text-gray-600 mb-1">
                                    <i class="fas fa-exchange-alt mr-2"></i>Aktarma
                                </p>
                                <p class="font-semibold text-gray-800">${flight.stops === 0 ? 'Direkt' : flight.stops + ' aktarma'}</p>
                            </div>
                        </div>
                        
                        ${flight.stopover ? `
                        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                            <p class="text-sm font-semibold text-yellow-800">
                                <i class="fas fa-plane-arrival mr-2"></i>Aktarma Noktası
                            </p>
                            <p class="text-yellow-700 mt-1">${flight.stopover}</p>
                        </div>
                        ` : ''}
                        
                        <!-- Price Section -->
                        <div class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white text-center">
                            <p class="text-sm mb-2">Toplam Fiyat</p>
                            <p class="text-5xl font-bold">${price}</p>
                            <p class="text-sm mt-2 opacity-90">Vergiler dahil</p>
                        </div>
                    </div>
                    
                    <!-- Modal Footer -->
                    <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                        <button 
                            id="modal-close-button-footer"
                            class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition">
                            Kapat
                        </button>
                        <button 
                            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                            <i class="fas fa-external-link-alt mr-2"></i>
                            Rezervasyon Yap
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Attaches event handlers to modal elements
 * @param {HTMLElement} modal - Modal element
 * @param {HTMLElement} overlay - Overlay element
 */
function attachModalHandlers(modal, overlay) {
    // Close button handlers
    const closeButtons = [
        document.getElementById('modal-close-button'),
        document.getElementById('modal-close-button-footer')
    ];
    
    closeButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', closeModal);
        }
    });
    
    // Close on overlay click
    overlay.addEventListener('click', closeModal);
    
    // Close on ESC key press (accessibility)
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    
    document.addEventListener('keydown', escapeHandler);
    
    // Focus trap for accessibility
    setupFocusTrap(modal);
}

/**
 * Sets up focus trap within modal for accessibility
 * @param {HTMLElement} modal - Modal element
 */
function setupFocusTrap(modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    modal.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    });
}
