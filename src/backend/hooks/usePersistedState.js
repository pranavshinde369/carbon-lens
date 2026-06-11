/**
 * @hook usePersistedState
 * @description Drop-in replacement for useState that persists value to localStorage.
 *              Reads initial value from storage, falls back to provided default.
 *
 * @param {string} key          - localStorage key (will be namespaced with cfp_v1_ prefix)
 * @param {*}      defaultValue - Value to use if no stored value exists
 * @returns {[*, Function]} [value, setter] — same API as useState
 *
 * @example
 * const [completedTips, setCompletedTips] = usePersistedState('tips', []);
 */
import { useState, useEffect } from 'react';
import { loadState, saveState } from '../utils/storage';

export function usePersistedState(key, defaultValue) {
  const [value, setValue] = useState(() => loadState(key, defaultValue));

  useEffect(() => {
    saveState(key, value);
  }, [key, value]);

  return [value, setValue];
}
