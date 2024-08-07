import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ArrowLeftIcon,
  Bars3CenterLeftIcon,
  BellIcon,
  BookmarkIcon,
  ShoppingCartIcon,
  UserIcon,
} from 'react-native-heroicons/solid';
var {width, height} = Dimensions.get('window');
export default function Header() {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Bars3CenterLeftIcon
            color="black"
            size={24}
            style={{marginLeft: 10, marginTop: 8}}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require('../../assets/Images/veechaLogo.jpeg')}
            style={{
              width: width * 0.3,
              height: height * 0.05,
              overflow: 'hidden',
              marginLeft: -100,
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            margin: 15,
          }}>
          <BellIcon
            style={{
              backgroundColor: 'gray',
              borderRadius: 20,
              margin: 5,
            }}
            color="black"
            size={20}
          />
          <ShoppingCartIcon
            style={{
              backgroundColor: 'gray',
              borderRadius: 20,
              margin: 5,
            }}
            size={20}
            color="black"
          />
          <BookmarkIcon
            style={{backgroundColor: 'gray', borderRadius: 20, margin: 5}}
            size={20}
            color="black"
          />
          <UserIcon
            style={{backgroundColor: 'gray', borderRadius: 20, margin: 5}}
            size={20}
            color="black"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
