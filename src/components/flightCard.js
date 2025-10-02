/**
 * SUNUM NOTU: Bu dosya tek bir uçuş kartının render edilmesinden sorumlu.
 * Her uçuş bilgisi: havayolu, saatler, fiyat, aktarma bilgisi vb.
 * Detay butonu modal açar - client-side dinamik içerik.
 * 
 * Bu dosya ne işe yarar:
 * - Tek bir uçuş kartı HTML'ini oluşturur
 * - Uçuş bilgilerini formatlar ve gösterir
 * - Detay butonuna tıklandığında modal açar
 */

import { formatTime, formatDate, formatPrice } from './utils.js';
import { openModal } from './modal.js';

/**
 * Renders a single flight card
 * @param {Object} flight - Flight data object
 * @returns {string} HTML string for the flight card
 */
export function renderFlightCard(flight) {
    const departureTime = formatTime(flight.departure);
    const arrivalTime = formatTime(flight.arrival);
    const price = formatPrice(flight.price, flight.currency);
    const stopsBadge = flight.stops === 0 
        ? '<span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Direkt</span>'
        : `<span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">${flight.stops} Aktarma</span>`;
    
    const policyColor = 
        flight.policy === 'İade edilebilir' ? 'text-green-600' :
        flight.policy === 'Değiştirilebilir' ? 'text-blue-600' :
        'text-red-600';
    
    return `
        <div class="flight-card bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 mb-4" 
             data-flight-id="${flight.id}">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <!-- Airline Info -->
                <div class="md:col-span-3">
                    <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-plane text-blue-600 text-xl"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-800">${flight.airline}</h3>
                            <p class="text-sm text-gray-500">${flight.flightNumber}</p>
                        </div>
                    </div>
                </div>

                <!-- Flight Times -->
                <div class="md:col-span-4">
                    <div class="flex items-center justify-between">
                        <div class="text-center">
                            <p class="text-2xl font-bold text-gray-800">${departureTime}</p>
                            <p class="text-sm text-gray-600">${flight.departureAirport}</p>
                        </div>
                        
                        <div class="flex-1 px-4">
                            <div class="relative">
                                <div class="h-0.5 bg-gray-300 w-full"></div>
                                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                                    <i class="fas fa-plane text-gray-400"></i>
                                </div>
                            </div>
                            <p class="text-xs text-gray-500 text-center mt-1">${flight.duration}</p>
                        </div>
                        
                        <div class="text-center">
                            <p class="text-2xl font-bold text-gray-800">${arrivalTime}</p>
                            <p class="text-sm text-gray-600">${flight.arrivalAirport}</p>
                        </div>
                    </div>
                </div>

                <!-- Flight Details -->
                <div class="md:col-span-3">
                    <div class="space-y-2">
                        <div class="flex items-center space-x-2">
                            ${stopsBadge}
                            <span class="text-xs text-gray-500">${flight.aircraft}</span>
                        </div>
                        <div class="text-sm ${policyColor} flex items-center">
                            <i class="fas fa-info-circle mr-1"></i>
                            ${flight.policy}
                        </div>
                        <div class="text-sm text-gray-600">
                            <i class="fas fa-suitcase mr-1"></i>
                            ${flight.baggage}
                        </div>
                    </div>
                </div>

                <!-- Price and Action -->
                <div class="md:col-span-2 text-center md:text-right">
                    <div class="mb-3">
                        <p class="text-3xl font-bold text-blue-600">${price}</p>
                        <p class="text-xs text-gray-500">${flight.availableSeats} koltuk kaldı</p>
                    </div>
                    <button 
                        class="details-button w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                        data-flight-id="${flight.id}"
                        aria-label="Uçuş detaylarını görüntüle">
                        Detaylar
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Attaches event handlers to flight card buttons
 * @param {Object} flight - Flight data object
 */
export function attachFlightCardHandlers(flight) {
    const buttons = document.querySelectorAll(`[data-flight-id="${flight.id}"]`);
    
    buttons.forEach(button => {
        if (button.classList.contains('details-button')) {
            button.addEventListener('click', () => {
                openModal(flight);
            });
        }
    });
}

/**
 * Creates and renders a flight card element
 * @param {Object} flight - Flight data object
 * @returns {HTMLElement} Flight card element
 */
export function createFlightCardElement(flight) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = renderFlightCard(flight);
    const cardElement = wrapper.firstElementChild;
    
    // Attach handlers after creating the element
    setTimeout(() => {
        attachFlightCardHandlers(flight);
    }, 0);
    
    return cardElement;
}
