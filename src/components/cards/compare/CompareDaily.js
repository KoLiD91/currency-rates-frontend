import React, { useState } from 'react';
import { Box, Typography, TextField, Paper } from '@mui/material';
import CurrencySelect from '../../CurrencySelect';
import { getDailyRate } from '../../../services/api';


const CompareDaily = () => {
    const [firstCurrency, setFirstCurrency] = useState('');
    const [secondCurrency, setSecondCurrency] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [comparisonData, setComparisonData] = useState(null);

    const isWeekendOrHoliday = (date) => {
        const d = new Date(date);
        return d.getDay() === 0 || d.getDay() === 6 || isHoliday(date);
    };

    const isHoliday = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        
        const holidays = [
            `${year}-01-01`, // Nowy Rok
            `${year}-01-06`, // Trzech Króli
            `${year}-05-01`, // Święto Pracy
            `${year}-05-03`, // Święto Konstytucji
            `${year}-08-15`, // Wniebowzięcie
            `${year}-11-01`, // Wszystkich Świętych
            `${year}-11-11`, // Niepodległość
            `${year}-12-25`, // Boże Narodzenie
            `${year}-12-26`  // Drugi dzień świąt
        ];

        return holidays.includes(date.split('T')[0]);
    };

    const handleDateChange = async (event) => {
        const newDate = event.target.value;
        setSelectedDate(newDate);

        if (isWeekendOrHoliday(newDate)) {
            setComparisonData(null);
            return;
        }

        if (firstCurrency && secondCurrency) {
            await fetchComparisonData(firstCurrency, secondCurrency, newDate);
        }
    };

    const fetchComparisonData = async (curr1, curr2, date) => {
        try {
            const [rate1Data, rate2Data] = await Promise.all([
                getDailyRate(curr1, date),
                getDailyRate(curr2, date)
            ]);

            const rate1 = rate1Data.rate.rate;
            const rate2 = rate2Data.rate.rate;
            
            setComparisonData({
                date: date,
                firstCurrency: curr1,
                secondCurrency: curr2,
                ratio: rate1 / rate2,
                firstRate: rate1,
                secondRate: rate2
            });
        } catch (error) {
            console.error('Error fetching comparison:', error);
            setComparisonData(null); 
        }
    };

    const handleFirstCurrencyChange = async (event) => {
        const currency = event.target.value;
        setFirstCurrency(currency);
        
        if (secondCurrency && selectedDate && !isWeekendOrHoliday(selectedDate)) {
            await fetchComparisonData(currency, secondCurrency, selectedDate);
        }
    };

    const handleSecondCurrencyChange = async (event) => {
        const currency = event.target.value;
        setSecondCurrency(currency);
        
        if (firstCurrency && selectedDate && !isWeekendOrHoliday(selectedDate)) {
            await fetchComparisonData(firstCurrency, currency, selectedDate);
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

            <Box sx={{ mt: 2 }}>
                <TextField
                    type="date"
                    label="Wybierz datę"
                    value={selectedDate}
                    onChange={handleDateChange}
                    fullWidth
                    slotProps={{
                        inputLabel: {
                            shrink: true
                        },
                        input: {
                            max: new Date().toISOString().split('T')[0]
                        }
                    }}
                />
            </Box>

            {/* Wyświetlanie komunikatu o weekendzie/święcie LUB danych o kursach */}
            {selectedDate && isWeekendOrHoliday(selectedDate) ? (
                <Typography color="error" sx={{ mt: 2 }}>
                    W weekendy i święta nie są publikowane kursy walut
                </Typography>
            ) : comparisonData && (
                <Paper sx={{ p: 2, mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Porównanie kursów
                    </Typography>
                    <Typography variant="body1">
                        1 {comparisonData.firstCurrency} = {comparisonData.ratio.toFixed(4)} {comparisonData.secondCurrency}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Kursy względem PLN:
                    </Typography>
                    <Typography variant="body2">
                        1 {comparisonData.firstCurrency} = {comparisonData.firstRate.toFixed(4)} PLN
                    </Typography>
                    <Typography variant="body2">
                        1 {comparisonData.secondCurrency} = {comparisonData.secondRate.toFixed(4)} PLN
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Data: {new Date(comparisonData.date).toLocaleDateString('pl-PL')}
                    </Typography>
                </Paper>
            )}
        </Box>
    );
};

export default CompareDaily;