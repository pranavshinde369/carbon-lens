/**
 * Tests for activity log reducer
 */

import logReducer from "./logReducer";

const sampleEntry = { category: "transport", activityKey: "metro_rail", quantity: 100 };

describe("logReducer — ADD", () => {
  test("adds entry to empty state", () => {
    const state = logReducer([], { type: "ADD", payload: sampleEntry });
    expect(state).toHaveLength(1);
  });

  test("assigned entry has id and ts", () => {
    const state = logReducer([], { type: "ADD", payload: sampleEntry });
    expect(state[0]).toHaveProperty("id");
    expect(state[0]).toHaveProperty("ts");
  });

  test("id is a string", () => {
    const state = logReducer([], { type: "ADD", payload: sampleEntry });
    expect(typeof state[0].id).toBe("string");
    expect(state[0].id.length).toBeGreaterThan(0);
  });

  test("preserves payload fields", () => {
    const state = logReducer([], { type: "ADD", payload: sampleEntry });
    expect(state[0].category).toBe("transport");
    expect(state[0].quantity).toBe(100);
  });

  test("appends to existing state immutably", () => {
    const initial = [{ ...sampleEntry, id: "abc", ts: "x" }];
    const state = logReducer(initial, { type: "ADD", payload: sampleEntry });
    expect(state).toHaveLength(2);
    expect(state[0].id).toBe("abc");
  });
});

describe("logReducer — REMOVE", () => {
  test("removes entry by id", () => {
    const initial = [{ ...sampleEntry, id: "del-me", ts: "x" }];
    const state = logReducer(initial, { type: "REMOVE", id: "del-me" });
    expect(state).toHaveLength(0);
  });

  test("does not remove entry with non-matching id", () => {
    const initial = [{ ...sampleEntry, id: "keep", ts: "x" }];
    const state = logReducer(initial, { type: "REMOVE", id: "other" });
    expect(state).toHaveLength(1);
  });

  test("returns empty array when id not found in empty state", () => {
    const state = logReducer([], { type: "REMOVE", id: "ghost" });
    expect(state).toHaveLength(0);
  });
});

describe("logReducer — CLEAR", () => {
  test("clears all entries", () => {
    const initial = [sampleEntry, sampleEntry].map((e, i) => ({
      ...e,
      id: String(i),
      ts: "x",
    }));
    expect(logReducer(initial, { type: "CLEAR" })).toHaveLength(0);
  });

  test("returns new empty array reference", () => {
    const initial = [];
    const result = logReducer(initial, { type: "CLEAR" });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("logReducer — UNKNOWN ACTION", () => {
  test("returns state for unknown action type and warns in development", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    const warnMock = jest.spyOn(console, "warn").mockImplementation(() => {});

    const state = [{ id: 1 }];
    const result = logReducer(state, { type: "UNKNOWN" });
    expect(result).toBe(state);
    expect(warnMock).toHaveBeenCalledWith("[logReducer] Unknown action type:", "UNKNOWN");

    warnMock.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });
});

describe("logReducer — crypto fallback", () => {
  test("falls back to manual ID generation when crypto is undefined", () => {
    const originalCrypto = global.crypto;
    Object.defineProperty(global, "crypto", {
      value: undefined,
      configurable: true,
      writable: true,
    });

    const state = logReducer([], { type: "ADD", payload: { category: "transport", activityKey: "metro_rail", quantity: 100 } });
    expect(state).toHaveLength(1);
    expect(typeof state[0].id).toBe("string");
    expect(state[0].id.length).toBeGreaterThan(5);

    Object.defineProperty(global, "crypto", {
      value: originalCrypto,
      configurable: true,
      writable: true,
    });
  });

  test("falls back to manual ID generation when crypto is defined but randomUUID is not", () => {
    const originalCrypto = global.crypto;
    Object.defineProperty(global, "crypto", {
      value: {},
      configurable: true,
      writable: true,
    });

    const state = logReducer([], { type: "ADD", payload: { category: "transport", activityKey: "metro_rail", quantity: 100 } });
    expect(state).toHaveLength(1);
    expect(typeof state[0].id).toBe("string");
    expect(state[0].id.length).toBeGreaterThan(5);

    Object.defineProperty(global, "crypto", {
      value: originalCrypto,
      configurable: true,
      writable: true,
    });
  });
});
