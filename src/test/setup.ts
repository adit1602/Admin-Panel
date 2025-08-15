// src/test/setup.ts
import { vi } from "vitest";
import { beforeAll, afterEach, afterAll } from "vitest";
import "@testing-library/jest-dom";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

// Mock Window
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Setup global mocks
beforeAll(() => {
  // Add any global test setup here
});

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

// Clean up after all tests
afterAll(() => {
  // Add any global test teardown here
});
