import React, {useContext, useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {RegisterStyle} from '../styles/RegisterStyle';
import {SocialIcon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {Routes} from '../../navigation/Routes';
import {supabase} from '../../createClinet';
import ShopContext from '../../context/ShopContext';

export default function Login() {
  const {setShopId} = useContext(ShopContext);
  const {setVendorId} = useContext(ShopContext);
  const {userId} = useContext(ShopContext);
  const {setUserId} = useContext(ShopContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  async function handleLogin(mail, pass) {
    try {
      // Check for vendor
      const {data: dataVendor, error: errorVendor} = await supabase
        .from('users')
        .select('*')
        .eq('phone', mail)
        .eq('password', pass);

      if (errorVendor) {
        throw new Error(errorVendor.message);
      }

      if (dataVendor && dataVendor.length > 0) {
        console.log('User Login successful');
        console.log('What is inside the data :', dataVendor[0].id);
        const id_user = dataVendor[0].id;
        setUserId({id_user});
        console.log(userId.id_user);
        navigation.navigate(Routes.Home);
        return;
      }

      // Check for shop if vendor not found
      const {data, error} = await supabase
        .from('shops')
        .select('*')
        .eq('phone', mail)
        .eq('password', pass);

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.length > 0) {
        console.log('Shop Login successful');
        console.log('What is inside the data :', data[0].id);
        const id_shop = data[0].id;
        setShopId({id_shop});
        navigation.navigate(Routes.Home);
        return;
      }

      console.log('Email or password is incorrect');
    } catch (err) {
      console.error('Login Error:', err.message);
    }
  }

  return (
    <View style={RegisterStyle.body}>
      <Text style={RegisterStyle.signin}>Sign-In</Text>
      <Text style={RegisterStyle.text}>
        Please enter the email and password
      </Text>
      <Text style={RegisterStyle.text}>Register with your account</Text>
      <TextInput
        value={email}
        onChangeText={text => setEmail(text)}
        style={RegisterStyle.email}
        placeholder="Id"
      />
      <TextInput
        value={password}
        onChangeText={text => setPassword(text)}
        style={RegisterStyle.pass}
        placeholder="Password"
        secureTextEntry
      />
      <TouchableOpacity
        style={RegisterStyle.Signinbutton}
        onPress={() => handleLogin(email, password)}>
        <Text style={RegisterStyle.Signinbuttontext}>SIGN IN</Text>
      </TouchableOpacity>

      <Text style={RegisterStyle.new}>New on Veecha?</Text>
      <TouchableOpacity
        style={RegisterStyle.create}
        onPress={() => navigation.navigate(Routes.UserRegistration)}>
        <Text style={RegisterStyle.createacc}>Create an account</Text>
      </TouchableOpacity>
    </View>
  );
}
