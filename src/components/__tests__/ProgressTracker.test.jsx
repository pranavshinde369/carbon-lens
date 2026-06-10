import React from 'react';
import { render } from '@testing-library/react';
import ProgressTracker from '../ProgressTracker';

describe('ProgressTracker', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <ProgressTracker annualKg={2500} completedTips={['t1', 't2']} joinedChallenges={['c1']} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
