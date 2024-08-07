import React, {useContext} from 'react';
import {SafeAreaView, Text, TouchableOpacity} from 'react-native';
import ShopContext from '../../context/ShopContext';
import {ProfileStyle} from '../styles/ProfileStyle';
import {useNavigation} from '@react-navigation/native';
import {Routes} from '../../navigation/Routes';

export default function ShopAccountScreen() {
  const {shopId} = useContext(ShopContext);
  const navigation = useNavigation();
  //console.log(shopId);
  return (
    <SafeAreaView>
      <Text>Account Here {shopId ? shopId.id_shop : ''}</Text>
      <TouchableOpacity style={ProfileStyle.box}>
        <Text style={{color: 'black', fontSize: 15}}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={ProfileStyle.box}
        onPress={() => navigation.navigate(Routes.AccountProducts)}>
        <Text style={{color: 'black', fontSize: 15}}>Products</Text>
      </TouchableOpacity>
      <TouchableOpacity style={ProfileStyle.box}>
        <Text style={{color: 'black', fontSize: 15}}>WatchList</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
