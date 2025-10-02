/**
 * FlightList Component - Display list of flights with sorting and filtering
 * Uçuş Listesi Bileşeni - Sıralama ve filtreleme ile uçuş listesini görüntüle
 * 
 * Shows flight results with options to sort and filter
 * Sıralama ve filtreleme seçenekleri ile uçuş sonuçlarını gösterir
 */

import React, { useState, useMemo } from 'react';
import { Flight, SortOption } from '../../types/flight';
import FlightCard from '../FlightCard/FlightCard';

interface FlightListProps {
  flights: Flight[];
  onFlightSelect: (flight: Flight) => void;
}

/**
 * Component to display and manage flight list
 * Uçuş listesini görüntülemek ve yönetmek için bileşen
 */
const FlightList: React.FC<FlightListProps> = ({ flights, onFlightSelect }) => {
  const [sortBy, setSortBy] = useState<SortOption>('price-asc');
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [directOnly, setDirectOnly] = useState(false);

  /**
   * Sort and filter flights based on user preferences
   * Kullanıcı tercihlerine göre uçuşları sırala ve filtrele
   */
  const processedFlights = useMemo(() => {
    let result = [...flights];

    // Apply filters
    if (maxPrice) {
      result = result.filter((flight) => flight.price <= maxPrice);
    }

    if (directOnly) {
      result = result.filter((flight) => flight.stops === 0);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'departure-asc':
          return new Date(a.departure).getTime() - new Date(b.departure).getTime();
        case 'departure-desc':
          return new Date(b.departure).getTime() - new Date(a.departure).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [flights, sortBy, maxPrice, directOnly]);

  // Calculate max price for filter slider
  const maxFlightPrice = Math.max(...flights.map((f) => f.price));

  if (flights.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-16 h-16 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-gray-600 text-lg">Uçuş arayın</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters and Sorting */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-semibold text-gray-800 mb-3">Sıralama ve Filtreler</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Sort By */}
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
              Sırala
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="price-asc">Fiyat (Düşükten Yükseğe)</option>
              <option value="price-desc">Fiyat (Yüksekten Düşüğe)</option>
              <option value="departure-asc">Kalkış (Erkenden Geçe)</option>
              <option value="departure-desc">Kalkış (Geçten Erkene)</option>
            </select>
          </div>

          {/* Max Price Filter */}
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Maksimum Fiyat: {maxPrice ? `${maxPrice} TRY` : 'Sınırsız'}
            </label>
            <input
              id="maxPrice"
              type="range"
              min={0}
              max={maxFlightPrice}
              step={100}
              value={maxPrice || maxFlightPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full"
            />
            <button
              onClick={() => setMaxPrice(undefined)}
              className="text-xs text-primary-600 hover:text-primary-700 mt-1"
            >
              Sıfırla
            </button>
          </div>

          {/* Direct Flights Only */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={directOnly}
                onChange={(e) => setDirectOnly(e.target.checked)}
                className="w-4 h-4 text-primary-500 focus:ring-primary-500 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Sadece Direkt Uçuşlar</span>
            </label>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        {processedFlights.length} uçuş bulundu
        {processedFlights.length !== flights.length && ` (${flights.length} toplam)`}
      </div>

      {/* Flight Cards */}
      {processedFlights.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600">Filtrelere uygun uçuş bulunamadı</p>
          <button
            onClick={() => {
              setMaxPrice(undefined);
              setDirectOnly(false);
            }}
            className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            Filtreleri Temizle
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {processedFlights.map((flight) => (
            <FlightCard
              key={flight.id}
              flight={flight}
              onDetailsClick={onFlightSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FlightList;
