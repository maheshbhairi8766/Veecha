import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BellIcon,
  BookmarkIcon,
  ChartBarIcon,
  MapIcon,
  MapPinIcon,
  ShoppingCartIcon,
  StarIcon,
  UserIcon,
} from 'react-native-heroicons/solid';
import SearchBar from '../BaseComponents/SearchBar';
import CardView from '../BaseComponents/CardView';
import Header from '../BaseComponents/Header';
import {useNavigation} from '@react-navigation/native';
import {Routes} from '../../navigation/Routes';

var {width, height} = Dimensions.get('window');
export default function Home() {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <ScrollView>
        <Header />
        <View>
          <SearchBar />
        </View>
        <View style={{flexWrap: 'wrap'}}>
          <CardView />
        </View>
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          marginTop: height * 0.91,
          marginLeft: 341,
          height: 50,
          width: 50,
        }}>
        <TouchableOpacity onPress={() => navigation.navigate(Routes.MapScreen)}>
          <Image
            source={require('../../assets/Images/Map.png')}
            style={{
              height: height * 0.055,
              width: width * 0.08,
              overflow: 'hidden',
              borderRadius: 100,
            }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
