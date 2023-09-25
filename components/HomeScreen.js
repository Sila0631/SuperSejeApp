import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';

const CurrencyExchangeScreen = () => {
  // State to store currency rates and last update timestamp
  const [currencyRates, setCurrencyRates] = useState({});
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState(null);
  const baseCurrency = 'USD'; // Change this to your desired base currency
  const apiKey = '442e88dd49ddc470324f206a'; // Replace with your actual API key

  // Function to fetch currency rates using Axios
  const fetchCurrencyRates = async () => {
    const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`;

    try {
      const response = await axios.get(apiUrl);

      // Parse the response and update your state with the latest rates
      const rates = response.data.conversion_rates;
      setCurrencyRates(rates);

      // Set the last update timestamp to the current time
      setLastUpdateTimestamp(Date.now());
    } catch (error) {
      console.error('Error fetching currency rates:', error);
    }
  };

  // Function to periodically fetch updated currency rates (every day)
  const fetchAndUpdateRates = () => {
    const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
    
    // Check if the last update was more than a day ago
    if (!lastUpdateTimestamp || Date.now() - lastUpdateTimestamp >= oneDay) {
      fetchCurrencyRates();
    }
  };

  // Fetch currency rates on component mount
  useEffect(() => {
    fetchCurrencyRates();

    // Set up a timer to periodically fetch rates (e.g., every 15 minutes)
    const timer = setInterval(fetchAndUpdateRates, 15 * 60 * 1000);

    // Clear the timer on unmount to prevent memory leaks
    return () => clearInterval(timer);
  }, []);

  // Example data for the chart
  const chartData = {
    labels: Object.keys(currencyRates),
    datasets: [
      {
        data: Object.values(currencyRates),
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Live Currency Rates Every 24h:</Text>
      {Object.entries(currencyRates).map(([currency, rate]) => (
        <Text key={currency} style={styles.currencyRate}>
          USD to {currency}: {rate}
        </Text>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  currencyRate: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
});

export default CurrencyExchangeScreen;
