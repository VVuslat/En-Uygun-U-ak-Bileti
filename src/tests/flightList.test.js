/**
 * SUNUM NOTU: Bu test dosyası uçuş listesi bileşenini test eder.
 * Liste render, boş durum, error handling testleri.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { 
  renderFlightList, 
  showLoadingState, 
  hideLoadingState,
  showEmptyState,
  hideEmptyState,
  showErrorState,
  hideErrorState
} from '../components/flightList.js';

describe('FlightList Component', () => {
  let container;

  beforeEach(() => {
    // Create necessary DOM elements
    document.body.innerHTML = `
      <div id="flight-list-container"></div>
      <div id="results-section" class="hidden"></div>
      <div id="filters-section" class="hidden"></div>
      <div id="loading-state" class="hidden"></div>
      <div id="empty-state" class="hidden"></div>
      <div id="error-state" class="hidden">
        <p id="error-message"></p>
      </div>
      <span id="results-count"></span>
    `;
    
    container = document.getElementById('flight-list-container');
  });

  it('should render flight list with correct number of cards', () => {
    const mockFlights = [
      {
        id: 'FL001',
        airline: 'Test Airlines',
        price: 890,
        currency: 'TRY',
        departure: '2025-11-01T06:30:00+03:00',
        arrival: '2025-11-01T08:10:00+03:00',
        departureAirport: 'IST',
        arrivalAirport: 'ADB',
        stops: 0,
        flightNumber: 'TA001',
        aircraft: 'A321',
        duration: '1h 40m',
        availableSeats: 45,
        baggage: '1 parça 20kg',
        policy: 'İade edilebilir'
      },
      {
        id: 'FL002',
        airline: 'Test Airlines 2',
        price: 650,
        currency: 'TRY',
        departure: '2025-11-01T08:15:00+03:00',
        arrival: '2025-11-01T10:00:00+03:00',
        departureAirport: 'IST',
        arrivalAirport: 'ADB',
        stops: 0,
        flightNumber: 'TA002',
        aircraft: 'B738',
        duration: '1h 45m',
        availableSeats: 28,
        baggage: 'El çantası dahil',
        policy: 'İade edilemez'
      }
    ];

    renderFlightList(mockFlights, container);

    const flightCards = container.querySelectorAll('.flight-card');
    expect(flightCards.length).toBe(2);
  });

  it('should show empty state when no flights provided', () => {
    renderFlightList([], container);

    const emptyState = document.getElementById('empty-state');
    expect(emptyState.classList.contains('hidden')).toBe(false);
  });

  it('should show loading state', () => {
    showLoadingState();

    const loadingState = document.getElementById('loading-state');
    expect(loadingState.classList.contains('hidden')).toBe(false);
  });

  it('should hide loading state', () => {
    showLoadingState();
    hideLoadingState();

    const loadingState = document.getElementById('loading-state');
    expect(loadingState.classList.contains('hidden')).toBe(true);
  });

  it('should show error state with message', () => {
    const errorMessage = 'Test error message';
    showErrorState(errorMessage);

    const errorState = document.getElementById('error-state');
    const errorMessageEl = document.getElementById('error-message');
    
    expect(errorState.classList.contains('hidden')).toBe(false);
    expect(errorMessageEl.textContent).toBe(errorMessage);
  });

  it('should hide error state', () => {
    showErrorState('Error');
    hideErrorState();

    const errorState = document.getElementById('error-state');
    expect(errorState.classList.contains('hidden')).toBe(true);
  });

  it('should update results count', () => {
    const mockFlights = [
      {
        id: 'FL001',
        airline: 'Test',
        price: 890,
        currency: 'TRY',
        departure: '2025-11-01T06:30:00+03:00',
        arrival: '2025-11-01T08:10:00+03:00',
        departureAirport: 'IST',
        arrivalAirport: 'ADB',
        stops: 0,
        flightNumber: 'TA001',
        aircraft: 'A321',
        duration: '1h 40m',
        availableSeats: 45,
        baggage: '1 parça 20kg',
        policy: 'İade edilebilir'
      }
    ];

    renderFlightList(mockFlights, container);

    const resultsCount = document.getElementById('results-count');
    expect(resultsCount.textContent).toContain('1');
  });

  it('should show results section when flights are rendered', () => {
    const mockFlights = [
      {
        id: 'FL001',
        airline: 'Test',
        price: 890,
        currency: 'TRY',
        departure: '2025-11-01T06:30:00+03:00',
        arrival: '2025-11-01T08:10:00+03:00',
        departureAirport: 'IST',
        arrivalAirport: 'ADB',
        stops: 0,
        flightNumber: 'TA001',
        aircraft: 'A321',
        duration: '1h 40m',
        availableSeats: 45,
        baggage: '1 parça 20kg',
        policy: 'İade edilebilir'
      }
    ];

    renderFlightList(mockFlights, container);

    const resultsSection = document.getElementById('results-section');
    expect(resultsSection.classList.contains('hidden')).toBe(false);
  });
});
