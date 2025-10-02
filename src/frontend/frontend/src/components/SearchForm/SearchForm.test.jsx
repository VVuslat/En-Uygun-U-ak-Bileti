/**
 * SearchForm Component Tests
 * Arama Formu Bileşen Testleri
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchForm from './SearchForm.tsx';

describe('SearchForm Component', () => {
  it('renders search form with all inputs', () => {
    const mockOnSearch = vi.fn();
    render(<SearchForm onSearch={mockOnSearch} loading={false} />);

    // Check if all form elements are present
    expect(screen.getByLabelText(/kalkış havaalanı/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/varış havaalanı/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/gidiş tarihi/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /uçuş ara/i })).toBeInTheDocument();
  });

  it('handles input changes correctly', () => {
    const mockOnSearch = vi.fn();
    render(<SearchForm onSearch={mockOnSearch} loading={false} />);

    const originInput = screen.getByLabelText(/kalkış havaalanı/i);
    const destinationInput = screen.getByLabelText(/varış havaalanı/i);

    fireEvent.change(originInput, { target: { value: 'IST' } });
    fireEvent.change(destinationInput, { target: { value: 'ESB' } });

    expect(originInput.value).toBe('IST');
    expect(destinationInput.value).toBe('ESB');
  });

  it('submits form with correct data', () => {
    const mockOnSearch = vi.fn();
    render(<SearchForm onSearch={mockOnSearch} loading={false} />);

    const originInput = screen.getByLabelText(/kalkış havaalanı/i);
    const destinationInput = screen.getByLabelText(/varış havaalanı/i);
    const dateInput = screen.getByLabelText(/gidiş tarihi/i);
    const submitButton = screen.getByRole('button', { name: /uçuş ara/i });

    fireEvent.change(originInput, { target: { value: 'IST' } });
    fireEvent.change(destinationInput, { target: { value: 'ESB' } });
    fireEvent.change(dateInput, { target: { value: '2025-12-01' } });
    fireEvent.click(submitButton);

    expect(mockOnSearch).toHaveBeenCalledWith({
      origin: 'IST',
      destination: 'ESB',
      departureDate: '2025-12-01',
      tripType: 'oneWay',
    });
  });

  it('shows loading state when searching', () => {
    const mockOnSearch = vi.fn();
    render(<SearchForm onSearch={mockOnSearch} loading={true} />);

    const submitButton = screen.getByRole('button');
    expect(submitButton).toHaveTextContent(/aranıyor/i);
    expect(submitButton).toBeDisabled();
  });

  it('toggles between one-way and round-trip', () => {
    const mockOnSearch = vi.fn();
    render(<SearchForm onSearch={mockOnSearch} loading={false} />);

    const roundTripRadio = screen.getByLabelText(/gidiş-dönüş/i);
    fireEvent.click(roundTripRadio);

    // Return date field should now be visible
    expect(screen.getByLabelText(/dönüş tarihi/i)).toBeInTheDocument();
  });
});
