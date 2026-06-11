import React from 'react';
import { render } from '@testing-library/react';
import TipsPanel from '../TipsPanel';

describe('TipsPanel', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <TipsPanel 
        breakdown={{ byCategory: {} }} 
        completedTips={[]} 
        onCompleteTip={() => {}} 
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
