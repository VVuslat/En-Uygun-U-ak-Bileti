/**
 * SUNUM NOTU: Bu test dosyası arama formu bileşenini test eder.
 * Render, validation, event handling testleri - MYK kalite standardı.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderSearchForm, attachSearchFormHandlers, getFormData } from '../components/searchForm.js';

describe('SearchForm Component', () => {
  let container;

  beforeEach(() => {
    // Create a container for the form
    container = document.createElement('div');
    container.id = 'search-form-container';
    document.body.appendChild(container);
  });

  it('should render search form with all required fields', () => {
    renderSearchForm(container);
    
    const form = document.getElementById('flight-search-form');
    expect(form).toBeTruthy();
    
    const departureInput = document.getElementById('departure');
    const arrivalInput = document.getElementById('arrival');
    const dateInput = document.getElementById('date');
    const submitButton = form.querySelector('button[type="submit"]');
    
    expect(departureInput).toBeTruthy();
    expect(arrivalInput).toBeTruthy();
    expect(dateInput).toBeTruthy();
    expect(submitButton).toBeTruthy();
  });

  it('should have proper accessibility attributes', () => {
    renderSearchForm(container);
    
    const departureInput = document.getElementById('departure');
    const arrivalInput = document.getElementById('arrival');
    const dateInput = document.getElementById('date');
    
    expect(departureInput.getAttribute('aria-label')).toBe('Kalkış havalimanı');
    expect(arrivalInput.getAttribute('aria-label')).toBe('Varış havalimanı');
    expect(dateInput.getAttribute('aria-label')).toBe('Uçuş tarihi');
  });

  it('should validate form data correctly', () => {
    renderSearchForm(container);
    
    const form = document.getElementById('flight-search-form');
    const departureInput = document.getElementById('departure');
    const arrivalInput = document.getElementById('arrival');
    const dateInput = document.getElementById('date');
    
    // Set valid values
    departureInput.value = 'IST';
    arrivalInput.value = 'ADB';
    dateInput.value = '2025-12-01';
    
    const formData = getFormData();
    expect(formData.departure).toBe('IST');
    expect(formData.arrival).toBe('ADB');
    expect(formData.date).toBe('2025-12-01');
  });

  it('should call submit callback when form is submitted with valid data', async () => {
    renderSearchForm(container);
    
    const mockCallback = vi.fn();
    attachSearchFormHandlers(mockCallback);
    
    const form = document.getElementById('flight-search-form');
    const departureInput = document.getElementById('departure');
    const arrivalInput = document.getElementById('arrival');
    const dateInput = document.getElementById('date');
    
    // Set valid values
    departureInput.value = 'IST';
    arrivalInput.value = 'ADB';
    dateInput.value = '2025-12-01';
    
    // Submit form
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);
    
    // Wait a bit for async operations
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(mockCallback).toHaveBeenCalled();
  });

  it('should show error messages for invalid input', () => {
    renderSearchForm(container);
    
    const mockCallback = vi.fn();
    attachSearchFormHandlers(mockCallback);
    
    const form = document.getElementById('flight-search-form');
    const departureInput = document.getElementById('departure');
    const arrivalInput = document.getElementById('arrival');
    
    // Set invalid values (same departure and arrival)
    departureInput.value = 'IST';
    arrivalInput.value = 'IST';
    
    // Submit form
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);
    
    const errorContainer = document.getElementById('form-errors');
    expect(errorContainer).toBeTruthy();
  });

  it('should have minimum date set to today', () => {
    renderSearchForm(container);
    
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    
    expect(dateInput.getAttribute('min')).toBe(today);
  });
});
