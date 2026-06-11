/**
 * @file SummaryCards.test.jsx
 * @description Unit + snapshot tests for SummaryCards component
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import SummaryCards from './index';

const mockBreakdown = {
  total: 233.72,
  byCategory: { transport: 44.8, energy: 85.92, food: 69, shopping: 34 },
};

describe('SummaryCards', () => {
  test('renders 4 summary cards', () => {
    render(
      <SummaryCards annualKg={2800} breakdown={mockBreakdown} />
    );
    expect(screen.getByText('Your Annual Footprint')).toBeInTheDocument();
    expect(screen.getByText('Daily Average')).toBeInTheDocument();
    expect(screen.getByText('vs. India Urban Avg')).toBeInTheDocument();
    expect(screen.getByText('Paris Target Gap')).toBeInTheDocument();
  });

  test('displays annual footprint value', () => {
    render(<SummaryCards annualKg={2800} breakdown={mockBreakdown} />);
    expect(screen.getByText(/2\.80\s*t\s*CO₂e/i)).toBeInTheDocument();
  });

  test('shows "Below target" when under 2000 kg', () => {
    render(<SummaryCards annualKg={1500} breakdown={mockBreakdown} />);
    expect(screen.getByText(/below target/i)).toBeInTheDocument();
  });

  test('matches snapshot for standard footprint', () => {
    const { asFragment } = render(
      <SummaryCards annualKg={2800} breakdown={mockBreakdown} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
