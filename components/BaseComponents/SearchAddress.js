import React, {Component} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import PlaceSearch from 'react-native-placesearch'; // Ensure this is the correct import
import ChangeHeaderComponent from '../SearchMap/ChangeHeaderComponent';
import ChangeListStyleComponent from '../SearchMap/ChangeListStyleComponent';
import SearchAgainstAreaComponent from '../SearchMap/SearchAgainstAreaComponent';

export default class PlaceSearchComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView>
          <PlaceSearchComponent />
          <ChangeHeaderComponent />
          <ChangeListStyleComponent />
          <SearchAgainstAreaComponent />
        </ScrollView>
      </View>
    );
  }
}
