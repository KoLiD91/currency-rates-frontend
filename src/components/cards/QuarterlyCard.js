import React, { useState } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CurrencySelect from '../CurrencySelect';
import { getQuarterlyRates } from '../../services/api';

const QuarterlyCard = () => {
   const currentYear = new Date().getFullYear();
   const years = Array.from({ length: currentYear - 2002 + 1 }, (_, i) => currentYear - i);
   const quarters = [
       { value: 1, label: "Q1 (Styczeń - Marzec)" },
       { value: 2, label: "Q2 (Kwiecień - Czerwiec)" },
       { value: 3, label: "Q3 (Lipiec - Wrzesień)" },
       { value: 4, label: "Q4 (Październik - Grudzień)" }
   ];

   const [quarterlyData, setQuarterlyData] = useState({rates: [], averageRate: null});
   const [selectedCurrency, setSelectedCurrency] = useState('');
   const [selectedYear, setSelectedYear] = useState(currentYear);
   const [selectedQuarter, setSelectedQuarter] = useState(1);

   const handleCurrencySelect = (event) => {
       setSelectedCurrency(event.target.value);
       if (selectedYear && selectedQuarter) {
           fetchQuarterlyRates(event.target.value, selectedYear, selectedQuarter);
       }
   };

   const handleYearChange = (event) => {
       setSelectedYear(event.target.value);
       if (selectedCurrency) {
           fetchQuarterlyRates(selectedCurrency, event.target.value, selectedQuarter);
       }
   };

   const handleQuarterChange = (event) => {
       setSelectedQuarter(event.target.value);
       if (selectedCurrency) {
           fetchQuarterlyRates(selectedCurrency, selectedYear, event.target.value);
       }
   };

   const fetchQuarterlyRates = async (currency, year, quarter) => {
       try {
           const data = await getQuarterlyRates(currency, year, quarter);
           setQuarterlyData(data);
       } catch (error) {
           console.error('Error fetching quarterly rates:', error);
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
                   <InputLabel>Kwartał</InputLabel>
                   <Select
                       value={selectedQuarter}
                       onChange={handleQuarterChange}
                       label="Kwartał"
                   >
                       {quarters.map(quarter => (
                           <MenuItem key={quarter.value} value={quarter.value}>
                               {quarter.label}
                           </MenuItem>
                       ))}
                   </Select>
               </FormControl>
           </Box>

           {quarterlyData.averageRate && (
               <Box sx={{ mb: 2, p: 2, bgcolor: 'primary.light', color: 'white', borderRadius: 1 }}>
                   <Typography variant="h6">
                       Średni kurs w kwartale: {quarterlyData.averageRate.toFixed(4)} PLN
                   </Typography>
               </Box>
           )}

           {quarterlyData.rates.length > 0 && (
               <Box sx={{ height: 300, mb: 2 }}>
                   <ResponsiveContainer width="100%" height="100%">
                       <LineChart data={quarterlyData.rates}>
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

           {quarterlyData.rates.length > 0 && (
               <TableContainer component={Paper}>
                   <Table>
                       <TableHead>
                           <TableRow>
                               <TableCell>Data</TableCell>
                               <TableCell align="right">Kurs</TableCell>
                           </TableRow>
                       </TableHead>
                       <TableBody>
                           {quarterlyData.rates.map((rate, index) => (
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

export default QuarterlyCard;