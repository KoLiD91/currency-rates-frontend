import React, { useState } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CurrencySelect from '../CurrencySelect';
import { getYearlyRates } from '../../services/api';

const YearlyCard = () => {
   const currentYear = new Date().getFullYear();
   const years = Array.from({ length: currentYear - 2002 + 1 }, (_, i) => currentYear - i);

   const [yearlyData, setYearlyData] = useState({rates: [], averageRate: null});
   const [selectedCurrency, setSelectedCurrency] = useState('');
   const [selectedYear, setSelectedYear] = useState(currentYear);

   const handleCurrencySelect = (event) => {
       setSelectedCurrency(event.target.value);
       if (selectedYear) {
           fetchYearlyRates(event.target.value, selectedYear);
       }
   };

   const handleYearChange = (event) => {
       setSelectedYear(event.target.value);
       if (selectedCurrency) {
           fetchYearlyRates(selectedCurrency, event.target.value);
       }
   };

   const fetchYearlyRates = async (currency, year) => {
       try {
           const data = await getYearlyRates(currency, year);
           setYearlyData(data);
       } catch (error) {
           console.error('Error fetching yearly rates:', error);
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

           {yearlyData.averageRate && (
               <Box sx={{ mb: 2, p: 2, bgcolor: 'primary.light', color: 'white', borderRadius: 1 }}>
                   <Typography variant="h6">
                       Średni kurs w roku: {yearlyData.averageRate.toFixed(4)} PLN
                   </Typography>
               </Box>
           )}

           {yearlyData.rates.length > 0 && (
               <Box sx={{ height: 300, mb: 2 }}>
                   <ResponsiveContainer width="100%" height="100%">
                       <LineChart data={yearlyData.rates}>
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

           {yearlyData.rates.length > 0 && (
               <TableContainer component={Paper}>
                   <Table>
                       <TableHead>
                           <TableRow>
                               <TableCell>Data</TableCell>
                               <TableCell align="right">Kurs</TableCell>
                           </TableRow>
                       </TableHead>
                       <TableBody>
                           {yearlyData.rates.map((rate, index) => (
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

export default YearlyCard;