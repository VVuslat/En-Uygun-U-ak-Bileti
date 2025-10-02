/**
 * SUNUM NOTU: Bu test dosyası mock API fetch işlemlerini test eder.
 * Data yükleme, hata durumları, format kontrolü.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchFlights } from '../main.js';

describe('API Mock Tests', () => {
  beforeEach(() => {
    // Reset fetch mock
    global.fetch = vi.fn();
  });

  it('should fetch flight data successfully', async () => {
    const mockFlightsData = {
      flights: [
        {
          id: 'FL001',
          airline: 'Test Airlines',
          price: 890,
          departure: '2025-11-01T06:30:00+03:00',
          arrival: '2025-11-01T08:10:00+03:00'
        }
      ]
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockFlightsData
    });

    const searchData = {
      departure: 'IST',
      arrival: 'ADB',
      date: '2025-11-01'
    };

    const flights = await fetchFlights(searchData);

    expect(flights).toEqual(mockFlightsData.flights);
    expect(flights.length).toBe(1);
  });

  it('should handle fetch error', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    const searchData = {
      departure: 'IST',
      arrival: 'ADB',
      date: '2025-11-01'
    };

    await expect(fetchFlights(searchData)).rejects.toThrow();
  });

  it('should handle HTTP error status', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    const searchData = {
      departure: 'IST',
      arrival: 'ADB',
      date: '2025-11-01'
    };

    await expect(fetchFlights(searchData)).rejects.toThrow();
  });

  it('should handle invalid data format', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ invalid: 'data' })
    });

    const searchData = {
      departure: 'IST',
      arrival: 'ADB',
      date: '2025-11-01'
    };

    await expect(fetchFlights(searchData)).rejects.toThrow();
  });

  it('should validate flight data structure', async () => {
    const mockFlightsData = {
      flights: [
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
        }
      ]
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockFlightsData
    });

    const searchData = {
      departure: 'IST',
      arrival: 'ADB',
      date: '2025-11-01'
    };

    const flights = await fetchFlights(searchData);
    const flight = flights[0];

    // Validate required fields
    expect(flight).toHaveProperty('id');
    expect(flight).toHaveProperty('airline');
    expect(flight).toHaveProperty('price');
    expect(flight).toHaveProperty('departure');
    expect(flight).toHaveProperty('arrival');
    expect(flight).toHaveProperty('departureAirport');
    expect(flight).toHaveProperty('arrivalAirport');
  });

  it('should return array of flights', async () => {
    const mockFlightsData = {
      flights: [
        { id: 'FL001', airline: 'Test 1' },
        { id: 'FL002', airline: 'Test 2' },
        { id: 'FL003', airline: 'Test 3' }
      ]
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockFlightsData
    });

    const searchData = {
      departure: 'IST',
      arrival: 'ADB',
      date: '2025-11-01'
    };

    const flights = await fetchFlights(searchData);

    expect(Array.isArray(flights)).toBe(true);
    expect(flights.length).toBe(3);
  });
});
