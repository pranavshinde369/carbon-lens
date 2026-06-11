import '@testing-library/jest-dom';

// Mock localStorage conditionally to avoid shadowing Storage.prototype in JSDOM
if (typeof window !== 'undefined') {
  if (!window.localStorage) {
    class StorageMock {
      constructor() { this.store = {}; }
      getItem(key) { return this.store[key] ?? null; }
      setItem(key, value) { this.store[key] = String(value); }
      removeItem(key) { delete this.store[key]; }
      clear() { this.store = {}; }
    }
    window.Storage = StorageMock;
    Object.defineProperty(window, 'localStorage', {
      value: new StorageMock(),
      writable: true,
      configurable: true,
    });
  }
} else {
  class StorageMock {
    constructor() { this.store = {}; }
    getItem(key) { return this.store[key] ?? null; }
    setItem(key, value) { this.store[key] = String(value); }
    removeItem(key) { delete this.store[key]; }
    clear() { this.store = {}; }
  }
  global.Storage = StorageMock;
  global.localStorage = new StorageMock();
}

// Mock crypto.randomUUID for logReducer (make it configurable!)
Object.defineProperty(global, 'crypto', {
  value: { randomUUID: () => Math.random().toString(36).slice(2) },
  writable: true,
  configurable: true,
});

// Mock matchMedia for reduced-motion checks (make it configurable!)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

// Mock ResizeObserver for Recharts / ResponsiveContainer in testing environment
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;
