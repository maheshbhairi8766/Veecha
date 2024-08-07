/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView, Text} from 'react-native';
import MainNavigation from './navigation/MainNavigation';
import ShopContextProvider from './context/ShopContextProvider';

function App() {
  return (
    <ShopContextProvider>
      <NavigationContainer>
        <MainNavigation />
      </NavigationContainer>
    </ShopContextProvider>
  );
}

export default App;
