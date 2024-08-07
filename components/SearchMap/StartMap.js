import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import Map from './Map';

const StartMap = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1}}>
        <Map />
      </SafeAreaView>
    </>
  );
};

export default StartMap;
