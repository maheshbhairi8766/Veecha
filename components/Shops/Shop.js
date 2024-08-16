import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {Dimensions, ScrollView, TouchableOpacity, View} from 'react-native';
import {Image} from 'react-native';
import {Text} from 'react-native';
import {SafeAreaView} from 'react-native';
import {
  HeartIcon,
  MapPinIcon,
  PhoneIcon,
  StarIcon,
} from 'react-native-heroicons/solid';
import {ArrowLeftCircleIcon} from 'react-native-heroicons/solid';
import {color} from 'react-native-elements/dist/helpers';
import ShopTabBar from '../../navigation/ShopTabBar';
import {Routes} from '../../navigation/Routes';

var {width, height} = Dimensions.get('window');
export default function Shop() {
  const route = useRoute();
  const item = route.params;
  //console.log('Shop item data', item);
  const navigation = useNavigation();
  const [heart, setHeart] = useState(false);
  return (
    <SafeAreaView>
      <ScrollView>
        <View
          style={{
            zIndex: 0.5,
            position: 'absolute',
            display: 'flex',
            flexDirection: 'row',
            margin: 10,
          }}>
          <ArrowLeftCircleIcon
            color="white"
            size={24}
            onPress={() => navigation.goBack()}
          />
          <TouchableOpacity>
            <HeartIcon
              onPress={() => (heart ? setHeart(false) : setHeart(true))}
              style={{color: heart ? 'red' : 'green', marginLeft: 320}}
              color="black"
              size={24}
            />
          </TouchableOpacity>
        </View>
        <View style={{}}>
          <Image
            source={require('../../assets/Images/shop.jpg')}
            style={{height: height * 0.2, width: width * 1}}
          />
        </View>
        <View>
          <Text style={{color: 'green', marginHorizontal: 'auto'}}>
            GET 10% OFF ON BRANDED CLOTHS
          </Text>
          <View style={{display: 'flex', flexDirection: 'row', marginTop: 7}}>
            <View style={{marginLeft: 10}}>
              <Text style={{fontSize: 20, color: 'black', fontWeight: 'bold'}}>
                {item.name}
              </Text>
              <Text>{item.address}</Text>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <StarIcon
                    size={15}
                    color="gray"
                    style={{marginTop: 2, marginRight: 2}}
                  />
                  <Text>4.9(272+)</Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginLeft: 20,
                  }}>
                  <Text>
                    <PhoneIcon color="gray" size={15} />
                    <Text>{item.phone}</Text>
                  </Text>
                </View>
              </View>
            </View>
            <View style={{marginLeft: 50}}>
              <Text>Map</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate(Routes.MapView)}>
                <MapPinIcon size={30} color="gray" style={{marginTop: 3}} />
              </TouchableOpacity>
            </View>
            <View style={{marginLeft: 30}}>
              <Text style={{marginLeft: 8}}>Call</Text>
              <View
                style={{
                  height: 45,
                  width: 45,
                  borderWidth: 0.5,
                  borderRadius: 50,
                  paddingTop: 12,
                  paddingLeft: 15,
                  backgroundColor: 'red',
                }}>
                <PhoneIcon size={18} color="white" />
              </View>
            </View>
          </View>
        </View>
        <View>
          <ShopTabBar item={item} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
