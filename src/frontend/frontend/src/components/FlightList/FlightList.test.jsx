/**
 * FlightList Component Tests
 * Uçuş Listesi Bileşen Testleri
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FlightList from './FlightList.tsx';

describe('FlightList Component', () => {
  const mockFlights = [
    {
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
    },
    {
      id: 'FL456',
      airline: 'Pegasus Airlines',
      price: 850.00,
      currency: 'TRY',
      departure: '2025-10-10T10:00:00+03:00',
      arrival: '2025-10-10T12:15:00+03:00',
      stops: 1,
      flightNumber: 'PC456',
      aircraft: 'B737',
      policy: 'İade edilemez',
      origin: 'IST',
      destination: 'ESB',
    },
  ];

  it('shows empty state when no flights', () => {
    const mockOnFlightSelect = vi.fn();
    render(<FlightList flights={[]} onFlightSelect={mockOnFlightSelect} />);

    expect(screen.getByText(/uçuş arayın/i)).toBeInTheDocument();
  });

  it('renders list of flights', () => {
    const mockOnFlightSelect = vi.fn();
    render(<FlightList flights={mockFlights} onFlightSelect={mockOnFlightSelect} />);

    expect(screen.getByText('Turkish Airlines')).toBeInTheDocument();
    expect(screen.getByText('Pegasus Airlines')).toBeInTheDocument();
    expect(screen.getByText(/2 uçuş bulundu/i)).toBeInTheDocument();
  });

  it('sorts flights by price ascending by default', () => {
    const mockOnFlightSelect = vi.fn();
    render(<FlightList flights={mockFlights} onFlightSelect={mockOnFlightSelect} />);

    const flightCards = screen.getAllByRole('article');
    // Pegasus (850 TRY) should be first, Turkish Airlines (1250 TRY) second
    expect(flightCards[0]).toHaveTextContent('Pegasus Airlines');
    expect(flightCards[1]).toHaveTextContent('Turkish Airlines');
  });

  it('filters direct flights only', () => {
    const mockOnFlightSelect = vi.fn();
    render(<FlightList flights={mockFlights} onFlightSelect={mockOnFlightSelect} />);

    const directOnlyCheckbox = screen.getByLabelText(/sadece direkt uçuşlar/i);
    fireEvent.click(directOnlyCheckbox);

    expect(screen.getByText(/1 uçuş bulundu/i)).toBeInTheDocument();
    expect(screen.getByText('Turkish Airlines')).toBeInTheDocument();
    expect(screen.queryByText('Pegasus Airlines')).not.toBeInTheDocument();
  });

  it('changes sort order', () => {
    const mockOnFlightSelect = vi.fn();
    render(<FlightList flights={mockFlights} onFlightSelect={mockOnFlightSelect} />);

    const sortSelect = screen.getByLabelText(/sırala/i);
    fireEvent.change(sortSelect, { target: { value: 'price-desc' } });

    const flightCards = screen.getAllByRole('article');
    // Turkish Airlines (1250 TRY) should be first when sorting descending
    expect(flightCards[0]).toHaveTextContent('Turkish Airlines');
    expect(flightCards[1]).toHaveTextContent('Pegasus Airlines');
  });
});
