import React from 'react';
import {SafeAreaView, ScrollView, Text} from 'react-native';
import InventoryCardView from '../BaseComponents/InventoryCardView';
import Header from '../BaseComponents/Header';
import SearchBar from '../BaseComponents/SearchBar';

export default function Inventory() {
  return (
    <SafeAreaView>
      <Header />
      <SearchBar />
      <ScrollView>
        <InventoryCardView />
      </ScrollView>
    </SafeAreaView>
  );
}
