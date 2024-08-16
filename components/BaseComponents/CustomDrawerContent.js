import React, {useContext, useEffect, useState} from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import ShopContext from '../../context/ShopContext';
import {supabase} from '../../createClinet';
import {useNavigation} from '@react-navigation/native';
import {Routes} from '../../navigation/Routes';
import {PencilSquareIcon} from 'react-native-heroicons/solid';
import {DummyImage} from './CardView';
var {width, height} = Dimensions.get('window');

function CustomDrawerContent(props) {
  const navigation = useNavigation();
  const {userId} = useContext(ShopContext);
  const [myShops, setMyShops] = useState([]);
  const [myVendorShops, setMyVendorShops] = useState([]);
  const [user, setUser] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
  });
  const fetchDataProducts = async () => {
    if (userId && userId.id_user) {
      const {data, error} = await supabase
        .from('users')
        .select('*')
        .eq('id', userId.id_user)
        .single();

      if (error) {
        console.error('Error fetching user data:', error.message);
      } else {
        setUser(data);
        console.log('User Data is here ', data);
      }
    } else {
      console.log('User ID is undefined');
    }
  };

  const fetchMyShops = async () => {
    if (userId && userId.id_user) {
      const {data, error} = await supabase
        .from('shops')
        .select('*')
        .eq('owner_id', userId.id_user);

      if (error) {
        console.error('Error fetching user data:', error.message);
      } else {
        setMyShops(data);
      }
    } else {
      console.log('User ID is undefined');
    }
  };
  const fetchMyVendorShops = async () => {
    if (userId && userId.id_user) {
      const {data, error} = await supabase
        .from('supplier_locations')
        .select('*')
        .eq('owner_id', userId.id_user);

      if (error) {
        console.error('Error fetching user data:', error.message);
      } else {
        setMyVendorShops(data);
      }
    } else {
      console.log('User ID is undefined');
    }
  };
  useEffect(() => {
    fetchDataProducts();
    fetchMyShops();
    fetchMyVendorShops();
  }, [userId]);

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.profileContainer}>
        <TouchableOpacity
          style={{marginLeft: 220, marginTop: -18}}
          onPress={() => navigation.navigate(Routes.EditProfile)}>
          <PencilSquareIcon color="black" size={20} />
        </TouchableOpacity>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <Image
            style={{
              marginTop: -6,
              marginLeft: -18,
              overflow: 'hidden',
              height: height * 0.13,
              width: width * 0.25,
              borderRadius: 50,
              borderWidth: 2,
              borderColor: 'white',
            }}
            source={{uri: user.image_path || DummyImage}}
          />
          <View style={{marginLeft: 5}}>
            <Text style={{fontSize: 19, color: 'white', fontFamily: 'bold'}}>
              {user.name || 'N/A'}
            </Text>
            <Text style={{fontSize: 14, color: 'white', fontFamily: 'bold'}}>
              {user.phone || 'N/A'}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: 'white',
                fontFamily: 'bold',
              }}>
              {user.email || 'N/A'}
            </Text>
            <Text style={{fontSize: 14, color: 'white', fontFamily: 'bold'}}>
              {user.location || 'N/A'}
            </Text>
          </View>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: 10,
          }}>
          <View style={{alignItems: 'center'}}>
            <Text style={{fontSize: 19, color: 'white', fontFamily: 'bold'}}>
              {myShops.length || '0'}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(Routes.MyShops)}>
              <Text style={{color: 'black', fontFamily: 'bold'}}>My Shops</Text>
            </TouchableOpacity>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={{fontSize: 19, color: 'white', fontFamily: 'bold'}}>
              {myVendorShops.length || '0'}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(Routes.MyVendorShops)}>
              <Text style={{color: 'black', fontFamily: 'bold'}}>
                Manufact Shops
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    marginTop: -5,
    padding: 20,
    backgroundColor: '#8ed1fc',
  },
  profileText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CustomDrawerContent;
