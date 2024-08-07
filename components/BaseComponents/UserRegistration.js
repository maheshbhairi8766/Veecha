import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {supabase} from '../../createClinet';
import {Routes} from '../../navigation/Routes';
import {MapPinIcon} from 'react-native-heroicons/solid';
import {PlusCircleIcon} from 'react-native-heroicons/outline';
import Geolocation from '@react-native-community/geolocation';

export default function UserRegistration() {
  const navigation = useNavigation();
  const [user, setUser] = useState([]);
  const [userDetails, setUserDetails] = useState({
    name: '',
    phone: '',
    email: '',
    date_of_birth: '',
    marital_status: '',
    location: '',
    latitude: '',
    longitude: '',
    pincode: '',
    image_path: '',
    alt_phone: '',
    password: '',
    confirm_password: '',
  });
  async function createUser() {
    const {error} = await supabase.from('users').insert([
      {
        name: userDetails.name,
        phone: userDetails.phone,
        email: userDetails.email,
        date_of_birth: userDetails.date_of_birth,
        marital_status: userDetails.marital_status,
        location: userDetails.location,
        latitude: userDetails.latitude,
        longitude: userDetails.longitude,
        pincode: userDetails.pincode,
        image_path: userDetails.image_path,
        alt_phone: userDetails.alt_phone,
        password: userDetails.password,
        confirm_password: userDetails.confirm_password,
      },
    ]);
    if (error) {
      console.log('Error hey yaha', error.message);
    } else {
      console.log('registered successfully');
      navigation.navigate(Routes.Login);
    }
  }
  function handleChange(name, value) {
    setUserDetails(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  }
  function gotLocation(position) {
    console.log('My Current Location Vendor ', position.coords.longitude);
    setUserDetails(prevFormData => ({
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
  return (
    <SafeAreaView style={{backgroundColor: '#8ed1fc'}}>
      <ScrollView>
        <Text
          style={{
            marginTop: 20,
            marginHorizontal: 'auto',
            color: 'black',
            fontSize: 20,
            fontFamily: 'bold',
          }}>
          Registration
        </Text>
        <TextInput
          placeholder="Name"
          placeholderTextColor={'white'}
          style={{
            borderBottomWidth: 0.5,
            fontSize: 16,
            marginLeft: 35,
            marginRight: 35,
            borderColor: 'white',
            marginBottom: 5,
          }}
          onChangeText={text => handleChange('name', text)}
        />
        <TextInput
          placeholder="phone"
          placeholderTextColor={'white'}
          style={{
            borderBottomWidth: 0.5,
            fontSize: 16,
            marginLeft: 35,
            marginRight: 35,
            borderColor: 'white',
            marginBottom: 5,
          }}
          onChangeText={text => handleChange('phone', text)}
        />
        <TextInput
          placeholder="email"
          placeholderTextColor={'white'}
          style={{
            borderBottomWidth: 0.5,
            fontSize: 16,
            marginLeft: 35,
            marginRight: 35,
            borderColor: 'white',
            marginBottom: 5,
          }}
          onChangeText={text => handleChange('email', text)}
        />
        <TextInput
          placeholder="DateOfBirth"
          placeholderTextColor={'white'}
          style={{
            borderBottomWidth: 0.5,
            fontSize: 16,
            marginLeft: 35,
            marginRight: 35,
            borderColor: 'white',
            marginBottom: 5,
          }}
          onChangeText={text => handleChange('date_of_birth', text)}
        />
        <TextInput
          placeholder="Marital Status"
          placeholderTextColor={'white'}
          style={{
            borderBottomWidth: 0.5,
            fontSize: 16,
            marginLeft: 35,
            marginRight: 35,
            borderColor: 'white',
            marginBottom: 5,
          }}
          onChangeText={text => handleChange('marital_status', text)}
        />
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate(Routes.PlaceSearchComponent)}>
            <Text>Search Location</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginLeft: 35, marginTop: 5}}>
          <Text style={{color: 'white'}}>Location</Text>
          <View>
            <View
              style={{display: 'flex', flexDirection: 'row', marginBottom: 3}}>
              <MapPinIcon size={20} color="black" />
              <TouchableOpacity>
                <Text>Current Location</Text>
              </TouchableOpacity>
            </View>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <PlusCircleIcon size={20} color="black" />
              <TouchableOpacity onPress={getLocation}>
                <Text>Add Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TextInput
          placeholder="Location"
          placeholderTextColor={'white'}
          style={{
            borderBottomWidth: 0.5,
            fontSize: 16,
            marginLeft: 35,
            marginRight: 35,
            borderColor: 'white',
            marginBottom: 5,
          }}
          onChangeText={text => handleChange('location', text)}
        />
        <TextInput
          placeholder="pincode"
          placeholderTextColor={'white'}
          style={{
            borderBottomWidth: 0.5,
            fontSize: 16,
            marginLeft: 35,
            marginRight: 35,
            borderColor: 'white',
            marginBottom: 5,
          }}
          onChangeText={text => handleChange('pincode', text)}
        />
        <TextInput
          placeholder="image"
          placeholderTextColor={'white'}
          style={{
            borderBottomWidth: 0.5,
            fontSize: 16,
            marginLeft: 35,
            marginRight: 35,
            borderColor: 'white',
            marginBottom: 5,
          }}
          onChangeText={text => handleChange('image_path', text)}
        />
        <TextInput
          placeholder="password"
          placeholderTextColor={'white'}
          style={{
            borderBottomWidth: 0.5,
            fontSize: 16,
            marginLeft: 35,
            marginRight: 35,
            borderColor: 'white',
            marginBottom: 5,
          }}
          onChangeText={text => handleChange('password', text)}
        />
        <TextInput
          placeholder="confirm password"
          placeholderTextColor={'white'}
          style={{
            borderBottomWidth: 0.5,
            fontSize: 16,
            marginLeft: 35,
            marginRight: 35,
            borderColor: 'white',
            marginBottom: 5,
          }}
          onChangeText={text => handleChange('confirm_password', text)}
        />
        <TouchableOpacity
          onPress={createUser}
          style={{
            backgroundColor: '#0d47a1',
            marginTop: 20,
            height: 40,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: 'white',
            marginLeft: 30,
            marginRight: 30,
            marginBottom: 131,
          }}>
          <Text
            style={{
              color: 'white',
              marginHorizontal: 'auto',
              fontSize: 20,
              fontFamily: 'bold',
            }}>
            Register
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
