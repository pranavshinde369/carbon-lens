import React from 'react';
import { render } from '@testing-library/react';
import Dashboard from '../Dashboard';

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('Dashboard', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <Dashboard 
        annualKg={2500} 
        log={[]} 
        breakdown={{ byCategory: {} }} 
        completedTips={[]} 
        joinedChallenges={[]} 
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
