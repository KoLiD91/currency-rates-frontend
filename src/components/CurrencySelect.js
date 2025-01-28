import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { getCurrencies } from '../services/api';

const CurrencySelect = ({ value, onChange }) => {
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                setLoading(true);
                const data = await getCurrencies();
                setCurrencies(data);
            } catch (error) {
                console.error('Błąd podczas pobierania listy walut:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrencies();
    }, []);

    return (
        <FormControl fullWidth>
            <InputLabel>Wybierz walutę</InputLabel>
            <Select
                value={value}
                onChange={onChange}
                label="Wybierz walutę"
            >
                {loading ? (
                    <MenuItem disabled>
                        <CircularProgress size={20} />
                        Ładowanie walut...
                    </MenuItem>
                ) : (
                    currencies.map((currency) => (
                        <MenuItem key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                        </MenuItem>
                    ))
                )}
            </Select>
        </FormControl>
    );
};

export default CurrencySelect;