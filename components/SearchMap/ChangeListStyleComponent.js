import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import PlaceSearch from 'react-native-placesearch';

export default class ChangeListStyleComponent extends Component {
  render() {
    return (
      <View style={{flex: 1, padding: 10}}>
        <PlaceSearch
          apikey="AIzaSyAmiZ700IrfiDzhqAh16fU9tHllkBsJWFQ"
          SelectedAddress={data => console.log(data)}
          country="IN"
          ChangList={true}
          CustomList={item => (
            <View style={styles.customListItem}>
              <Text style={styles.customListText}>{item.description}</Text>
            </View>
          )}
        />
        <Text>Change List Style Component</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  customListItem: {
    padding: 10,
    backgroundColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  customListText: {
    fontSize: 16,
  },
});
