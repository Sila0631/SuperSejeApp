import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';

const ForecastingScreen = () => {
  const [data, setData] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [filteredLabels, setFilteredLabels] = useState([]);

  useEffect(() => {
    // Fetch financial data from an API or local source
    axios
      .get(
        'https://api.stlouisfed.org/fred/series/observations?series_id=LNS14000006&api_key=2cf8f333f687f5a1c66dd3ebfb87729a&file_type=json'
      )
      .then((response) => {
        const financialData = response.data;

        // Verify if the data structure matches expectations
        if (financialData && financialData.observations) {
        
         // Extract data points
          const observations = financialData.observations;
          const dates = observations.map((item) => item.date);
          const values = observations.map((item) => parseFloat(item.value));

          // Extract and format years from dates
          const years = dates.map((date) => new Date(date).getFullYear());

          // Perform linear regression
          const n = dates.length;
          const sumX = dates.reduce((acc, date, index) => acc + index, 0);
          const sumY = values.reduce((acc, value) => acc + value, 0);
          const sumXY = dates.reduce((acc, date, index) => acc + index * values[index], 0);
          const sumXSquare = dates.reduce((acc, date, index) => acc + index * index, 0);

          const slope = (n * sumXY - sumX * sumY) / (n * sumXSquare - sumX * sumX);
          const intercept = (sumY - slope * sumX) / n;

          // Generate forecasted data points
          const forecastedData = [];
          for (let i = 0; i < n + 5; i++) {
            const forecastedY = slope * i + intercept;
            forecastedData.push({ x: i, y: forecastedY });
          }

          setData(observations);
          setForecast(forecastedData);

          // Filter years for X-axis labels (show every 10 years)
          const filteredYears = years.filter((year, index) => index % 100 === 0);
          const filteredLabels = filteredYears.map((year) => year.toString());
          setFilteredLabels(filteredLabels);
        } else {
          console.error('Data structure is not as expected:', financialData);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Adjust chart width based on screen width
  const screenWidth = Dimensions.get('window').width;

  return (
    <View>
      <Text>Unemployment Rate - Black or African American</Text>
      <LineChart
        data={{
          labels: filteredLabels, // Use filtered labels for X-axis
          datasets: [
            {
              data: data.map((item) => parseFloat(item.value)),
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              strokeWidth: 2,
            },
            {
              data: forecast.map((item) => item.y),
              color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
              strokeWidth: 2,
              withDots: true,
              withShadow: false,
              withVerticalLines: false,
              withHorizontalLines: false,
              dotRadius: 4,
            },
          ],
        }}
        width={screenWidth - 16}
        height={200}
        yAxisLabel={'$'}
        chartConfig={{
          backgroundColor: 'white',
          backgroundGradientFrom: 'white',
          backgroundGradientTo: 'white',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

export default ForecastingScreen;
