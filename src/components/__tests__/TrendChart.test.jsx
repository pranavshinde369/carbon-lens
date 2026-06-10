import React from 'react';
import { render } from '@testing-library/react';
import TrendChart from '../TrendChart';

global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };

describe('TrendChart', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <TrendChart 
        data={[{ month: 'Jan', transport: 10, energy: 10, food: 10, shopping: 10 }]} 
        reducedMotion={false} 
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
