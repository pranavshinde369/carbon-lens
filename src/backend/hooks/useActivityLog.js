/**
 * @hook useActivityLog
 * @description Manages the activity log state with persistence to localStorage.
 *              Uses useReducer for predictable state transitions.
 *              Persists on every change via useEffect.
 *
 * @returns {[Array, Function]} [log entries array, dispatch function]
 *
 * @example
 * const [log, dispatch] = useActivityLog();
 * dispatch({ type: 'ADD', payload: { category: 'transport', activityKey: 'metro_rail', quantity: 50 } });
 */
import { useReducer, useEffect } from 'react';
import logReducer from '../reducers/logReducer';
import { loadState, saveState } from '../utils/storage';

const STORAGE_KEY = 'activity_log';

export function useActivityLog() {
  const [log, dispatch] = useReducer(logReducer, undefined, () =>
    loadState(STORAGE_KEY, [])
  );

  useEffect(() => {
    saveState(STORAGE_KEY, log);
  }, [log]);

  return [log, dispatch];
}
