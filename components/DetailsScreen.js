import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const CurrencyConverterScreen = () => {
  const [currencyRates, setCurrencyRates] = useState({});
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState(null);
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [amount, setAmount] = useState('1'); // Default amount is 1
  const [convertedAmount, setConvertedAmount] = useState(null);
  const apiKey = '442e88dd49ddc470324f206a';

  const fetchCurrencyRates = async () => {
    const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`;

    try {
      const response = await axios.get(apiUrl);
      const rates = response.data.conversion_rates;
      setCurrencyRates(rates);
      setLastUpdateTimestamp(Date.now());
    } catch (error) {
      console.error('Error fetching currency rates:', error);
    }
  };

  const convertCurrency = () => {
    if (currencyRates[targetCurrency]) {
      const rate = currencyRates[targetCurrency];
      const converted = parseFloat(amount) * rate;
      setConvertedAmount(converted.toFixed(2)); // Limit to 2 decimal places
    }
  };

  useEffect(() => {
    fetchCurrencyRates();
    convertCurrency(); // Initial conversion

    const oneDay = 24 * 60 * 60 * 1000;
    if (!lastUpdateTimestamp || Date.now() - lastUpdateTimestamp >= oneDay) {
      fetchCurrencyRates();
    }

    const timer = setInterval(fetchCurrencyRates, 15 * 60 * 1000);

    return () => clearInterval(timer);
  }, [baseCurrency, targetCurrency]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Currency Converter</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={(text) => setAmount(text)}
        keyboardType="numeric"
      />
      <Text style={styles.result}>
        {amount} {baseCurrency} = {convertedAmount} {targetCurrency}
      </Text>
      <Picker
        selectedValue={baseCurrency}
        onValueChange={(itemValue) => setBaseCurrency(itemValue)}>
        {Object.keys(currencyRates).map((currency) => (
          <Picker.Item key={currency} label={currency} value={currency} />
        ))}
      </Picker>
      <Picker
        selectedValue={targetCurrency}
        onValueChange={(itemValue) => setTargetCurrency(itemValue)}>
        {Object.keys(currencyRates).map((currency) => (
          <Picker.Item key={currency} label={currency} value={currency} />
        ))}
      </Picker>
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
  input: {
    fontSize: 16,
    marginBottom: 8,
    borderColor: '#555',
    borderWidth: 1,
    padding: 8,
  },
  result: {
    fontSize: 18,
    marginTop: 16,
    color: 'green',
  },
});

export default CurrencyConverterScreen;
