import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ShopContext from '../../context/ShopContext';
import {supabase} from '../../createClinet';
import {useNavigation} from '@react-navigation/native';
import {Routes} from '../../navigation/Routes';

var {width, height} = Dimensions.get('window');
export default function MyVendorCardView() {
  const {userId} = useContext(ShopContext);
  const [myShops, setMyShops] = useState([]);
  const navigation = useNavigation();
  const fetchMyShops = async () => {
    if (userId && userId.id_user) {
      const {data, error} = await supabase
        .from('supplier_locations')
        .select('*')
        .eq('owner_id', userId.id_user);

      if (error) {
        console.error('Error fetching user data:', error.message);
      } else {
        setMyShops(data);
        console.log(myShops);
      }
    } else {
      console.log('User ID is undefined');
    }
  };
  useEffect(
    () => {
      fetchMyShops();
    },
    [userId],
    [myShops],
  );
  return (
    <SafeAreaView>
      <Text>Hello</Text>
      {myShops.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate(Routes.ShopView, item)}>
            <View
              style={{
                borderWidth: 0.5,
                display: 'flex',
                flexDirection: 'row',
                borderRadius: 20,
                backgroundColor: 'white',
                marginBottom: 10,
                paddingTop: 10,
                paddingBottom: 10,
                marginLeft: 10,
                marginRight: 10,
              }}>
              <Image
                source={require('../../assets/Images/shop.jpg')}
                style={{
                  height: height * 0.1,
                  width: width * 0.3,
                  marginLeft: 10,
                }}
              />
              <View style={{marginLeft: 10}}>
                <Text
                  style={{color: '#8ed1fc', fontSize: 22, fontFamily: 'bold'}}>
                  {item.name}
                </Text>
                <Text
                  style={{color: '#8ed1fc', fontSize: 15, fontFamily: 'bold'}}>
                  {item.phone}
                </Text>
                <Text
                  style={{color: '#8ed1fc', fontSize: 15, fontFamily: 'bold'}}>
                  {item.address}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </SafeAreaView>
  );
}
