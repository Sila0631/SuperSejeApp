import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import ForecastingScreen from './components/SettingsScreen';

// Import Firebase Services
import { getApps, initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Card } from 'react-native-paper';

// Import components from the components folder
import ProfileScreen from './components/ProfileScreen';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import HomeScreen from "./components/HomeScreen";
import SettingsScreen from "./components/SettingsScreen";
import Ionicons from 'react-native-vector-icons/Ionicons';
import StackNavigator from "./components/StackNavigator";
import MoneyBill from "./assets/Money-bill.png"
import Watch from "./assets/watch-icon.png"
import Profile from "./assets/profile-icon.png"

const firebaseConfig = {
  apiKey: "AIzaSyBu1me_3yW57nDoF97BfMCeAFern6TfbI4",
  authDomain: "supersej-30a36.firebaseapp.com",
  projectId: "supersej-30a36",
  storageBucket: "supersej-30a36.appspot.com",
  messagingSenderId: "267789538081",
  appId: "1:267789538081:web:3d3002fc1f921bdefbe460",
  measurementId: "G-JSGNXV8V90"
};

// Initialize Firebase
if (getApps().length < 1) {
  initializeApp(firebaseConfig);
}

const auth = getAuth();

function onAuthStateChange(callback) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      callback({ loggedIn: true, user: user });
      console.log("You are logged in!");
    } else {
      // User is signed out
      callback({ loggedIn: false });
    }
  });
}

export const forecasting = () => {
  return (
    <View>
      <ForecastingScreen />
    </View>
  );
};

// Create a BottomTabNavigator
const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState({ loggedIn: false });
  
  useEffect(() => {
    const unsubscribe = onAuthStateChange(setUser);
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "blue",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: [
            {
              display: "flex",
            },
            null,
          ],
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'Profile') {
              return (
                <Ionicons
                name='person-circle-outline'
                size={size}
                color={color}
            />
                );
              } else if (route.name === 'Forecast') {
                return (
                  <Ionicons
                      name='trending-up-outline'
                      size={size}
                      color={color}
                  />
                );
              } else if (route.name === 'Exchange rates') {
                return (
                  <Ionicons
                      name='stats-chart-outline'
                      size={size}
                      color={color}
                  />
                );
              } else if (route.name === 'Currency Converter') {
                return (
                  <Ionicons
                      name='repeat-outline'
                      size={size}
                      color={color}
                  />
                );
              } else {
                return (
                  <Ionicons
                      name='people-circle-outline'
                      size={size}
                      color={color}
                  />
                );
              }
            },
          })}
      >
        {user.loggedIn ? (
          <>
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="Exchange rates" component={HomeScreen} />
            <Tab.Screen name="Forecast" component={SettingsScreen} />
            <Tab.Screen name="Currency Converter" component={StackNavigator} />
          </>
        ) : (
          <>
            <Tab.Screen name="Login" component={LoginForm} />
            <Tab.Screen name="Sign Up" component={SignUpForm} />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});


