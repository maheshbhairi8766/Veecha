import React, {useContext, useEffect, useState} from 'react';
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
import ShopContext from '../../context/ShopContext';

export default function AddVendor() {
  const navigation = useNavigation();
  const {userId} = useContext(ShopContext);
  const [shops, setShops] = useState([]);
  const [shopDetails, setShopDetails] = useState({
    address: '',
    phone: '',
    latitude: '',
    longitude: '',
    is_active: 'True',
    pincode: '',
    start_time: '',
    end_time: '',
    //business_started_on: '',
    //business_end_on: '',
    name: '',
    alt_phone: '',
    created_by: '',
    //updated_by: 'particular_id',
    owner_id: '',
    //owner_2_id: '',
  });

  useEffect(() => {
    fetchShops();
  }, []);

  async function fetchShops() {
    const {data} = await supabase.from('shop').select('*');
    setShops(data);
    //console.log(data);
  }

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
  async function createUser() {
    const {error} = await supabase.from('supplier_locations').insert([
      {
        name: shopDetails.name,
        address: shopDetails.address,
        phone: shopDetails.phone,
        latitude: shopDetails.latitude,
        longitude: shopDetails.longitude,
        pincode: shopDetails.pincode,
        start_time: shopDetails.start_time,
        end_time: shopDetails.end_time,
        alt_phone: shopDetails.alt_phone,
        //business_started_on: shopDetails.business_started_on,
        //business_end_on: shopDetails.business_end_on,
        //updated_by: shopDetails.updated_by,
        created_by: userId.id_user,
        owner_id: userId.id_user,
      },
    ]);
    if (error) {
      console.log('Error hey yaha', error.message);
    } else {
      console.log('ManuFact Shop registered successfully');
      navigation.navigate(Routes.Home);
    }
  }

  return (
    <ScrollView>
      <SafeAreaView style={{backgroundColor: '#8ed1fc'}}>
        <View style={{marginTop: 50}}>
          <View style={{marginTop: 20}}>
            <Text style={RegiserShopStyle.title}> Shop Identity</Text>
            <TextInput
              value={shopDetails.name}
              style={RegiserShopStyle.inputBox}
              placeholderTextColor={'white'}
              placeholder="Shop name"
              onChangeText={text => handleChange('name', text)}
              required
            />
            <TextInput
              style={RegiserShopStyle.inputBox}
              placeholder="Phone No"
              placeholderTextColor={'white'}
              onChangeText={text => handleChange('phone', text)}
            />
            <TextInput
              style={RegiserShopStyle.inputBox}
              placeholder="Alternative Phone no"
              placeholderTextColor={'white'}
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
              style={RegiserShopStyle.inputBox}
              placeholder="address"
              placeholderTextColor={'white'}
              onChangeText={text => handleChange('address', text)}
            />
            <TextInput
              style={RegiserShopStyle.inputBox}
              placeholder="pincode"
              placeholderTextColor={'white'}
              onChangeText={text => handleChange('pincode', text)}
            />
          </View>
          <View style={{marginTop: 20}}>
            <Text style={RegiserShopStyle.title}>Your Shop Hours ?</Text>
            <TextInput
              style={RegiserShopStyle.inputBox}
              placeholder="Start-Time"
              placeholderTextColor={'white'}
              onChangeText={text => handleChange('start_time', text)}
            />
            <TextInput
              style={RegiserShopStyle.inputBox}
              placeholder="End-Time"
              placeholderTextColor={'white'}
              onChangeText={text => handleChange('end_time', text)}
            />
          </View>

          <TouchableOpacity
            onPress={createUser}
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
              Register Shop
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
