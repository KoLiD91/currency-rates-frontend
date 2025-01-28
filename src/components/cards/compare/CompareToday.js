
import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import CurrencySelect from '../../CurrencySelect';
import { getCurrentRate } from '../../../services/api';

const CompareToday = () => {
    const [firstCurrency, setFirstCurrency] = useState('');
    const [secondCurrency, setSecondCurrency] = useState('');
    const [comparison, setComparison] = useState(null);

    const handleFirstCurrencyChange = async (event) => {
        const currency = event.target.value;
        setFirstCurrency(currency);
        if (secondCurrency) {
            await fetchComparison(currency, secondCurrency);
        }
    };

    const handleSecondCurrencyChange = async (event) => {
        const currency = event.target.value;
        setSecondCurrency(currency);
        if (firstCurrency) {
            await fetchComparison(firstCurrency, currency);
        }
    };

    const fetchComparison = async (curr1, curr2) => {
        try {
            const rate1 = await getCurrentRate(curr1);
            const rate2 = await getCurrentRate(curr2);
            
            const ratio = rate1.rateAgainstPLN / rate2.rateAgainstPLN;
            
            setComparison({
                date: new Date().toISOString(),
                firstCurrency: curr1,
                secondCurrency: curr2,
                ratio: ratio,
                firstRate: rate1.rateAgainstPLN,
                secondRate: rate2.rateAgainstPLN
            });
        } catch (error) {
            console.error('Error fetching comparison:', error);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
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

            {comparison && (
                <Paper sx={{ p: 2, mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Porównanie kursów
                    </Typography>
                    <Typography variant="body1">
                        1 {comparison.firstCurrency} = {comparison.ratio.toFixed(4)} {comparison.secondCurrency}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Kursy względem PLN:
                    </Typography>
                    <Typography variant="body2">
                        1 {comparison.firstCurrency} = {comparison.firstRate.toFixed(4)} PLN
                    </Typography>
                    <Typography variant="body2">
                        1 {comparison.secondCurrency} = {comparison.secondRate.toFixed(4)} PLN
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Data: {new Date(comparison.date).toLocaleDateString('pl-PL')}
                    </Typography>
                </Paper>
            )}
        </Box>
    );
};

export default CompareToday;