import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:7166/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Funkcja do pobierania aktualnego kursu waluty
export const getCurrentRate = async (currencyCode) => {
    const response = await api.get(`/Currency/rate/${currencyCode}`);
    return response.data;
};

// Funkcja do pobierania kursów dla konkretnego dnia
export const getDailyRate = async (currencyCode, date) => {
    const formattedDate = date.split('T')[0];
    const response = await api.get(`/CurrencyHistory/history/${currencyCode}/daily/${formattedDate}`);
    return response.data;
};

// Funkcja do pobierania kursów miesięcznych  https://localhost:7166/api/CurrencyHistory/history/USD/monthly/2023/2
export const getMonthlyRates = async (currencyCode, year, month) => {
    const response = await api.get(`/CurrencyHistory/history/${currencyCode}/monthly/${year}/${month}`);
    return response.data;
};

// Funkcja do pobierania kursów kwartalnych
export const getQuarterlyRates = async (currencyCode, year, quarter) => {
    const response = await api.get(`/CurrencyHistory/history/${currencyCode}/quarterly/${year}/${quarter}`);
    return response.data;
};

// Funkcja do pobierania kursów rocznych
export const getYearlyRates = async (currencyCode, year) => {
    const response = await api.get(`/CurrencyHistory/history/${currencyCode}/yearly/${year}`);
    return response.data;
};

// Funkcja pobierająca listę dostępnych walut
export const getCurrencies = async () => {
    const response = await api.get('/Currency/available');
    return response.data;
};

