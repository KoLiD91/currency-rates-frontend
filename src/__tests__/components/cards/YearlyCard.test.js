import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import YearlyCard from '../../../components/cards/YearlyCard';
import { getYearlyRates, getCurrencies } from '../../../services/api';

jest.mock('../../../services/api', () => ({
  getYearlyRates: jest.fn(),
  getCurrencies: jest.fn()
}));

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  LineChart: () => <div data-testid="line-chart" />,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null
}));

describe('YearlyCard', () => {
  const mockYearlyData = {
    rates: [
      { date: '2014-01-02', rate: 0.1517 },
    ],
    averageRate: 0.1520 
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getCurrencies.mockResolvedValue([{ code: 'CZK', name: 'Korona czeska' }]);
    getYearlyRates.mockResolvedValue(mockYearlyData);
  });

  it('should display correct rate (0.1517) for CZK on 2014-01-02', async () => {
    render(<YearlyCard />);

    await waitFor(() => {
      expect(screen.getAllByRole('combobox')[0]).toBeInTheDocument();
    });

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    await waitFor(() => {
      expect(screen.getByText('CZK - Korona czeska')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('CZK - Korona czeska'));

    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    await waitFor(() => {
      expect(screen.getByText('2014')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('2014'));

    await waitFor(() => {
      expect(getYearlyRates).toHaveBeenCalledWith('CZK', 2014);
    });

    await waitFor(() => {
      const dateRegex = /2\.01\.2014|02\.01\.2014|2014-01-02/;
      const dateElements = screen.getAllByRole('cell');
      const dateCell = dateElements.find(cell => dateRegex.test(cell.textContent));
      expect(dateCell).toBeInTheDocument();
    });

    await waitFor(() => {
      const rateRegex = /0.1517|0,1517/;
      const rateElements = screen.getAllByRole('cell');
      const rateCell = rateElements.find(cell => rateRegex.test(cell.textContent));
      expect(rateCell).toBeInTheDocument();
    });
  });
});