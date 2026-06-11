import { renderHook, act } from '@testing-library/react';
import { useActivityLog } from '../useActivityLog';
import * as storage from '../../../backend/utils';

jest.mock('../../utils/storage', () => ({
  loadState: jest.fn(),
  saveState: jest.fn(),
}));

describe('useActivityLog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads initial state from storage', () => {
    storage.loadState.mockReturnValueOnce([{ id: '1', category: 'food', activityKey: 'beef', quantity: 2, ts: 'ts' }]);
    const { result } = renderHook(() => useActivityLog());
    expect(result.current[0]).toEqual([{ id: '1', category: 'food', activityKey: 'beef', quantity: 2, ts: 'ts' }]);
    expect(storage.loadState).toHaveBeenCalledWith('activity_log', []);
  });

  it('dispatches actions and updates storage', () => {
    storage.loadState.mockReturnValueOnce([]);
    const { result } = renderHook(() => useActivityLog());
    
    expect(result.current[0]).toEqual([]);

    act(() => {
      result.current[1]({
        type: 'ADD',
        payload: { category: 'food', activityKey: 'beef', quantity: 2 }
      });
    });

    expect(result.current[0]).toHaveLength(1);
    expect(result.current[0][0].category).toBe('food');
    expect(storage.saveState).toHaveBeenCalled();
  });
});
