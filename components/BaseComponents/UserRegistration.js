import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Alert,
  Button,
  Image,
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
import {PermissionsAndroid} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

export default function UserRegistration() {
  const [media, setMedia] = useState(null);
  const navigation = useNavigation();
  const [res, setRes] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
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
    const imageUrl = await afterAddingItems();

    if (!imageUrl) {
      Alert.alert('Error', 'Failed to upload image');
      return;
    }

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
        image_path: imageUrl,
        alt_phone: userDetails.alt_phone,
        password: userDetails.password,
        confirm_password: userDetails.confirm_password,
      },
    ]);

    if (error) {
      console.log('Error:', error.message);
    } else {
      console.log('Registered successfully');
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
    console.log('Current Location:', position.coords.longitude);
    setUserDetails(prevFormData => ({
      ...prevFormData,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    }));
  }

  function failToGetLocation() {
    console.log('Error while getting location');
    Alert.alert('Location Error', 'Failed to get your location.');
  }

  async function requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted;
    } catch (err) {
      console.warn(err);
      return null;
    }
  }

  function getLocation() {
    requestLocationPermission().then(granted => {
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(gotLocation, failToGetLocation, {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000,
        });
      } else {
        console.log('Location permission denied');
        Alert.alert('Permission Denied', 'Location permission was denied.');
      }
    });
  }

  const handleChoosePhoto = async () => {
    const options = {mediaType: 'photo'};
    try {
      const response = await launchImageLibrary(options);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error:', response.error);
      } else if (response.assets && response.assets.length > 0) {
        console.log(response);
        setRes(response);
        setMedia({uri: response.assets[0].uri}); // Display image immediately
      }
    } catch (error) {
      console.error('Error choosing photo:', error);
    }
  };

  const uploadToSupabase = async file => {
    const fileUri = file.uri;
    const fileName = fileUri.split('/').pop();

    try {
      const {data, error} = await supabase.storage
        .from('images')
        .upload(fileName, {
          uri: fileUri,
          name: fileName,
          type: file.type,
        });

      if (error) {
        console.log('Error uploading image:', error);
        return null;
      }

      const {data: publicUrlData, error: publicUrlError} =
        await supabase.storage.from('images').getPublicUrl(fileName);

      if (publicUrlError) {
        console.error('Error getting public URL:', publicUrlError);
        return null;
      }

      const imageUrl = publicUrlData.publicUrl;
      console.log('Public URL:', imageUrl);

      setImageUrl(imageUrl);
      return imageUrl; // Return the URL after successful upload
    } catch (error) {
      console.error('Unexpected error:', error);
      return null;
    }
  };

  const afterAddingItems = async () => {
    if (res.assets && res.assets.length > 0) {
      const uploadResult = await uploadToSupabase(res.assets[0]);

      if (uploadResult) {
        Alert.alert('Upload Successful', 'Your file has been uploaded.');
        return uploadResult; // Return the URL after successful upload
      } else {
        Alert.alert('Upload Failed', 'There was an error uploading your file.');
        return null;
      }
    } else {
      Alert.alert('Error', 'No image selected.');
      return null;
    }
  };

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
        <View
          style={{
            marginTop: 50,
            marginHorizontal: 'auto',
          }}>
          {media && (
            <Image
              source={media}
              style={{width: 150, height: 150, borderRadius: 100}}
            />
          )}
          <Button title="Profile Photo" onPress={handleChoosePhoto} />
        </View>
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
              <TouchableOpacity onPress={getLocation}>
                <Text>Current Location</Text>
              </TouchableOpacity>
            </View>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <PlusCircleIcon size={20} color="black" />
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(Routes.PlaceSearchComponent)
                }>
                <Text>Search Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TextInput
          placeholder="Pincode"
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
          placeholder="Alternate Phone Number"
          placeholderTextColor={'white'}
          style={{
            borderBottomWidth: 0.5,
            fontSize: 16,
            marginLeft: 35,
            marginRight: 35,
            borderColor: 'white',
            marginBottom: 5,
          }}
          onChangeText={text => handleChange('alt_phone', text)}
        />
        <TextInput
          placeholder="Password"
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
          placeholder="Confirm Password"
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
            backgroundColor: 'white',
            marginHorizontal: 'auto',
            marginTop: 30,
            marginBottom: 40,
            padding: 10,
            borderRadius: 8,
          }}>
          <Text style={{color: '#8ed1fc', fontSize: 16}}>Register</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
