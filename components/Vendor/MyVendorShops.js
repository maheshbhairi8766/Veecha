import React from 'react';
import {SafeAreaView, ScrollView, Text} from 'react-native';
import Header from '../BaseComponents/Header';
import SearchBar from '../BaseComponents/SearchBar';
import MyVendorCardView from './MyVendorCardView';

export default function MyVendorShops() {
  return (
    <SafeAreaView>
      <Header />
      <SearchBar />
      <ScrollView>
        <MyVendorCardView />
      </ScrollView>
    </SafeAreaView>
  );
}
