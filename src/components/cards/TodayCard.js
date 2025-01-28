// components/cards/TodayCard.js
import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import CurrencySelect from '../CurrencySelect';
import { getCurrentRate } from '../../services/api';

const TodayCard = () => {
    const [selectedCurrency, setSelectedCurrency] = useState('');
    const [rateData, setRateData] = useState(null);

    const handleCurrencySelect = async (event) => {
        const currency = event.target.value;
        setSelectedCurrency(currency);
        
        if (currency) {
            try {
                const data = await getCurrentRate(currency);
                setRateData(data);
            } catch (error) {
                console.error('Error fetching rate:', error);
            }
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

            {rateData && (
                <Box sx={{ mt: 2, p: 2, border: 1, borderColor: 'primary.main', borderRadius: 1 }}>
                    <Typography variant="h6" color="primary">
                        Aktualny kurs:
                    </Typography>
                    <Typography variant="h5">
                        {rateData.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Data: {new Date(rateData.date).toLocaleDateString('pl-PL')}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default TodayCard;