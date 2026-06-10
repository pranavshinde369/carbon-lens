import React from 'react';
import { render } from '@testing-library/react';
import LogActivity from '../LogActivity';

describe('LogActivity', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<LogActivity log={[]} dispatch={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
