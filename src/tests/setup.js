/**
 * Test setup file
 * Configures the testing environment
 */

// Mock window.fetch for tests
global.fetch = vi.fn();

// Setup DOM
beforeEach(() => {
  document.body.innerHTML = '';
});
