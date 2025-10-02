/**
 * FlightDetailModal Component - Modal for detailed flight information
 * Uçuş Detay Modal Bileşeni - Detaylı uçuş bilgileri için modal
 * 
 * Displays comprehensive flight details including policy, aircraft type
 * Politika, uçak tipi dahil kapsamlı uçuş detaylarını gösterir
 */

import React, { useEffect } from 'react';
import { Flight } from '../../types/flight';
import { formatDate, formatCurrency, calculateDuration } from '../../utils/formatters';
import Button from '../Shared/Button';

interface FlightDetailModalProps {
  flight: Flight | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Accessible modal component for flight details
 * Uçuş detayları için erişilebilir modal bileşeni
 */
const FlightDetailModal: React.FC<FlightDetailModalProps> = ({ flight, isOpen, onClose }) => {
  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !flight) return null;

  const duration = calculateDuration(flight.departure, flight.arrival);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-800">
            Uçuş Detayları
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
            aria-label="Modalı kapat"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Flight Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800">{flight.airline}</h3>
              <p className="text-gray-600">{flight.flightNumber}</p>
            </div>
            <p className="text-3xl font-bold text-primary-600">
              {formatCurrency(flight.price, flight.currency)}
            </p>
          </div>

          {/* Flight Route */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Kalkış</p>
                <p className="text-lg font-bold">{flight.origin}</p>
                <p className="text-sm text-gray-700">{formatDate(flight.departure)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">{duration}</p>
                <svg 
                  className="w-8 h-8 text-gray-400 mx-auto" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M14 5l7 7m0 0l-7 7m7-7H3" 
                  />
                </svg>
                {flight.stops > 0 && (
                  <p className="text-xs text-orange-600">{flight.stops} Aktarma</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Varış</p>
                <p className="text-lg font-bold">{flight.destination}</p>
                <p className="text-sm text-gray-700">{formatDate(flight.arrival)}</p>
              </div>
            </div>
          </div>

          {/* Flight Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Uçak Tipi</p>
              <p className="font-semibold text-gray-800">{flight.aircraft}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Sınıf</p>
              <p className="font-semibold text-gray-800">{flight.class || 'Economy'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Aktarma</p>
              <p className="font-semibold text-gray-800">
                {flight.stops === 0 ? 'Direkt Uçuş' : `${flight.stops} Aktarma`}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">İptal/Değişiklik Politikası</p>
              <p className="font-semibold text-gray-800">{flight.policy}</p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Önemli Bilgiler</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Uçuştan en az 2 saat önce havaalanında bulunmanız önerilir</li>
              <li>• Bagaj ücretleri bilet fiyatına dahil değildir</li>
              <li>• Kimlik veya pasaport getirmeyi unutmayın</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose}>
            Kapat
          </Button>
          <Button variant="primary" onClick={() => alert('Satın alma sayfası yakında!')}>
            Satın Al
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlightDetailModal;
