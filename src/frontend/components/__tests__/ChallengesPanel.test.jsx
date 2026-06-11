import React from 'react';
import { render } from '@testing-library/react';
import ChallengesPanel from '../ChallengesPanel';

describe('ChallengesPanel', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <ChallengesPanel joined={[]} onJoin={() => {}} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
