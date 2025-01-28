import React, { useState } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CurrencySelect from '../CurrencySelect';
import { getMonthlyRates } from '../../services/api';

const MonthlyCard = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2002 + 1 }, (_, i) => currentYear - i);
    const months = [
        { value: 1, label: "Styczeń" },
        { value: 2, label: "Luty" },
        { value: 3, label: "Marzec" },
        { value: 4, label: "Kwiecień" },
        { value: 5, label: "Maj" },
        { value: 6, label: "Czerwiec" },
        { value: 7, label: "Lipiec" },
        { value: 8, label: "Sierpień" },
        { value: 9, label: "Wrzesień" },
        { value: 10, label: "Październik" },
        { value: 11, label: "Listopad" },
        { value: 12, label: "Grudzień" }
    ];

    const [monthlyData, setMonthlyData] = useState({rates: [], averageRate: null});
    const [selectedCurrency, setSelectedCurrency] = useState('');
    const [selectedYear, setSelectedYear] = useState(years[0]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

    const handleCurrencySelect = (event) => {
        setSelectedCurrency(event.target.value);
        if (selectedYear && selectedMonth) {
            fetchMonthlyRates(event.target.value, selectedYear, selectedMonth);
        }
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
        if (selectedCurrency) {
            fetchMonthlyRates(selectedCurrency, event.target.value, selectedMonth);
        }
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
        if (selectedCurrency) {
            fetchMonthlyRates(selectedCurrency, selectedYear, event.target.value);
        }
    };

    const fetchMonthlyRates = async (currency, year, month) => {
        try {
            const data = await getMonthlyRates(currency, year, month);
            setMonthlyData(data);
        } catch (error) {
            console.error('Error fetching monthly rates:', error);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ mb: 3 }}>
                <CurrencySelect
                    value={selectedCurrency}
                    onChange={handleCurrencySelect}
                />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <FormControl fullWidth>
                    <InputLabel>Rok</InputLabel>
                    <Select
                        value={selectedYear}
                        onChange={handleYearChange}
                        label="Rok"
                    >
                        {years.map(year => (
                            <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel>Miesiąc</InputLabel>
                    <Select
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        label="Miesiąc"
                    >
                        {months.map(month => (
                            <MenuItem key={month.value} value={month.value}>
                                {month.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {monthlyData.averageRate && (
                <Box sx={{ mb: 2, p: 2, bgcolor: 'primary.light', color: 'white', borderRadius: 1 }}>
                    <Typography variant="h6">
                        Średni kurs w miesiącu: {monthlyData.averageRate.toFixed(4)} PLN
                    </Typography>
                </Box>
            )}

            {monthlyData.rates.length > 0 && (
                <Box sx={{ height: 300, mb: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyData.rates}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="date" 
                                tickFormatter={(date) => new Date(date).toLocaleDateString('pl-PL')}
                            />
                            <YAxis domain={['auto', 'auto']} />
                            <Tooltip />
                            <Line 
                                type="monotone" 
                                dataKey="rate" 
                                stroke="#8884d8" 
                                dot={false} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            )}

            {monthlyData.rates.length > 0 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Data</TableCell>
                                <TableCell align="right">Kurs</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {monthlyData.rates.map((rate, index) => (
                                <TableRow 
                                    key={rate.date}
                                    sx={{ backgroundColor: index % 2 === 0 ? 'white' : 'grey.50' }}
                                >
                                    <TableCell>
                                        {new Date(rate.date).toLocaleDateString('pl-PL')}
                                    </TableCell>
                                    <TableCell align="right">
                                        {parseFloat(rate.rate).toFixed(4)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default MonthlyCard;