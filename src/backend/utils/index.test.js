import * as utils from './index';

describe('utils barrel index', () => {
  it('exports all utils correctly', () => {
    expect(utils.calcEmission).toBeDefined();
    expect(utils.aggregateEmissions).toBeDefined();
    expect(utils.formatCO2).toBeDefined();
    expect(utils.annualToDaily).toBeDefined();
    expect(utils.toEquivalency).toBeDefined();
    expect(utils.loadState).toBeDefined();
    expect(utils.saveState).toBeDefined();
    expect(utils.clearState).toBeDefined();
    expect(utils.sanitiseNumber).toBeDefined();
  });
});
