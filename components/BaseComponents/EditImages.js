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
import Header from './Header';
import {useNavigation, useRoute} from '@react-navigation/native';
import SearchBar from './SearchBar';
import {DummyImage} from './CardView';
import {PencilSquareIcon, TrashIcon} from 'react-native-heroicons/solid';

var {width, height} = Dimensions.get('window');
export default function EditImages() {
  const route = useRoute();
  const item = route.params;
  console.log('Edit Images', item);
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <Header />
      <SearchBar />
      <ScrollView>
        <Text>Hello </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginLeft: 10,
          }}>
          {item.map((item, index) => {
            return (
              <View key={index} style={{margin: 5}}>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    zIndex: 0.5,
                    marginTop: 10,
                    marginLeft: 150,
                  }}>
                  <TrashIcon size={20} color="black" />
                </TouchableOpacity>
                <Image
                  style={{
                    height: height * 0.3,
                    width: width * 0.45,
                    overflow: 'hidden',
                  }}
                  source={{
                    uri: item.image_path,
                  }}
                />
              </View>
            );
          })}
        </View>
        <TouchableOpacity style={{backgroundColor: '#8ed1fc', margin: 13}}>
          <Text
            style={{
              color: 'black',
              fontWeight: 'bold',
              marginHorizontal: 'auto',
              fontSize: 16,
            }}>
            Add New Images
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
