/**
 * Utility functions for formatting dates, currency, and other data
 * Tarih, para birimi ve diğer verileri formatlama için yardımcı fonksiyonlar
 */

/**
 * Format date string to human-readable format
 * @param dateString - ISO 8601 date string
 * @returns Formatted date string (e.g., "10 Ekim 2025, 08:30")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format time from date string
 * @param dateString - ISO 8601 date string
 * @returns Time in HH:MM format
 */
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format date for display (without time)
 * @param dateString - ISO 8601 date string
 * @returns Date in readable format
 */
export const formatDateOnly = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Format currency value
 * @param amount - Numeric amount
 * @param currency - Currency code (e.g., 'TRY', 'USD')
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'TRY'): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Calculate flight duration between two dates
 * @param departure - Departure date string
 * @param arrival - Arrival date string
 * @returns Duration string (e.g., "2s 15dk")
 */
export const calculateDuration = (departure: string, arrival: string): string => {
  const dep = new Date(departure);
  const arr = new Date(arrival);
  const diffMs = arr.getTime() - dep.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}s ${minutes}dk`;
};
