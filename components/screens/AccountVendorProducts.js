import React from 'react';
import {SafeAreaView, Text, TouchableOpacity} from 'react-native';
import {Routes} from '../../navigation/Routes';
import {useNavigation} from '@react-navigation/native';
import {PlusCircleIcon} from 'react-native-heroicons/solid';
import VendorProductsCardView from '../BaseComponents/VendorProductsCardView';

export default function AccountVendorProducts() {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <Text>Hello</Text>
      <VendorProductsCardView />
      <TouchableOpacity
        onPress={() => navigation.navigate(Routes.AddProductsByVendor)}
        style={{position: 'absolute', marginTop: 700, marginLeft: 330}}>
        <PlusCircleIcon color="blue" size={50} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
