/**
 * FlightCard Component Tests
 * Uçuş Kartı Bileşen Testleri
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FlightCard from './FlightCard.tsx';

describe('FlightCard Component', () => {
  const mockFlight = {
    id: 'FL123',
    airline: 'Turkish Airlines',
    price: 1250.50,
    currency: 'TRY',
    departure: '2025-10-10T08:30:00+03:00',
    arrival: '2025-10-10T10:45:00+03:00',
    stops: 0,
    flightNumber: 'TK123',
    aircraft: 'A320',
    policy: 'İade edilebilir',
    origin: 'IST',
    destination: 'ESB',
  };

  it('renders flight information correctly', () => {
    const mockOnDetailsClick = vi.fn();
    render(<FlightCard flight={mockFlight} onDetailsClick={mockOnDetailsClick} />);

    // Check airline and flight number
    expect(screen.getByText('Turkish Airlines')).toBeInTheDocument();
    expect(screen.getByText('TK123')).toBeInTheDocument();

    // Check price is displayed
    expect(screen.getByText(/1\.250,50/)).toBeInTheDocument();

    // Check origin and destination
    expect(screen.getByText('IST')).toBeInTheDocument();
    expect(screen.getByText('ESB')).toBeInTheDocument();
  });

  it('shows direct flight indicator when stops is 0', () => {
    const mockOnDetailsClick = vi.fn();
    render(<FlightCard flight={mockFlight} onDetailsClick={mockOnDetailsClick} />);

    expect(screen.getByText(/direkt uçuş/i)).toBeInTheDocument();
  });

  it('shows stop count when flight has stops', () => {
    const mockOnDetailsClick = vi.fn();
    const flightWithStops = { ...mockFlight, stops: 1 };
    render(<FlightCard flight={flightWithStops} onDetailsClick={mockOnDetailsClick} />);

    expect(screen.getByText(/1 aktarma/i)).toBeInTheDocument();
  });

  it('calls onDetailsClick when details button is clicked', () => {
    const mockOnDetailsClick = vi.fn();
    render(<FlightCard flight={mockFlight} onDetailsClick={mockOnDetailsClick} />);

    const detailsButton = screen.getByRole('button', { name: /detaylar/i });
    fireEvent.click(detailsButton);

    expect(mockOnDetailsClick).toHaveBeenCalledWith(mockFlight);
  });
});
