import React from 'react';
import {SafeAreaView, ScrollView, Text, TouchableOpacity} from 'react-native';
import MyProductsCardView from '../BaseComponents/MyProductsCardView';
import {PlusCircleIcon} from 'react-native-heroicons/solid';
import {useNavigation} from '@react-navigation/native';
import {Routes} from '../../navigation/Routes';

export default function AccountProducts() {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <ScrollView>
        <Text>Products Page</Text>
        <MyProductsCardView />
      </ScrollView>
      <TouchableOpacity
        onPress={() => navigation.navigate(Routes.AddProductsByShop)}
        style={{position: 'absolute', marginTop: 700, marginLeft: 330}}>
        <PlusCircleIcon color="blue" size={50} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
