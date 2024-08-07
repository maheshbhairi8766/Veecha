import {DrawerContentScrollView} from '@react-navigation/drawer';
import React from 'react';
import {Image, SafeAreaView, View} from 'react-native';

export default function DrawerProfile() {
  return (
    <View style={{flex: 1, position: 'absolute'}}>
      <DrawerContentScrollView>
        <Image source={require('../../assets/Images/shirt2.jpg')} />
      </DrawerContentScrollView>
    </View>
  );
}
