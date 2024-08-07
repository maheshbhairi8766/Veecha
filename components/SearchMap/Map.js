import React from 'react';
import {SafeAreaView, FlatList, View, Text, StyleSheet} from 'react-native';
import PlaceSearchComponent from './PlaceSearchComponent';

const components = [
  {key: 'placeSearch', component: <PlaceSearchComponent />},
  // Add other components as needed
];

export default function Map() {
  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>{item.component}</View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={components}
        renderItem={renderItem}
        keyExtractor={item => item.key}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  itemContainer: {
    flex: 1,
    padding: 10,
  },
});
