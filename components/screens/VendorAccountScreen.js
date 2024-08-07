import React, {useContext} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import ShopContext from '../../context/ShopContext';
import {ProfileStyle} from '../styles/ProfileStyle';
import {Routes} from '../../navigation/Routes';
import {useNavigation} from '@react-navigation/native';

export default function VendorAccountScreen() {
  const {vendorId} = useContext(ShopContext);
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <Text>Vendor Account Screen {vendorId.id_vendor}</Text>
      <View>
        <TouchableOpacity style={ProfileStyle.box}>
          <Text style={{color: 'black', fontSize: 15}}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={ProfileStyle.box}
          onPress={() => navigation.navigate(Routes.AccountVendorProducts)}>
          <Text style={{color: 'black', fontSize: 15}}>Products</Text>
        </TouchableOpacity>
        <TouchableOpacity style={ProfileStyle.box}>
          <Text style={{color: 'black', fontSize: 15}}>WatchList</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
