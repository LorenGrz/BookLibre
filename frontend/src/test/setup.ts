import '@testing-library/jest-dom'

// Redefine global localStorage and sessionStorage to use jsdom's implementation
// to avoid conflicts with Node 22's experimental web storage implementation.
if (typeof window !== 'undefined' && window.localStorage) {
  Object.defineProperty(globalThis, 'localStorage', {
    value: window.localStorage,
    writable: true,
    configurable: true,
  })
  Object.defineProperty(globalThis, 'sessionStorage', {
    value: window.sessionStorage,
    writable: true,
    configurable: true,
  })
} else {
  const mockStorage = () => {
    let store: Record<string, string> = {}
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString()
      },
      removeItem: (key: string) => {
        delete store[key]
      },
      clear: () => {
        store = {}
      },
      key: (index: number) => Object.keys(store)[index] || null,
      get length() {
        return Object.keys(store).length
      },
    }
  }
  Object.defineProperty(globalThis, 'localStorage', {
    value: mockStorage(),
    writable: true,
    configurable: true,
  })
  Object.defineProperty(globalThis, 'sessionStorage', {
    value: mockStorage(),
    writable: true,
    configurable: true,
  })
}