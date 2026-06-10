import React from 'react';
import { render } from '@testing-library/react';
import AppHeader from '../AppHeader';

describe('AppHeader', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<AppHeader annualKg={2500} onRetakeQuiz={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
