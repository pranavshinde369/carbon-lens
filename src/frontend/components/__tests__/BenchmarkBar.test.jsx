import React from 'react';
import { render } from '@testing-library/react';
import BenchmarkBar from '../BenchmarkBar';

describe('BenchmarkBar', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<BenchmarkBar annualKg={2500} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
