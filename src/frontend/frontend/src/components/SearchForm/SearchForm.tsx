/**
 * SearchForm Component - Flight search form with validation
 * Arama Formu Bileşeni - Doğrulamalı uçuş arama formu
 * 
 * Allows users to search for flights by origin, destination, and date
 * Kullanıcıların kalkış, varış ve tarihe göre uçuş aramasını sağlar
 */

import React, { useState } from 'react';
import { SearchParams } from '../../types/flight';
import Input from '../Shared/Input';
import Button from '../Shared/Button';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  loading: boolean;
}

/**
 * Flight search form component with accessibility features
 * Erişilebilirlik özellikleri ile uçuş arama formu bileşeni
 */
const SearchForm: React.FC<SearchFormProps> = ({ onSearch, loading }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [tripType, setTripType] = useState<'oneWay' | 'roundTrip'>('oneWay');

  // Get today's date in YYYY-MM-DD format for min date validation
  const today = new Date().toISOString().split('T')[0];

  /**
   * Handle form submission
   * Form gönderimini işle
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const searchParams: SearchParams = {
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      departureDate,
      tripType,
    };

    if (tripType === 'roundTrip' && returnDate) {
      searchParams.returnDate = returnDate;
    }

    onSearch(searchParams);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white p-6 rounded-lg shadow-md space-y-4"
      aria-label="Uçuş arama formu"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Uçuş Ara</h2>
      
      {/* Trip Type Selection */}
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="tripType"
            value="oneWay"
            checked={tripType === 'oneWay'}
            onChange={(e) => setTripType(e.target.value as 'oneWay')}
            className="w-4 h-4 text-primary-500 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-gray-700">Tek Yön</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="tripType"
            value="roundTrip"
            checked={tripType === 'roundTrip'}
            onChange={(e) => setTripType(e.target.value as 'roundTrip')}
            className="w-4 h-4 text-primary-500 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-gray-700">Gidiş-Dönüş</span>
        </label>
      </div>

      {/* Origin and Destination */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="origin"
          name="origin"
          type="text"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          label="Kalkış Havaalanı"
          placeholder="Örn: IST"
          required
        />
        <Input
          id="destination"
          name="destination"
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          label="Varış Havaalanı"
          placeholder="Örn: ESB"
          required
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="departureDate"
          name="departureDate"
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          label="Gidiş Tarihi"
          required
        />
        {tripType === 'roundTrip' && (
          <Input
            id="returnDate"
            name="returnDate"
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            label="Dönüş Tarihi"
            required={tripType === 'roundTrip'}
          />
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        disabled={loading}
        className="w-full"
        ariaLabel="Uçuş ara"
      >
        {loading ? 'Aranıyor...' : 'Uçuş Ara'}
      </Button>
    </form>
  );
};

export default SearchForm;
