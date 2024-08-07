import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {Routes} from '../../navigation/Routes';

export default function ModulesAsk() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{marginHorizontal: 'auto', marginTop: 150}}>
      <Text>Are you ?</Text>
      <View style={{marginTop: 10}}>
        <TouchableOpacity>
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 20}}>
            User
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate(Routes.RegisterShop)}>
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 20}}>
            Shop Owner
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate(Routes.RegisterVendor)}>
          <Text style={{color: 'black', fontWeight: 'bold', fontSize: 20}}>
            Vendor / manufacturer
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
