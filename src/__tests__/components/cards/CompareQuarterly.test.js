import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CompareQuarterly from '../../../components/cards/compare/CompareQuarterly';

// Mock dla recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="chart-container">{children}</div>,
  LineChart: () => <div data-testid="line-chart" />,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null
}));


// Mock dla API
jest.mock('../../../services/api', () => ({
  getCurrencies: () => Promise.resolve([]),
  getQuarterlyRates: () => Promise.resolve({ rates: [], averageRate: 0 })
}));

describe('CompareQuarterly', () => {
  it('should render chart component', async () => {
    render(<CompareQuarterly />);
    
    await waitFor(() => {
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });
});