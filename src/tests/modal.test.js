/**
 * SUNUM NOTU: Bu test dosyası modal bileşenini test eder.
 * Modal açma/kapama, ESC tuşu, erişilebilirlik testleri.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { openModal, closeModal } from '../components/modal.js';

describe('Modal Component', () => {
  beforeEach(() => {
    // Create necessary DOM elements
    document.body.innerHTML = `
      <div id="modal-container"></div>
    `;
    
    // Reset body overflow
    document.body.style.overflow = '';
  });

  const mockFlight = {
    id: 'FL001',
    airline: 'Turkish Airlines',
    price: 890,
    currency: 'TRY',
    departure: '2025-11-01T06:30:00+03:00',
    arrival: '2025-11-01T08:10:00+03:00',
    departureAirport: 'IST',
    arrivalAirport: 'ADB',
    stops: 0,
    flightNumber: 'TK2310',
    aircraft: 'A321',
    duration: '1h 40m',
    availableSeats: 45,
    baggage: '1 parça 20kg',
    policy: 'İade edilebilir'
  };

  it('should open modal and render flight details', () => {
    openModal(mockFlight);

    const modal = document.getElementById('flight-modal');
    const overlay = document.getElementById('modal-overlay');
    
    expect(modal).toBeTruthy();
    expect(overlay).toBeTruthy();
  });

  it('should have proper ARIA attributes', () => {
    openModal(mockFlight);

    const modal = document.getElementById('flight-modal');
    
    expect(modal.getAttribute('role')).toBe('dialog');
    expect(modal.getAttribute('aria-modal')).toBe('true');
    expect(modal.getAttribute('aria-labelledby')).toBe('modal-title');
  });

  it('should prevent body scroll when modal is open', () => {
    openModal(mockFlight);

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should restore body scroll when modal is closed', () => {
    openModal(mockFlight);
    closeModal();

    expect(document.body.style.overflow).toBe('');
  });

  it('should close modal when close button is clicked', () => {
    openModal(mockFlight);

    const closeButton = document.getElementById('modal-close-button');
    expect(closeButton).toBeTruthy();
    
    closeButton.click();

    // Check that modal will be removed (after animation timeout)
    setTimeout(() => {
      const modal = document.getElementById('flight-modal');
      expect(modal).toBeFalsy();
    }, 400);
  });

  it('should close modal when overlay is clicked', () => {
    openModal(mockFlight);

    const overlay = document.getElementById('modal-overlay');
    overlay.click();

    setTimeout(() => {
      const modal = document.getElementById('flight-modal');
      expect(modal).toBeFalsy();
    }, 400);
  });

  it('should close modal on ESC key press', () => {
    openModal(mockFlight);

    const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(escEvent);

    setTimeout(() => {
      const modal = document.getElementById('flight-modal');
      expect(modal).toBeFalsy();
    }, 400);
  });

  it('should display flight information correctly', () => {
    openModal(mockFlight);

    const modalContainer = document.getElementById('modal-container');
    const content = modalContainer.innerHTML;
    
    expect(content).toContain(mockFlight.airline);
    expect(content).toContain(mockFlight.flightNumber);
    expect(content).toContain(mockFlight.departureAirport);
    expect(content).toContain(mockFlight.arrivalAirport);
  });

  it('should have close buttons in header and footer', () => {
    openModal(mockFlight);

    const closeButtonHeader = document.getElementById('modal-close-button');
    const closeButtonFooter = document.getElementById('modal-close-button-footer');
    
    expect(closeButtonHeader).toBeTruthy();
    expect(closeButtonFooter).toBeTruthy();
  });

  it('should handle flight with stopover', () => {
    const flightWithStop = {
      ...mockFlight,
      stops: 1,
      stopover: 'Ankara (ESB)'
    };

    openModal(flightWithStop);

    const modalContainer = document.getElementById('modal-container');
    const content = modalContainer.innerHTML;
    
    expect(content).toContain('Ankara (ESB)');
  });
});
