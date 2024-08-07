import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from './Header';
import {useRoute} from '@react-navigation/native';
import {StarIcon} from 'react-native-heroicons/solid';
import SimilarStyles from './SimilarStyles';

var {width, height} = Dimensions.get('window');
export default function ProductDetail({data}) {
  const [star, setStar] = useState([1, 2, 3, 4, 5]);
  const route = useRoute();
  const item = route.params;
  const [shopAvailability, setShopAvailability] = useState([1, 2, 3, 4]);
  return (
    <SafeAreaView>
      <ScrollView>
        <Header />
        <Image
          source={{uri: item.image}}
          style={{
            width: width * 1,
            height: height * 0.59,
            marginTop: -8,
            overflow: 'hidden',
          }}
        />
        <View style={{marginLeft: 12}}>
          <View>
            <Text style={{color: 'red', fontWeight: 'bold', fontSize: 20}}>
              {item.title}
            </Text>
            <Text style={{color: 'black', fontWeight: 'bold'}}>
              {item.price}
            </Text>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: 2,
                }}>
                {star.map((item, index) => {
                  return <StarIcon key={index} color={'black'} size={15} />;
                })}
              </View>
              <Text style={{color: 'black', marginLeft: 10}}>
                {item.rating}
              </Text>
            </View>
            <Text style={{color: 'black'}}>Description</Text>
            <Text>{item.description}</Text>
          </View>
          <View style={{marginTop: 7}}>
            <Text
              style={{color: 'black', fontWeight: 'bold', marginBottom: 10}}>
              Availablility
            </Text>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              {shopAvailability.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={{
                      borderWidth: 0.5,
                      borderRadius: 20,
                      padding: 5,
                      marginRight: 5,
                    }}>
                    <Text>ABC Shop</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View style={{marginTop: 7}}>
            <Text
              style={{color: 'black', fontWeight: 'bold', marginBottom: 10}}>
              Product Details
            </Text>
            <View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: 3,
                }}>
                <Text style={{color: 'black', fontWeight: 'bold'}}>Brand</Text>
                <TextInput
                  style={{
                    borderRadius: 20,
                    borderWidth: 0.5,
                    width: 150,
                    height: 10,
                    marginLeft: 40,
                  }}
                />
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: 3,
                }}>
                <Text style={{color: 'black', fontWeight: 'bold'}}>Colour</Text>
                <TextInput
                  style={{
                    borderRadius: 20,
                    borderWidth: 0.5,
                    width: 150,
                    height: 10,
                    marginLeft: 38,
                  }}
                />
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: 3,
                }}>
                <Text style={{color: 'black', fontWeight: 'bold'}}>Price</Text>
                <TextInput
                  style={{
                    borderRadius: 20,
                    borderWidth: 0.5,
                    width: 150,
                    height: 10,
                    marginLeft: 46,
                  }}
                />
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: 3,
                }}>
                <Text style={{color: 'black', fontWeight: 'bold'}}>Type</Text>
                <TextInput
                  style={{
                    borderRadius: 20,
                    borderWidth: 0.5,
                    width: 150,
                    height: 10,
                    marginLeft: 49,
                  }}
                />
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: 3,
                }}>
                <Text style={{color: 'black', fontWeight: 'bold'}}>
                  Occassion
                </Text>
                <TextInput
                  style={{
                    borderRadius: 20,
                    borderWidth: 0.5,
                    width: 150,
                    height: 10,
                    marginLeft: 16,
                  }}
                />
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: 3,
                }}>
                <Text style={{color: 'black', fontWeight: 'bold'}}>Fabric</Text>
                <TextInput
                  style={{
                    borderRadius: 20,
                    borderWidth: 0.5,
                    width: 150,
                    height: 10,
                    marginLeft: 43,
                  }}
                />
              </View>
            </View>
          </View>
          <View style={{marginTop: 10}}>
            <Text style={{color: 'black', fontWeight: 'bold'}}>
              Friends Openion
            </Text>
            <View style={{display: 'flex', flexDirection: 'row', marginTop: 2}}>
              {star.map((item, index) => {
                return <StarIcon key={index} color={'black'} size={15} />;
              })}
            </View>
          </View>
          <View style={{marginTop: 10}}>
            <Text style={{color: 'black', fontWeight: 'bold'}}>
              Similar Style
            </Text>
            <SimilarStyles />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
