import React, { useState } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import CurrencySelect from '../../CurrencySelect';
import { getYearlyRates } from '../../../services/api';

const CompareYearly = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2002 + 1 }, (_, i) => currentYear - i);

    const [firstCurrency, setFirstCurrency] = useState('');
    const [secondCurrency, setSecondCurrency] = useState('');
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [comparisonData, setComparisonData] = useState(null);

    const fetchComparisonData = async (curr1, curr2, year) => {
        try {
            const [data1, data2] = await Promise.all([
                getYearlyRates(curr1, year),
                getYearlyRates(curr2, year)
            ]);

            const combinedData = data1.rates.map(rate1 => {
                const rate2 = data2.rates.find(r => r.date === rate1.date);
                return {
                    date: rate1.date,
                    rate1: rate1.rate,
                    rate2: rate2 ? rate2.rate : null,
                    ratio: rate2 ? rate1.rate / rate2.rate : null
                };
            });

            setComparisonData({
                rates: combinedData,
                averageRatio: data1.averageRate / data2.averageRate,
                firstCurrency: curr1,
                secondCurrency: curr2,
                averageRate1: data1.averageRate,
                averageRate2: data2.averageRate
            });
        } catch (error) {
            console.error('Błąd podczas pobierania danych rocznych:', error);
        }
    };

    const handleFirstCurrencyChange = (event) => {
        const currency = event.target.value;
        setFirstCurrency(currency);
        if (secondCurrency) {
            fetchComparisonData(currency, secondCurrency, selectedYear);
        }
    };

    const handleSecondCurrencyChange = (event) => {
        const currency = event.target.value;
        setSecondCurrency(currency);
        if (firstCurrency) {
            fetchComparisonData(firstCurrency, currency, selectedYear);
        }
    };

    const handleYearChange = (event) => {
        const year = event.target.value;
        setSelectedYear(year);
        if (firstCurrency && secondCurrency) {
            fetchComparisonData(firstCurrency, secondCurrency, year);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            {/* Sekcja wyboru walut - dwie waluty obok siebie */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Pierwsza waluta
                    </Typography>
                    <CurrencySelect
                        value={firstCurrency}
                        onChange={handleFirstCurrencyChange}
                    />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Druga waluta
                    </Typography>
                    <CurrencySelect
                        value={secondCurrency}
                        onChange={handleSecondCurrencyChange}
                    />
                </Box>
            </Box>

            {/* Wybór roku */}
            <Box sx={{ mb: 3 }}>
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
            </Box>

            {/* Sekcja wyświetlająca średnie kursy */}
            {comparisonData && (
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Średnie kursy w roku {selectedYear}
                    </Typography>
                    <Typography variant="body1">
                        1 {comparisonData.firstCurrency} = {comparisonData.averageRatio.toFixed(4)} {comparisonData.secondCurrency}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Średnie kursy względem PLN:
                    </Typography>
                    <Typography variant="body2">
                        1 {comparisonData.firstCurrency} = {comparisonData.averageRate1.toFixed(4)} PLN
                    </Typography>
                    <Typography variant="body2">
                        1 {comparisonData.secondCurrency} = {comparisonData.averageRate2.toFixed(4)} PLN
                    </Typography>
                </Paper>
            )}

            {/* Wykres pokazujący zmiany kursu w czasie */}
            {comparisonData && comparisonData.rates.length > 0 && (
                <Box sx={{ height: 400, mb: 3 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={comparisonData.rates}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="date" 
                                tickFormatter={(date) => new Date(date).toLocaleDateString('pl-PL')}
                            />
                            <YAxis domain={['auto', 'auto']} />
                            <Tooltip 
                                formatter={(value) => value.toFixed(4)}
                                labelFormatter={(date) => new Date(date).toLocaleDateString('pl-PL')}
                            />
                            <Legend />
                            <Line 
                                type="monotone" 
                                dataKey="ratio" 
                                name={`Kurs ${firstCurrency}/${secondCurrency}`}
                                stroke="#8884d8" 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            )}

            {/* Tabela ze szczegółowymi danymi */}
            {comparisonData && comparisonData.rates.length > 0 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Data</TableCell>
                                <TableCell align="right">{firstCurrency}</TableCell>
                                <TableCell align="right">{secondCurrency}</TableCell>
                                <TableCell align="right">Stosunek {firstCurrency}/{secondCurrency}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {comparisonData.rates.map((row, index) => (
                                <TableRow 
                                    key={row.date}
                                    sx={{ backgroundColor: index % 2 === 0 ? 'white' : 'grey.50' }}
                                >
                                    <TableCell>
                                        {new Date(row.date).toLocaleDateString('pl-PL')}
                                    </TableCell>
                                    <TableCell align="right">{row.rate1.toFixed(4)}</TableCell>
                                    <TableCell align="right">{row.rate2.toFixed(4)}</TableCell>
                                    <TableCell align="right">{row.ratio.toFixed(4)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default CompareYearly;