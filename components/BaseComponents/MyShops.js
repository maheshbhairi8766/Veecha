import React from 'react';
import {SafeAreaView, ScrollView, Text} from 'react-native';
import MyShopsCardView from './MyShopsCardView';
import Header from './Header';
import SearchBar from './SearchBar';

export default function MyShops() {
  return (
    <SafeAreaView style={{backgroundColor: 'white'}}>
      <Header />
      <SearchBar />
      <ScrollView>
        <MyShopsCardView />
      </ScrollView>
    </SafeAreaView>
  );
}
