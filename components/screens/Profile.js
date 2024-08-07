import React, {useContext, useEffect, useState} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import SearchStyle from '../styles/SearchStyle';
import DropShadow from 'react-native-drop-shadow';
import {useNavigation} from '@react-navigation/native';
import {Routes} from '../../navigation/Routes';
import ShopContext from '../../context/ShopContext';

export default function Profile() {
  /*  const [loggedIn, setLoggedIn] = useState(false);
  const {shopId} = useContext(ShopContext);
  const navigation = useNavigation();
  const {vendorId} = useContext(ShopContext);

  {
  <SafeAreaView>
  {loggedIn ? (
    <View>
      <Text>Logged Person</Text>
      <TouchableOpacity onPress={handleLogout}>
        <Text style={{color: 'black', fontFamily: 'bold', fontSize: 24}}>
          LogOut
        </Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View>
      <DropShadow
        style={{
          shadowColor: 'black',
          shadowOpacity: 5,
          shadowRadius: 10,
          position: 'absolute',
          marginLeft: 72,
          shadowOffset: {width: 1, height: 5},
        }}>
        <Image
          style={SearchStyle.img}
          source={require('../../assets/Images/NoResults.jpg')}
        />
      </DropShadow>
      <View style={{marginHorizontal: 'auto', marginTop: 300}}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: 'bold',
            marginHorizontal: 'auto',
          }}>
          Not Logged Yet ?
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate(Routes.Login)}
          style={{
            marginHorizontal: 'auto',
            marginTop: 10,
            borderWidth: 0.5,
            paddingLeft: 65,
            paddingRight: 65,
            paddingTop: 3,
            paddingBottom: 3,
            backgroundColor: '#abb8c3',
          }}>
          <Text style={{color: 'black', fontWeight: 'bold'}}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{marginTop: 10, marginLeft: 60}}>
          <Text style={{color: 'black'}}> New to Veecha ?</Text>
        </TouchableOpacity>
      </View>
    </View>
  )}
</SafeAreaView>
}
*/

  const {shopId, vendorId, setShopId, setVendorId} = useContext(ShopContext);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigation = useNavigation();

  const handleLogout = () => {
    setShopId(null);
    setVendorId(null);
    setLoggedIn(false);
    navigation.navigate(Routes.Login); // Navigate to the login screen
  };

  useEffect(() => {
    setLoggedIn(shopId !== null || vendorId !== null); // Update loggedIn state based on shopId or vendorId
  }, [shopId, vendorId]);

  return (
    <SafeAreaView>
      {loggedIn ? (
        <View>
          <Text>Logged Person</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={{color: 'black', fontFamily: 'bold', fontSize: 24}}>
              LogOut
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <DropShadow
            style={{
              shadowColor: 'black',
              shadowOpacity: 5,
              shadowRadius: 10,
              position: 'absolute',
              marginLeft: 72,
              shadowOffset: {width: 1, height: 5},
            }}>
            <Image
              style={SearchStyle.img}
              source={require('../../assets/Images/NoResults.jpg')}
            />
          </DropShadow>
          <View style={{marginHorizontal: 'auto', marginTop: 300}}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: 'bold',
                marginHorizontal: 'auto',
              }}>
              Not Logged Yet ?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(Routes.Login)}
              style={{
                marginHorizontal: 'auto',
                marginTop: 10,
                borderWidth: 0.5,
                paddingLeft: 65,
                paddingRight: 65,
                paddingTop: 3,
                paddingBottom: 3,
                backgroundColor: '#abb8c3',
              }}>
              <Text style={{color: 'black', fontWeight: 'bold'}}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{marginTop: 10, marginLeft: 60}}>
              <Text style={{color: 'black'}}> New to Veecha ?</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
