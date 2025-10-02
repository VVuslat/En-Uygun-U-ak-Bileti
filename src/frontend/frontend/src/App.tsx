/**
 * Main App Component
 * Ana Uygulama Bileşeni
 * 
 * MYK Yazılım Geliştirici Seviye 5 standardına uygun uçuş arama uygulaması
 * Flight search application compliant with MYK Software Developer Level 5 standards
 */

import React, { useState } from 'react';
import SearchForm from './components/SearchForm/SearchForm';
import FlightList from './components/FlightList/FlightList';
import FlightDetailModal from './components/FlightDetailModal/FlightDetailModal';
import { useFlights } from './hooks/useFlights';
import { Flight } from './types/flight';

function App() {
  const { flights, loading, error, searchFlights, clearError } = useFlights();
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Handle flight selection for details modal
   * Detay modalı için uçuş seçimini işle
   */
  const handleFlightSelect = (flight: Flight) => {
    setSelectedFlight(flight);
    setIsModalOpen(true);
  };

  /**
   * Handle modal close
   * Modal kapatmayı işle
   */
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedFlight(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-primary-600 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center">En Uygun Uçak Bileti</h1>
          <p className="text-center text-primary-100 mt-2">
            Uçuş bileti arama ve karşılaştırma platformu
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Search Form */}
          <SearchForm onSearch={searchFlights} loading={loading} />

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12" role="status" aria-live="polite">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Uçuşlar aranıyor...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div 
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
              role="alert"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
                <button
                  onClick={clearError}
                  className="text-red-700 hover:text-red-900"
                  aria-label="Hatayı kapat"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Flight List */}
          {!loading && !error && (
            <FlightList flights={flights} onFlightSelect={handleFlightSelect} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © 2025 En Uygun Uçak Bileti - MYK Seviye 5 Uyumlu Proje
          </p>
          <p className="text-xs text-gray-400 mt-2">
            React, TypeScript, TailwindCSS ile geliştirilmiştir
          </p>
        </div>
      </footer>

      {/* Flight Detail Modal */}
      <FlightDetailModal
        flight={selectedFlight}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}

export default App;

