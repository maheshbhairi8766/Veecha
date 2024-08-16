import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import MapView from 'react-native-maps';
export default function MapV() {
  return (
    <SafeAreaView SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
/*
{import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MapView from 'react-native-maps';
import {showLocation} from 'react-native-map-link';

showLocation({
  latitude: 38.8976763,
  longitude: -77.0387185,
  title: 'Your destination',
});
export default function MapEnter() {
  return <SafeAreaView />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
}
 */
