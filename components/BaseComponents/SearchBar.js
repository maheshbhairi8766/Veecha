import React from 'react';
import {Dimensions, SafeAreaView, Text, TextInput, View} from 'react-native';
var {width, height} = Dimensions.get('window');
export default function SearchBar() {
  return (
    <SafeAreaView>
      <View
        style={{
          backgroundColor: 'gray',
          padding: 4,
          height: 30,
          marginTop: height * -0.002,
        }}>
        <TextInput
          placeholder="Name of the Brand"
          placeholderTextColor="gray"
          style={{borderWidth: 0.5, borderRadius: 30, backgroundColor: 'white'}}
        />
      </View>
    </SafeAreaView>
  );
}
