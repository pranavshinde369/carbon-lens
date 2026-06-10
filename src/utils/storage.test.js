/**
 * Tests for safe localStorage wrapper
 */

import { loadState, saveState, clearState } from "./storage";

describe("loadState", () => {
  beforeEach(() => localStorage.clear());

  test("returns fallback for missing key", () => {
    expect(loadState("nonexistent", "default")).toBe("default");
  });

  test("returns fallback for corrupted JSON", () => {
    localStorage.setItem("cfp_v1_bad", "not-json{{{");
    expect(loadState("bad", null)).toBeNull();
  });

  test("round-trips object correctly", () => {
    const obj = { a: 1, b: [2, 3] };
    saveState("test", obj);
    expect(loadState("test", null)).toEqual(obj);
  });

  test("round-trips array correctly", () => {
    saveState("arr", [1, 2, 3]);
    expect(loadState("arr", [])).toEqual([1, 2, 3]);
  });
});

describe("saveState", () => {
  beforeEach(() => localStorage.clear());

  test("returns true on success", () => {
    expect(saveState("key", "value")).toBe(true);
  });

  test("returns false for oversized value", () => {
    const huge = "x".repeat(60 * 1024);
    expect(saveState("huge", huge)).toBe(false);
  });
});

describe("clearState", () => {
  beforeEach(() => localStorage.clear());

  test("removes key and returns true", () => {
    saveState("toClear", "val");
    expect(clearState("toClear")).toBe(true);
    expect(loadState("toClear", "gone")).toBe("gone");
  });
});
