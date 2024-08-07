import React, {Component} from 'react';
import {View, Text} from 'react-native';
import PlaceSearch from 'react-native-placesearch';

export default class SearchAgainstAreaComponent extends Component {
  render() {
    return (
      <View style={{flex: 1, padding: 10}}>
        <PlaceSearch
          apikey="AIzaSyAmiZ700IrfiDzhqAh16fU9tHllkBsJWFQ"
          SelectedAddress={data => console.log(data)}
          country="IN"
          area={true}
          lat="22.5726"
          lng="88.3639"
          radius="500" // in meters
        />
        <Text>Search Against Area Component</Text>
      </View>
    );
  }
}
