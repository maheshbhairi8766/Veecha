import React from 'react';
import {SafeAreaView, Text} from 'react-native';
import Header from './Header';
import SearchBar from './SearchBar';

export default function EditProfile() {
  return (
    <SafeAreaView>
      <Header />
      <SearchBar />
    </SafeAreaView>
  );
}
