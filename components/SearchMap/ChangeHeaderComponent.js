import React, {Component} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import PlaceSearch from 'react-native-placesearch';

export default class ChangeHeaderComponent extends Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }

  KeyUp = () => {
    this.child.current.searchAddress();
  };

  chngText = data => {
    this.child.current.setAddress(data);
  };

  render() {
    return (
      <View style={{flex: 1, padding: 10}}>
        <PlaceSearch
          apikey="AIzaSyAmiZ700IrfiDzhqAh16fU9tHllkBsJWFQ"
          SelectedAddress={data => console.log(data)}
          country="IN"
          ref={this.child}
          Changeheader={true}
          CustomHeader={
            <View style={styles.header}>
              <TextInput
                style={styles.input}
                placeholder="Type here..."
                onChangeText={text => this.chngText(text)}
                onKeyPress={this.KeyUp}
              />
            </View>
          }
        />
        <Text>Change Header Component</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FF5733',
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
});
