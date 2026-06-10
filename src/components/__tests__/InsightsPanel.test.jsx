import React from 'react';
import { render } from '@testing-library/react';
import InsightsPanel from '../InsightsPanel';

describe('InsightsPanel', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<InsightsPanel annualKg={2500} breakdown={{ byCategory: { transport: 500 } }} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
