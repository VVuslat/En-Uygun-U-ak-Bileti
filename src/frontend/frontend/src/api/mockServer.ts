/**
 * Mock API Server using MSW (Mock Service Worker)
 * MSW kullanarak Mock API sunucusu
 * 
 * This module provides mock flight data for development and testing
 * Bu modül geliştirme ve test için mock uçuş verisi sağlar
 */

import { Flight } from '../types/flight';

/**
 * Generate mock flight data based on search parameters
 * Arama parametrelerine göre mock uçuş verisi üret
 */
export const generateMockFlights = (
  origin: string,
  destination: string,
  date: string
): Flight[] => {
  const airlines = [
    'Turkish Airlines',
    'Pegasus Airlines',
    'SunExpress',
    'AnadoluJet',
  ];

  const aircraftTypes = ['A320', 'B737', 'A321', 'B738'];
  const policies = [
    'İade edilebilir',
    'İade edilemez',
    'Değişiklik yapılabilir',
    'Kısmi iade',
  ];

  // Generate 5-8 mock flights
  const flightCount = Math.floor(Math.random() * 4) + 5;
  const flights: Flight[] = [];

  for (let i = 0; i < flightCount; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const basePrice = 800 + Math.random() * 1500;
    const stops = Math.random() > 0.7 ? 1 : 0;
    
    // Generate random departure time
    const departureHour = Math.floor(Math.random() * 18) + 6; // 6-23
    const departureMinute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
    
    const departureDate = new Date(date);
    departureDate.setHours(departureHour, departureMinute, 0, 0);
    
    // Flight duration: 1-4 hours
    const durationHours = Math.floor(Math.random() * 3) + 1;
    const durationMinutes = Math.floor(Math.random() * 4) * 15;
    
    const arrivalDate = new Date(departureDate);
    arrivalDate.setHours(arrivalDate.getHours() + durationHours);
    arrivalDate.setMinutes(arrivalDate.getMinutes() + durationMinutes);

    flights.push({
      id: `FL${Math.floor(Math.random() * 9000) + 1000}`,
      airline,
      price: Math.round(basePrice + (stops * 200)),
      currency: 'TRY',
      departure: departureDate.toISOString(),
      arrival: arrivalDate.toISOString(),
      stops,
      flightNumber: `${airline.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 900) + 100}`,
      aircraft: aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)],
      policy: policies[Math.floor(Math.random() * policies.length)],
      origin,
      destination,
      class: 'Economy',
    });
  }

  // Sort by price
  flights.sort((a, b) => a.price - b.price);

  return flights;
};

/**
 * Simulate API delay
 * API gecikmesini simüle et
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Mock API response with simulated network delay
 * Simüle edilmiş ağ gecikmesi ile mock API yanıtı
 */
export const mockFlightSearch = async (
  origin: string,
  destination: string,
  date: string
): Promise<{ flights: Flight[] }> => {
  // Simulate network delay (500-1500ms)
  await delay(500 + Math.random() * 1000);

  // 5% chance of error for testing error handling
  if (Math.random() < 0.05) {
    throw new Error('API isteği başarısız oldu');
  }

  const flights = generateMockFlights(origin, destination, date);
  
  return { flights };
};
