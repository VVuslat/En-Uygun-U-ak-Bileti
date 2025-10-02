// Type definitions for flight data models

export interface Flight {
  id: string;
  airline: string;
  price: number;
  currency: string;
  departure: string; // ISO 8601 format
  arrival: string; // ISO 8601 format
  stops: number;
  flightNumber: string;
  aircraft: string;
  policy: string;
  origin?: string;
  destination?: string;
  class?: string;
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  tripType: 'oneWay' | 'roundTrip';
  passengers?: number;
}

export interface FlightSearchResponse {
  flights: Flight[];
}

export type SortOption = 'price-asc' | 'price-desc' | 'departure-asc' | 'departure-desc';

export interface FilterState {
  maxPrice?: number;
  airlines?: string[];
  maxStops?: number;
}
