import React from 'react';
import { render } from '@testing-library/react';
import AppNav from '../AppNav';

describe('AppNav', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<AppNav currentTab="dashboard" onTabChange={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
