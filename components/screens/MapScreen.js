import React, {useEffect, useState} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {MapPinIcon, StarIcon} from 'react-native-heroicons/solid';
import MapView, {Callout, MapMarker, Marker} from 'react-native-maps';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {markers} from '../BaseComponents/MapData';
import {supabase} from '../../createClinet';

const mapDarkStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#212121',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#212121',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#181818',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#1b1b1b',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#2c2c2c',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#8a8a8a',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      {
        color: '#373737',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#3c3c3c',
      },
    ],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [
      {
        color: '#4e4e4e',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#000000',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#3d3d3d',
      },
    ],
  },
];

const mapStantardStyle = [
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
];
var {width, height} = Dimensions.get('window');
export default function MapScreen() {
  const [star, setStar] = useState([1, 2, 3, 4, 5]);
  const [darkMode, setDarkMode] = useState(true);
  const [shopData, setShopData] = useState({});
  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      height: '100%',
      width: 400,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
  });

  const fetchDataProducts = async () => {
    const {data, error} = await supabase.from('shops').select('*');
    if (error) {
      console.error(error);
    } else {
      setShopData(data);
    }
  };
  useEffect(() => {
    fetchDataProducts();
  }, []);
  useEffect(() => {
    fetchDataProducts();
  }, []);

  useEffect(() => {
    console.log(shopData);
  }, [shopData]);
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        customMapStyle={darkMode ? mapDarkStyle : mapStantardStyle}
        region={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}>
        {markers.map((item, index) => {
          return (
            <Marker
              key={index}
              coordinate={item.coordinate}
              icon={<MapPinIcon color="red" size={10} />}
              title="Test Title"
              description="This is the best description">
              <Callout>
                <View>
                  <Text
                    style={{color: 'black', fontWeight: 'bold', fontSize: 20}}>
                    Veecha Shop No 11
                  </Text>
                  <Text>Cloth Collection </Text>

                  <Image
                    style={{height: 100, width: 100}}
                    source={require('../../assets/Images/product4.png')}
                  />
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
      <Animated.ScrollView
        horizontal
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={width * 0.8 + 20}>
        {markers.map((item, index) => {
          return (
            <View key={index} style={{marginTop: 580}}>
              <View
                style={{
                  margin: 10,
                  display: 'flex',
                  flexDirection: 'row',
                }}>
                <Image
                  style={{height: height * 0.2, width: width * 0.3}}
                  source={{uri: item.image}}
                />
                <View style={{backgroundColor: 'white'}}>
                  <Text
                    style={{color: 'black', fontWeight: 'bold', fontSize: 18}}>
                    {item.title}
                  </Text>
                  <Text style={{color: 'black'}}>{item.description}</Text>
                  <View style={{display: 'flex', flexDirection: 'row'}}>
                    {star.map((item, index) => {
                      return <StarIcon key={index} color="black" size={10} />;
                    })}
                  </View>
                  <TouchableOpacity
                    style={{
                      marginTop: 10,
                      borderWidth: 0.5,
                      marginHorizontal: 'auto',
                      paddingLeft: 15,
                      paddingRight: 15,
                    }}>
                    <Text style={{color: 'green', fontWeight: 'bold'}}>
                      {' '}
                      Visit Shop
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </Animated.ScrollView>
      <TouchableOpacity
        onPress={() => (darkMode ? setDarkMode(false) : setDarkMode(true))}
        style={{marginBottom: 5}}>
        <View
          style={{
            borderWidth: darkMode ? 0.5 : 1.2,
            borderColor: darkMode ? 'white' : 'black',
            borderRadius: 5,
            paddingLeft: 10,
            paddingRight: 7,
            backgroundColor: darkMode ? 'transparent' : 'white',
          }}>
          {darkMode ? (
            <Text style={{color: 'red', fontWeight: 'bold'}}>LightMode</Text>
          ) : (
            <Text style={{color: 'red', fontWeight: 'bold'}}>DarkMode</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}
