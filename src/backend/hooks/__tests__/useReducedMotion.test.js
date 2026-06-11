import { renderHook, act } from '@testing-library/react';
import { useReducedMotion } from '../useReducedMotion';

describe('useReducedMotion', () => {
  let originalMatchMedia;

  beforeAll(() => {
    originalMatchMedia = window.matchMedia;
  });

  afterAll(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('returns false if matchMedia is not defined', () => {
    delete window.matchMedia;
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('returns true if prefers-reduced-motion matches', () => {
    const addEventListener = jest.fn();
    const removeEventListener = jest.fn();
    
    window.matchMedia = jest.fn().mockReturnValue({
      matches: true,
      addEventListener,
      removeEventListener,
    });

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    expect(addEventListener).toHaveBeenCalled();
  });

  it('subscribes to changes and updates state', () => {
    let changeHandler;
    const addEventListener = jest.fn((event, handler) => {
      changeHandler = handler;
    });
    const removeEventListener = jest.fn();

    window.matchMedia = jest.fn().mockReturnValue({
      matches: false,
      addEventListener,
      removeEventListener,
    });

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    act(() => {
      changeHandler({ matches: true });
    });

    expect(result.current).toBe(true);
  });
});
