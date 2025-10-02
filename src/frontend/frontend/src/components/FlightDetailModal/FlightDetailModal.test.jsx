/**
 * FlightDetailModal Component Tests
 * Uçuş Detay Modal Bileşen Testleri
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FlightDetailModal from './FlightDetailModal.tsx';

describe('FlightDetailModal Component', () => {
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
    class: 'Economy',
  };

  it('does not render when isOpen is false', () => {
    const mockOnClose = vi.fn();
    render(<FlightDetailModal flight={mockFlight} isOpen={false} onClose={mockOnClose} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders modal with flight details when open', () => {
    const mockOnClose = vi.fn();
    render(<FlightDetailModal flight={mockFlight} isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Turkish Airlines')).toBeInTheDocument();
    expect(screen.getByText('TK123')).toBeInTheDocument();
    expect(screen.getByText('A320')).toBeInTheDocument();
    expect(screen.getByText('İade edilebilir')).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', () => {
    const mockOnClose = vi.fn();
    render(<FlightDetailModal flight={mockFlight} isOpen={true} onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText(/modalı kapat/i);
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('closes modal when escape key is pressed', () => {
    const mockOnClose = vi.fn();
    render(<FlightDetailModal flight={mockFlight} isOpen={true} onClose={mockOnClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('closes modal when clicking outside (backdrop)', () => {
    const mockOnClose = vi.fn();
    render(<FlightDetailModal flight={mockFlight} isOpen={true} onClose={mockOnClose} />);

    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
