import React, {useContext} from 'react';
import {SafeAreaView, Text, TouchableOpacity} from 'react-native';
import ShopContext from '../../context/ShopContext';
import {ProfileStyle} from '../styles/ProfileStyle';
import {useNavigation} from '@react-navigation/native';
import {Routes} from '../../navigation/Routes';
import ShopAccountScreen from './ShopAccountScreen';
import VendorAccountScreen from './VendorAccountScreen';

export default function Account() {
  const {shopId} = useContext(ShopContext);
  const {vendorId} = useContext(ShopContext);
  const navigation = useNavigation();
  console.log('S id', shopId);
  console.log('V id', vendorId);
  return (
    <SafeAreaView>
      {shopId !== null ? (
        <ShopAccountScreen />
      ) : vendorId !== null ? (
        <VendorAccountScreen />
      ) : (
        <Text>Login First</Text>
      )}
    </SafeAreaView>
  );
}
