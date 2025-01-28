import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MonthlyCard from '../../../components/cards/MonthlyCard';
import { getMonthlyRates, getCurrencies } from '../../../services/api';

jest.mock('../../../services/api', () => ({
  getMonthlyRates: jest.fn(),
  getCurrencies: jest.fn()
}));

describe('MonthlyCard', () => {
  const mockMonthlyData = {
    rates: [],  
    averageRate: 5.2279
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getCurrencies.mockResolvedValue([{ code: 'GBP', name: 'Funt brytyjski' }]);
    getMonthlyRates.mockResolvedValue(mockMonthlyData);
  });

  it('should display correct average rate (5.2279) for GBP July 2016', async () => {
    render(<MonthlyCard />);

    await waitFor(() => {
      expect(screen.getAllByRole('combobox')[0]).toBeInTheDocument();
    });

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    await waitFor(() => {
      expect(screen.getByText('GBP - Funt brytyjski')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('GBP - Funt brytyjski'));

    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    await waitFor(() => {
      expect(screen.getByText('2016')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('2016'));

    fireEvent.mouseDown(screen.getAllByRole('combobox')[2]);
    await waitFor(() => {
      expect(screen.getByText('Lipiec')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Lipiec'));

    await waitFor(() => {
      expect(getMonthlyRates).toHaveBeenCalledWith('GBP', 2016, 7);
    });

    await waitFor(() => {
      const rateText = screen.getByText(/5\.2279 PLN/);
      expect(rateText).toBeInTheDocument();
    });
  });
});