/**
 * SUNUM NOTU: Bu dosya filtreleme ve sıralama işlemlerini yönetir.
 * Kullanıcı client-side filtre uygular: fiyat, kalkış saati, aktarma sayısı.
 * Tüm işlemler tarayıcıda - sunucu çağrısı yok, hızlı ve responsive.
 * 
 * Bu dosya ne işe yarar:
 * - Filtreleme UI'ını render eder
 * - Uçuşları kullanıcı tercihine göre filtreler
 * - Sıralama seçenekleri sunar (fiyat, süre, kalkış saati)
 */

/**
 * Renders the filters UI
 * @param {HTMLElement} container - Container element
 */
export function renderFilters(container) {
    if (!container) {
        console.error('Filters container not found');
        return;
    }
    
    const filtersHTML = `
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Sort By -->
            <div>
                <label for="sort-by" class="block text-sm font-medium text-gray-700 mb-2">
                    <i class="fas fa-sort mr-1"></i>
                    Sırala
                </label>
                <select 
                    id="sort-by" 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="price-asc">Fiyat (Düşükten Yükseğe)</option>
                    <option value="price-desc">Fiyat (Yüksekten Düşüğe)</option>
                    <option value="departure-asc">Kalkış Saati (Erkenden Geçe)</option>
                    <option value="departure-desc">Kalkış Saati (Geçten Erkene)</option>
                    <option value="duration-asc">Süre (Kısadan Uzuna)</option>
                </select>
            </div>
            
            <!-- Filter by Stops -->
            <div>
                <label for="filter-stops" class="block text-sm font-medium text-gray-700 mb-2">
                    <i class="fas fa-exchange-alt mr-1"></i>
                    Aktarma
                </label>
                <select 
                    id="filter-stops" 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="all">Tümü</option>
                    <option value="direct">Direkt Uçuşlar</option>
                    <option value="with-stops">Aktarmalı Uçuşlar</option>
                </select>
            </div>
            
            <!-- Filter by Airline -->
            <div>
                <label for="filter-airline" class="block text-sm font-medium text-gray-700 mb-2">
                    <i class="fas fa-plane mr-1"></i>
                    Havayolu
                </label>
                <select 
                    id="filter-airline" 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="all">Tüm Havayolları</option>
                </select>
            </div>
            
            <!-- Price Range -->
            <div>
                <label for="filter-price" class="block text-sm font-medium text-gray-700 mb-2">
                    <i class="fas fa-tag mr-1"></i>
                    Maksimum Fiyat: <span id="price-value">-</span>
                </label>
                <input 
                    type="range" 
                    id="filter-price" 
                    min="0" 
                    max="5000" 
                    step="50"
                    value="5000"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
            </div>
        </div>
    `;
    
    container.innerHTML = filtersHTML;
}

/**
 * Populates airline filter with unique airlines from flights
 * @param {Array<Object>} flights - Array of flight objects
 */
export function populateAirlineFilter(flights) {
    const airlineSelect = document.getElementById('filter-airline');
    if (!airlineSelect) return;
    
    // Get unique airlines
    const airlines = [...new Set(flights.map(f => f.airline))];
    
    // Keep the "all" option and add airlines
    const currentValue = airlineSelect.value;
    airlineSelect.innerHTML = '<option value="all">Tüm Havayolları</option>';
    
    airlines.sort().forEach(airline => {
        const option = document.createElement('option');
        option.value = airline;
        option.textContent = airline;
        airlineSelect.appendChild(option);
    });
    
    // Restore previous selection if it exists
    if (currentValue !== 'all' && airlines.includes(currentValue)) {
        airlineSelect.value = currentValue;
    }
}

/**
 * Updates price range filter based on available flights
 * @param {Array<Object>} flights - Array of flight objects
 */
export function updatePriceFilter(flights) {
    const priceFilter = document.getElementById('filter-price');
    const priceValue = document.getElementById('price-value');
    
    if (!priceFilter || !flights || flights.length === 0) return;
    
    const prices = flights.map(f => f.price);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    
    priceFilter.min = minPrice;
    priceFilter.max = maxPrice;
    priceFilter.value = maxPrice;
    
    priceValue.textContent = `${maxPrice.toLocaleString('tr-TR')} ₺`;
}

/**
 * Attaches event handlers to filter controls
 * @param {Function} onFilterChange - Callback when filters change
 */
export function attachFilterHandlers(onFilterChange) {
    const sortBy = document.getElementById('sort-by');
    const filterStops = document.getElementById('filter-stops');
    const filterAirline = document.getElementById('filter-airline');
    const filterPrice = document.getElementById('filter-price');
    const priceValue = document.getElementById('price-value');
    
    // Sort handler
    if (sortBy) {
        sortBy.addEventListener('change', () => {
            if (typeof onFilterChange === 'function') {
                onFilterChange();
            }
        });
    }
    
    // Stops filter handler
    if (filterStops) {
        filterStops.addEventListener('change', () => {
            if (typeof onFilterChange === 'function') {
                onFilterChange();
            }
        });
    }
    
    // Airline filter handler
    if (filterAirline) {
        filterAirline.addEventListener('change', () => {
            if (typeof onFilterChange === 'function') {
                onFilterChange();
            }
        });
    }
    
    // Price filter handler with real-time update
    if (filterPrice && priceValue) {
        filterPrice.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            priceValue.textContent = `${value.toLocaleString('tr-TR')} ₺`;
        });
        
        filterPrice.addEventListener('change', () => {
            if (typeof onFilterChange === 'function') {
                onFilterChange();
            }
        });
    }
}

/**
 * Applies filters and sorting to flight list
 * @param {Array<Object>} flights - Original array of flight objects
 * @returns {Array<Object>} Filtered and sorted flights
 */
export function applyFiltersAndSort(flights) {
    if (!flights || flights.length === 0) return [];
    
    let filteredFlights = [...flights];
    
    // Apply stops filter
    const stopsFilter = document.getElementById('filter-stops')?.value;
    if (stopsFilter === 'direct') {
        filteredFlights = filteredFlights.filter(f => f.stops === 0);
    } else if (stopsFilter === 'with-stops') {
        filteredFlights = filteredFlights.filter(f => f.stops > 0);
    }
    
    // Apply airline filter
    const airlineFilter = document.getElementById('filter-airline')?.value;
    if (airlineFilter && airlineFilter !== 'all') {
        filteredFlights = filteredFlights.filter(f => f.airline === airlineFilter);
    }
    
    // Apply price filter
    const priceFilter = document.getElementById('filter-price');
    if (priceFilter) {
        const maxPrice = parseInt(priceFilter.value);
        filteredFlights = filteredFlights.filter(f => f.price <= maxPrice);
    }
    
    // Apply sorting
    const sortBy = document.getElementById('sort-by')?.value;
    filteredFlights = sortFlights(filteredFlights, sortBy);
    
    return filteredFlights;
}

/**
 * Sorts flights based on selected criteria
 * @param {Array<Object>} flights - Array of flight objects
 * @param {string} sortBy - Sort criteria
 * @returns {Array<Object>} Sorted flights
 */
function sortFlights(flights, sortBy) {
    const sorted = [...flights];
    
    switch (sortBy) {
        case 'price-asc':
            return sorted.sort((a, b) => a.price - b.price);
        
        case 'price-desc':
            return sorted.sort((a, b) => b.price - a.price);
        
        case 'departure-asc':
            return sorted.sort((a, b) => 
                new Date(a.departure) - new Date(b.departure)
            );
        
        case 'departure-desc':
            return sorted.sort((a, b) => 
                new Date(b.departure) - new Date(a.departure)
            );
        
        case 'duration-asc':
            return sorted.sort((a, b) => {
                const durationA = parseDuration(a.duration);
                const durationB = parseDuration(b.duration);
                return durationA - durationB;
            });
        
        default:
            return sorted;
    }
}

/**
 * Parses duration string to minutes
 * @param {string} duration - Duration string (e.g., "1h 40m")
 * @returns {number} Duration in minutes
 */
function parseDuration(duration) {
    const match = duration.match(/(\d+)h\s*(\d+)m/);
    if (!match) return 0;
    
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    
    return hours * 60 + minutes;
}

/**
 * Gets current filter state
 * @returns {Object} Current filter values
 */
export function getFilterState() {
    return {
        sortBy: document.getElementById('sort-by')?.value || 'price-asc',
        stops: document.getElementById('filter-stops')?.value || 'all',
        airline: document.getElementById('filter-airline')?.value || 'all',
        maxPrice: parseInt(document.getElementById('filter-price')?.value) || 5000
    };
}

/**
 * Resets all filters to default
 */
export function resetFilters() {
    const sortBy = document.getElementById('sort-by');
    const filterStops = document.getElementById('filter-stops');
    const filterAirline = document.getElementById('filter-airline');
    const filterPrice = document.getElementById('filter-price');
    
    if (sortBy) sortBy.value = 'price-asc';
    if (filterStops) filterStops.value = 'all';
    if (filterAirline) filterAirline.value = 'all';
    if (filterPrice) filterPrice.value = filterPrice.max;
}
