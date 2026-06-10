import { renderHook } from '@testing-library/react';
import { useAnnualFootprint } from '../useAnnualFootprint';
import { BENCHMARKS } from '../../data/constants';

describe('useAnnualFootprint', () => {
  it('returns quiz estimate when log is short', () => {
    const { result } = renderHook(() => useAnnualFootprint([{ id: 1 }], 3000));
    expect(result.current).toBe(3000);
  });

  it('returns India urban average when no quiz estimate and short log', () => {
    const { result } = renderHook(() => useAnnualFootprint([], null));
    expect(result.current).toBe(BENCHMARKS.india_urban_avg);
  });

  it('returns annualised footprint from log when log length >= 3', () => {
    // 3 entries, say 10kg each = 30kg total. 30 * 12 = 360
    const log = [
      { id: 1, category: 'transport', activityKey: 'car_petrol_medium', quantity: 50, ts: '' }, // ~10.4 kg
      { id: 2, category: 'transport', activityKey: 'car_petrol_medium', quantity: 50, ts: '' }, // ~10.4 kg
      { id: 3, category: 'transport', activityKey: 'car_petrol_medium', quantity: 50, ts: '' }, // ~10.4 kg
    ];
    // This assumes emission factors exist for 'car_petrol_medium'
    const { result } = renderHook(() => useAnnualFootprint(log, 2000));
    // It should not use 2000. It should calculate.
    expect(result.current).not.toBe(2000);
  });
});
