import React from 'react';
import {SafeAreaView, ScrollView, Text, TouchableOpacity} from 'react-native';
import MyProductsCardView from '../BaseComponents/MyProductsCardView';
import {PlusCircleIcon} from 'react-native-heroicons/solid';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Routes} from '../../navigation/Routes';
import Header from '../BaseComponents/Header';
import SearchBar from '../BaseComponents/SearchBar';
import ShopItemsCardView from '../Shops/ShopItemsCardView';

export default function ShopView() {
  const route = useRoute();
  const item = route.params;
  const navigation = useNavigation();
  console.log('Shop View', item);
  return (
    <SafeAreaView>
      <Header />
      <SearchBar />

      <ScrollView style={{marginBottom: 60}}>
        <ShopItemsCardView data={item} />
      </ScrollView>

      <TouchableOpacity
        onPress={() => navigation.navigate(Routes.ShopAddItem, item)}
        style={{position: 'absolute', marginTop: 700, marginLeft: 330}}>
        <PlusCircleIcon color="blue" size={50} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
