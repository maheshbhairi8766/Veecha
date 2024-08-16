import React, {useState} from 'react';
import {
  SafeAreaView,
  TextInput,
  Button,
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

const MapEnter = () => {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [region, setRegion] = useState(null);

  const fetchSuggestions = async text => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          text,
        )}&format=json&addressdetails=1&limit=5`,
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          address,
        )}&format=json&addressdetails=1&limit=1`,
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const {lat, lon} = data[0];
        setRegion({
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        });
      } else {
        alert('No results found');
      }
    } catch (error) {
      alert('Error fetching location');
    }
  };

  const handleSelectSuggestion = suggestion => {
    setAddress(suggestion.display_name);
    const {lat, lon} = suggestion;
    setRegion({
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    });
    setSuggestions([]); // Clear suggestions after selection
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter address"
        value={address}
        onChangeText={text => {
          setAddress(text);
          fetchSuggestions(text); // Fetch suggestions as user types
        }}
      />
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={item => item.place_id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.suggestion}
              onPress={() => handleSelectSuggestion(item)}>
              <Text>{item.display_name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <Button title="Search" onPress={handleSearch} />
      {region && (
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}>
          <Marker coordinate={region} />
        </MapView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  suggestion: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  map: {
    flex: 1,
  },
});

export default MapEnter;
