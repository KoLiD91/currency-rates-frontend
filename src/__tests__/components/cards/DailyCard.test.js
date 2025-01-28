import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import DailyCard from '../../../components/cards/DailyCard';
import { getDailyRate, getCurrencies } from '../../../services/api';

jest.mock('../../../services/api', () => ({
  getDailyRate: jest.fn(),
  getCurrencies: jest.fn()
}));

describe('DailyCard', () => {
  const mockCurrencies = [
    { code: 'EUR', name: 'Euro' }
  ];

  const mockDailyRate = {
    rate: {
      rate: 4.6810,
      date: '2023-04-11T02:00:00+02:00'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getCurrencies.mockResolvedValue(mockCurrencies);
    getDailyRate.mockResolvedValue(mockDailyRate);
  });

  it('should display EUR rate 4.6810 for 2023-04-11', async () => {
    render(<DailyCard />);

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);

    await waitFor(() => {
      const option = screen.getByRole('option', { name: /EUR - Euro/i });
      expect(option).toBeInTheDocument();
    });

    const option = screen.getByRole('option', { name: /EUR - Euro/i });
    fireEvent.click(option);

    const dateInput = screen.getByLabelText('Wybierz datę');
    fireEvent.change(dateInput, { target: { value: '2023-04-11' } });

    await waitFor(() => {
      expect(getDailyRate).toHaveBeenCalledWith('EUR', '2023-04-11');
    });

    await waitFor(() => {
      const rateText = screen.getByText(/1 EUR = 4\.6810 PLN/);
      expect(rateText).toBeInTheDocument();
    });

    await waitFor(() => {
      const dateText = screen.getByText(/11\.04\.2023/);
      expect(dateText).toBeInTheDocument();
    });
  });

  it('should display holiday message for EUR on 2025-01-01', async () => {
    render(<DailyCard />);

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);

    await waitFor(() => {
      const option = screen.getByRole('option', { name: /EUR - Euro/i });
      expect(option).toBeInTheDocument();
    });

    const option = screen.getByRole('option', { name: /EUR - Euro/i });
    fireEvent.click(option);

    const dateInput = screen.getByLabelText('Wybierz datę');
    fireEvent.change(dateInput, { target: { value: '2025-01-01' } });

    await waitFor(() => {
      const holidayMessage = screen.getByText(/W weekendy i święta nie są publikowane kursy walut/i);
      expect(holidayMessage).toBeInTheDocument();
    });

    expect(getDailyRate).not.toHaveBeenCalled();
  });
});