import { renderHook, act } from '@testing-library/react';
import { usePersistedState } from '../usePersistedState';
import * as storage from '../../../backend/utils';

jest.mock('../../utils/storage', () => ({
  loadState: jest.fn(),
  saveState: jest.fn(),
}));

describe('usePersistedState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads initial value from storage', () => {
    storage.loadState.mockReturnValueOnce('storedVal');
    const { result } = renderHook(() => usePersistedState('test_key', 'fallback'));
    
    expect(result.current[0]).toBe('storedVal');
    expect(storage.loadState).toHaveBeenCalledWith('test_key', 'fallback');
  });

  it('updates state and saves to storage on change', () => {
    storage.loadState.mockReturnValueOnce('fallback');
    const { result } = renderHook(() => usePersistedState('test_key', 'fallback'));

    act(() => {
      result.current[1]('newVal');
    });

    expect(result.current[0]).toBe('newVal');
    expect(storage.saveState).toHaveBeenCalledWith('test_key', 'newVal');
  });
});
