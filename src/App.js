import React, { useState } from 'react';
import { Container, AppBar, Tabs, Tab, Box, Typography } from '@mui/material';
import SmallCard from './components/SmallCard';
import TodayCard from './components/cards/TodayCard';
import DailyCard from './components/cards/DailyCard';
import MonthlyCard from './components/cards/MonthlyCard';
import QuarterlyCard from './components/cards/QuarterlyCard';
import YearlyCard from './components/cards/YearlyCard';
import CompareToday from './components/cards/compare/CompareToday';
import CompareDaily from './components/cards/compare/CompareDaily';
import CompareMonthly from './components/cards/compare/CompareMonthly';
import CompareQuarterly from './components/cards/compare/CompareQuarterly';
import CompareYearly from './components/cards/compare/CompareYearly';


function App() {
  const [viewType, setViewType] = useState('pln');
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [rateData, setRateData] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

 
  // Obsługa zmiany widoku głównego
  const handleViewChange = (event, newValue) => {
    setViewType(newValue);
    resetSelection();
  };

  // Resetowanie wszystkich wyborów
  const resetSelection = () => {
    setSelectedCard(null);
    setSelectedCurrency('');
    setRateData(null);
  };

  // Obsługa wyboru karty
  const handleCardSelect = (cardType) => {
    setSelectedCard(cardType);
    setSelectedCurrency('');
    setSelectedDate('');
    setRateData(null);
  };  
 
  // Renderowanie głównego widoku PLN
  const renderPLNView = () => {
    return (
      <Box sx={{ mt: 4 }}>
        {/* Karty wyboru */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 2,
          mb: 4
        }}>
          <SmallCard
            title="Dzisiaj"
            isSelected={selectedCard === 'today'}
            onClick={() => handleCardSelect('today')}
          />
          <SmallCard
            title="Dzienny"
            isSelected={selectedCard === 'daily'}
            onClick={() => handleCardSelect('daily')}
          />
          <SmallCard
            title="Miesięczny"
            isSelected={selectedCard === 'monthly'}
            onClick={() => handleCardSelect('monthly')}
          />
          <SmallCard
            title="Kwartalny"
            isSelected={selectedCard === 'quarterly'}
            onClick={() => handleCardSelect('quarterly')}
          />
          <SmallCard
            title="Roczny"
            isSelected={selectedCard === 'yearly'}
            onClick={() => handleCardSelect('yearly')}
        />
        </Box>

        {/* Zawartość wybranej karty */}
        {selectedCard === 'today' && <TodayCard />}
        {selectedCard === 'daily' && <DailyCard />}
        {selectedCard === 'monthly' && <MonthlyCard />}
        {selectedCard === 'quarterly' && <QuarterlyCard />}
        {selectedCard === 'yearly' && <YearlyCard />}
      </Box>
    );
  };

  const renderCompareView = () => {
    return (
        <Box sx={{ mt: 4 }}>
            <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: 2,
                mb: 4 
            }}>
                <SmallCard
                    title="Dzisiaj"
                    isSelected={selectedCard === 'compare-today'}
                    onClick={() => handleCardSelect('compare-today')}
                />
                <SmallCard
                    title="Dzienny"
                    isSelected={selectedCard === 'compare-daily'}
                    onClick={() => handleCardSelect('compare-daily')}
                />
                <SmallCard
                    title="Miesięczny"
                    isSelected={selectedCard === 'compare-monthly'}
                    onClick={() => handleCardSelect('compare-monthly')}
                />
                <SmallCard
                    title="Kwartalny"
                    isSelected={selectedCard === 'compare-quarterly'}
                    onClick={() => handleCardSelect('compare-quarterly')}
                />
                <SmallCard
                    title="Roczny"
                    isSelected={selectedCard === 'compare-yearly'}
                    onClick={() => handleCardSelect('compare-yearly')}
                />
            </Box>

            {/* Renderowanie odpowiedniego komponentu w zależności od wybranej karty */}
            {selectedCard === 'compare-today' && <CompareToday />}
            {selectedCard === 'compare-daily' && <CompareDaily />}
            {selectedCard === 'compare-monthly' && <CompareMonthly />}
            {selectedCard === 'compare-quarterly' && <CompareQuarterly />}
            {selectedCard === 'compare-yearly' && <CompareYearly />}
        </Box>
    );
};

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="default">
        <Tabs value={viewType} onChange={handleViewChange} centered>
          <Tab label="Kursy PLN" value="pln" />
          <Tab label="Kursy innych walut" value="compare" />
        </Tabs>
      </AppBar>

      <Container>
            {viewType === 'pln' ? renderPLNView() : renderCompareView()}
        </Container>
    </Box>
  );
}

export default App;