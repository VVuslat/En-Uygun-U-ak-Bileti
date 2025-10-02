/**
 * FlightCard Component - Display individual flight information
 * Uçuş Kartı Bileşeni - Tek bir uçuş bilgisini görüntüle
 * 
 * Shows flight details with price, time, airline, and stops
 * Fiyat, zaman, havayolu ve aktarma bilgileri ile uçuş detaylarını gösterir
 */

import React from 'react';
import { Flight } from '../../types/flight';
import { formatTime, formatCurrency, calculateDuration } from '../../utils/formatters';
import Button from '../Shared/Button';

interface FlightCardProps {
  flight: Flight;
  onDetailsClick: (flight: Flight) => void;
}

/**
 * Card component to display flight information
 * Uçuş bilgilerini görüntülemek için kart bileşeni
 */
const FlightCard: React.FC<FlightCardProps> = ({ flight, onDetailsClick }) => {
  const duration = calculateDuration(flight.departure, flight.arrival);

  return (
    <article 
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
      aria-label={`${flight.airline} uçuşu ${flight.flightNumber}`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Airline and Flight Number */}
        <div className="flex-shrink-0">
          <h3 className="font-bold text-lg text-gray-800">{flight.airline}</h3>
          <p className="text-sm text-gray-600">{flight.flightNumber}</p>
        </div>

        {/* Flight Times */}
        <div className="flex items-center gap-4 flex-grow">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {formatTime(flight.departure)}
            </p>
            <p className="text-sm text-gray-600">{flight.origin}</p>
          </div>

          <div className="flex-grow">
            <div className="relative">
              <div className="border-t-2 border-gray-300"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                <svg 
                  className="w-6 h-6 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M14 5l7 7m0 0l-7 7m7-7H3" 
                  />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-600 text-center mt-1">{duration}</p>
            {flight.stops > 0 && (
              <p className="text-xs text-orange-600 text-center mt-1">
                {flight.stops} Aktarma
              </p>
            )}
            {flight.stops === 0 && (
              <p className="text-xs text-green-600 text-center mt-1">
                Direkt Uçuş
              </p>
            )}
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {formatTime(flight.arrival)}
            </p>
            <p className="text-sm text-gray-600">{flight.destination}</p>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <p className="text-2xl font-bold text-primary-600">
            {formatCurrency(flight.price, flight.currency)}
          </p>
          <Button
            variant="primary"
            onClick={() => onDetailsClick(flight)}
            ariaLabel={`${flight.flightNumber} uçuşunun detaylarını gör`}
          >
            Detaylar
          </Button>
        </div>
      </div>
    </article>
  );
};

export default FlightCard;
