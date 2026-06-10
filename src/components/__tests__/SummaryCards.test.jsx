import React from 'react';
import { render } from '@testing-library/react';
import SummaryCards from '../SummaryCards';

describe('SummaryCards', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <SummaryCards 
        annualKg={2500} 
        breakdown={{ total: 50, byCategory: { transport: 50 } }} 
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
