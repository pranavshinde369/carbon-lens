/**
 * Activity Log Reducer
 *
 * Manages the activity log state via useReducer.
 * Actions: ADD, REMOVE, CLEAR
 *
 * @module logReducer
 */

/**
 * Reducer for the activity log state.
 *
 * @param {Array<Object>} state - Current log entries
 * @param {{ type: string, payload?: Object, id?: string }} action - Dispatch action
 * @returns {Array<Object>} New state (immutable)
 *
 * @example
 *   dispatch({ type: 'ADD', payload: { category: 'transport', activityKey: 'metro_rail', quantity: 100 } })
 *   dispatch({ type: 'REMOVE', id: 'abc-123' })
 *   dispatch({ type: 'CLEAR' })
 */
export default function logReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [
        ...state,
        {
          ...action.payload,
          id: typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : String(Date.now()) + Math.random().toString(36).slice(2),
          ts: new Date().toISOString(),
        },
      ];
    case "REMOVE":
      return state.filter((entry) => entry.id !== action.id);
    case "CLEAR":
      return [];
    default:
      if (process.env.NODE_ENV === "development") {
        console.warn("[logReducer] Unknown action type:", action.type);
      }
      return state;
  }
}
