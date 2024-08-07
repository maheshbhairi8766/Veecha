import React from 'react';
import {SafeAreaView, ScrollView, Text, TouchableOpacity} from 'react-native';
import MyProductsCardView from '../BaseComponents/MyProductsCardView';
import {PlusCircleIcon} from 'react-native-heroicons/solid';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Routes} from '../../navigation/Routes';
import Header from '../BaseComponents/Header';
import SearchBar from '../BaseComponents/SearchBar';
import ShopItemsCardView from '../Shops/ShopItemsCardView';
import VendorItemsCardView from './VendorItemsCardView';

export default function VendorView() {
  const route = useRoute();
  const item = route.params;
  const navigation = useNavigation();
  //console.log('Vendor View', item);
  return (
    <SafeAreaView>
      <Header />
      <SearchBar />

      <ScrollView style={{marginBottom: 60}}>
        <VendorItemsCardView data={item} />
      </ScrollView>

      <TouchableOpacity
        onPress={() => navigation.navigate(Routes.ShopAddingProducts, item)}
        style={{position: 'absolute', marginTop: 700, marginLeft: 330}}>
        <PlusCircleIcon color="blue" size={50} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
