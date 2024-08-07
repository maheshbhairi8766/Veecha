import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {RegiserShopStyle} from '../styles/RegisterShopStyle';
import {supabase} from '../../createClinet';
import {useNavigation} from '@react-navigation/native';
import {Routes} from '../../navigation/Routes';
import Geolocation from '@react-native-community/geolocation';

export default function RegisterVendor() {
  const navigation = useNavigation();
  const [shops, setShops] = useState([]);
  const [shopDetails, setShopDetails] = useState({
    address: '',
    phone: '',
    latitude: '',
    longitude: '',
    alt_phone: '',
    is_active: 'True',
    pincode: '',
    start_time: '',
    end_time: '',
    brand_attribute_value_id: '5',
    //created_by: 'bdbc4314-bda8-4ce-bb28-e6acc8b5a321',
    //updated_by: 'bdbc4314-bda8-4ce-bb28-e6acc8b5a321',
    profile_type_id: '1',
    //owner_id: '1',
    //owner_2_id: '1',
    password: '',
    confirm_password: '',
  });

  function handleChange(name, value) {
    setShopDetails(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  }
  function gotLocation(position) {
    console.log('My Current Location Vendor ', position.coords.longitude);
    setShopDetails(prevFormData => ({
      ...prevFormData,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    }));
  }
  function failToGetLocation() {
    console.log('Error while getting location');
  }
  function getLocation() {
    console.log('Getting location...');
    Geolocation.getCurrentPosition(gotLocation, failToGetLocation);
  }

  async function createVendor() {
    const {error} = await supabase.from('supplier_locations').insert([
      {
        address: shopDetails.address,
        pincode: shopDetails.pincode,
        latitude: shopDetails.latitude,
        longitude: shopDetails.longitude,
        is_active: shopDetails.is_active,
        brand_attribute_value_id: shopDetails.brand_attribute_value_id,
        //created_by: shopDetails.created_by,
        //updated_by: shopDetails.updated_by,
        phone: shopDetails.phone,
        alt_phone: shopDetails.alt_phone,
        start_time: shopDetails.start_time,
        end_time: shopDetails.end_time,
        //owner_id: shopDetails.owner_id,
        //owner_2_id: shopDetails.owner_2_id,
        password: shopDetails.password,
        confirm_password: shopDetails.confirm_password,
      },
    ]);
    if (error) {
      console.log('Error undi ', error.message);
    } else {
      console.log('Vendor registered successfully');
      navigation.navigate(Routes.Login);
    }
  }

  return (
    <ScrollView>
      <SafeAreaView>
        <View style={{marginTop: 50}}>
          <View style={{marginTop: 20}}>
            <Text style={RegiserShopStyle.title}> Shop Address</Text>

            <TextInput
              style={RegiserShopStyle.inputBox}
              placeholder="Phone No"
              onChangeText={text => handleChange('phone', text)}
            />
            <TextInput
              style={RegiserShopStyle.inputBox}
              placeholder="Alternative Phone no"
              onChangeText={text => handleChange('alt_phone', text)}
            />
          </View>
          <View style={{marginTop: 20}}>
            <Text style={RegiserShopStyle.title}>Your Shop Location ?</Text>
            <TouchableOpacity
              onPress={getLocation}
              style={{
                backgroundColor: '#abb8c3',
                marginTop: 30,
                marginLeft: 20,
                marginRight: 20,
                padding: 10,
                marginBottom: 30,
              }}>
              <Text
                style={{
                  marginHorizontal: 'auto',
                  fontSize: 17,
                  color: 'black',
                  fontWeight: 'bold',
                }}>
                Current Location
              </Text>
            </TouchableOpacity>
            <TextInput
              value={shopDetails.address}
              style={RegiserShopStyle.inputBox}
              placeholder="Vendor address"
              onChangeText={text => handleChange('address', text)}
              required
            />
            <TextInput
              style={RegiserShopStyle.inputBox}
              placeholder="pincode"
              onChangeText={text => handleChange('pincode', text)}
            />
          </View>
          <View style={{marginTop: 20}}>
            <Text style={RegiserShopStyle.title}>Your Shop Hours ?</Text>
            <TextInput
              style={RegiserShopStyle.inputBox}
              placeholder="Start-Time"
              onChangeText={text => handleChange('start_time', text)}
            />
            <TextInput
              style={RegiserShopStyle.inputBox}
              placeholder="End-Time"
              onChangeText={text => handleChange('end_time', text)}
            />
          </View>
          <View style={{marginTop: 20}}>
            <Text style={RegiserShopStyle.title}>Your Shop Credentials ?</Text>

            <TextInput
              style={RegiserShopStyle.inputBox}
              placeholder="password"
              secureTextEntry
              onChangeText={text => handleChange('password', text)}
            />
            <TextInput
              style={RegiserShopStyle.inputBox}
              placeholder="Confirm password"
              secureTextEntry
              onChangeText={text => handleChange('confirm_password', text)}
            />
          </View>

          <TouchableOpacity
            onPress={createVendor}
            style={{
              backgroundColor: '#abb8c3',
              marginTop: 30,
              marginLeft: 20,
              marginRight: 20,
              padding: 10,
              marginBottom: 30,
            }}>
            <Text
              style={{
                marginHorizontal: 'auto',
                fontSize: 17,
                color: 'black',
                fontWeight: 'bold',
              }}>
              Register Vendor
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
