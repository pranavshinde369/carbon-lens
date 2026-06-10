import React from 'react';
import { render } from '@testing-library/react';
import BreakdownPie from '../BreakdownPie';

global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };

describe('BreakdownPie', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<BreakdownPie byCategory={{ transport: 29 }} reducedMotion={false} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
