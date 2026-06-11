import * as hooks from '../index';

describe('hooks barrel index', () => {
  it('exports all hooks correctly', () => {
    expect(hooks.useActivityLog).toBeDefined();
    expect(hooks.usePersistedState).toBeDefined();
    expect(hooks.useAnnualFootprint).toBeDefined();
    expect(hooks.useDebounce).toBeDefined();
  });
});
