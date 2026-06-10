/**
 * Tests for custom hooks
 */

import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  test("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 300));
    expect(result.current).toBe("hello");
  });

  test("debounces value updates", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "a" } }
    );

    rerender({ value: "b" });
    // Before timer fires, still old value
    expect(result.current).toBe("a");

    // Fast-forward past debounce delay
    act(() => jest.advanceTimersByTime(300));
    expect(result.current).toBe("b");
  });

  test("uses default wait of 300ms", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 1 } }
    );

    rerender({ value: 2 });
    act(() => jest.advanceTimersByTime(299));
    expect(result.current).toBe(1);

    act(() => jest.advanceTimersByTime(1));
    expect(result.current).toBe(2);
  });
});
