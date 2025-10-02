/**
 * useFlights Hook - Custom hook for flight search state management
 * useFlights Hook - Uçuş arama durum yönetimi için özel hook
 * 
 * Manages loading, error states, and flight data
 * Yükleme, hata durumları ve uçuş verilerini yönetir
 */

import { useState } from 'react';
import { Flight, SearchParams } from '../types/flight';
import { searchFlights } from '../api/flightService';

interface UseFlightsReturn {
  flights: Flight[];
  loading: boolean;
  error: string | null;
  searchFlights: (params: SearchParams) => Promise<void>;
  clearFlights: () => void;
  clearError: () => void;
}

/**
 * Custom hook for managing flight search state
 * Uçuş arama durumunu yönetmek için özel hook
 */
export const useFlights = (): UseFlightsReturn => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Perform flight search
   * Uçuş araması yap
   */
  const handleSearch = async (params: SearchParams): Promise<void> => {
    setLoading(true);
    setError(null);
    setFlights([]);

    try {
      const result = await searchFlights(params);
      setFlights(result.flights);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Bir hata oluştu. Lütfen tekrar deneyin.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear flight results
   * Uçuş sonuçlarını temizle
   */
  const clearFlights = (): void => {
    setFlights([]);
  };

  /**
   * Clear error message
   * Hata mesajını temizle
   */
  const clearError = (): void => {
    setError(null);
  };

  return {
    flights,
    loading,
    error,
    searchFlights: handleSearch,
    clearFlights,
    clearError,
  };
};
