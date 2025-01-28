import React, { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import CurrencySelect from '../CurrencySelect';
import { getDailyRate } from '../../services/api';

const DailyCard = () => {
    const [selectedCurrency, setSelectedCurrency] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [rateData, setRateData] = useState(null);

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

    const isWeekendOrHoliday = (date) => {
        const d = new Date(date);
        return d.getDay() === 0 || d.getDay() === 6 || isHoliday(date);
    };

    const handleCurrencySelect = async (event) => {
        setSelectedCurrency(event.target.value);
        if (selectedDate) {
            fetchRate(event.target.value, selectedDate);
        }
    };

    const handleDateChange = async (event) => {
        const newDate = event.target.value;
        setSelectedDate(newDate);
        
        if (isWeekendOrHoliday(newDate)) {
            setRateData(null);
            return;
        }
        
       if (selectedCurrency) {
            try {
                const data = await getDailyRate(selectedCurrency, newDate);
                setRateData(data);
            } catch (error) {
                console.error('Error fetching rate:', error);
                setRateData(null); 
            }
        }
    }

    const fetchRate = async (currency, date) => {
        try {
            const data = await getDailyRate(currency, date);
            setRateData(data);
        } catch (error) {
            console.error('Error fetching rate:', error);
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

            {selectedDate && isWeekendOrHoliday(selectedDate) ? (
            <Typography color="error" sx={{ mt: 2 }}>
                W weekendy i święta nie są publikowane kursy walut
            </Typography>
        ) : (
            rateData && (
                <Box sx={{ mt: 2, p: 2, border: 1, borderColor: 'primary.main', borderRadius: 1 }}>
                    <Typography variant="h6" color="primary">
                        Kurs dla wybranej daty:
                    </Typography>
                    <Typography variant="h5">
                        {`1 ${selectedCurrency} = ${parseFloat(rateData.rate.rate).toFixed(4)} PLN`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {`Data: ${new Date(rateData.rate.date).toLocaleDateString('pl-PL')}`}
                    </Typography>
                </Box>
            )
        )}
    </Box>
    );
};

export default DailyCard;