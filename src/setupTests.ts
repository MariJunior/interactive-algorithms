import "@testing-library/jest-dom";

// Framer Motion InViewFeature требует IntersectionObserver в jsdom
class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});

// ScrollToTop вызывает scrollTo при навигации
Object.defineProperty(window, "scrollTo", {
  writable: true,
  configurable: true,
  value: () => {},
});
